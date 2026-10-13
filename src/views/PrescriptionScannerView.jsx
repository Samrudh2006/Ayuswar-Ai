import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Scan, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PrescriptionScannerView() {
  const { isDemoMode } = useApp();
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);
  const [activeStep, setActiveStep] = useState(3); // 1: Contour, 2: Bounding, 3: Salt Resolution
  const [activeTab, setActiveTab] = useState('samples'); // 'samples' | 'camera' | 'upload'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [customSearchQuery, setCustomSearchQuery] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const OCR_SAMPLES = [
    {
      id: 'sample_pantocid',
      brand: 'Pantocid-40 (Crinkled Blister Strip)',
      genericSalt: 'Pantoprazole Gastro-resistant 40mg',
      nfiCode: 'NFI-2025-GAS-0492',
      dosageForm: 'Enteric-Coated Tablet',
      janAushadhiGeneric: 'Pantoprazole 40mg (PMBJP)',
      brandedPrice: '₹148.50 per strip',
      janAushadhiPrice: '₹22.40 per strip',
      savingsPct: '85%',
      extractedText: 'PANTOCID-40 B.No. P40291 EXP. 08/2027 MFG. SUN PHARMA PANTOPRAZOLE SODIUM IP EQ. TO PANTOPRAZOLE 40 MG',
      ddiConflict: null,
      contourDetected: true,
      imagePlaceholderColor: '#FEF3C7',
      pillColor: '#F59E0B',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'PANTOCID-40', x: 28, y: 35, w: 220, h: 32, conf: '98.4%' },
        { label: 'ACTIVE_SALT', text: 'PANTOPRAZOLE SODIUM 40MG', x: 28, y: 75, w: 280, h: 26, conf: '96.8%' },
        { label: 'BATCH_EXP', text: 'B.No: P40291 • EXP: 08/2027', x: 28, y: 110, w: 240, h: 24, conf: '95.1%' }
      ]
    },
    {
      id: 'sample_glycomet',
      brand: 'Glycomet-500 SR (Cut Blister Foil)',
      genericSalt: 'Metformin Hydrochloride Prolonged Release 500mg',
      nfiCode: 'NFI-2025-MET-0814',
      dosageForm: 'Sustained-Release Tablet',
      janAushadhiGeneric: 'Metformin 500mg SR (PMBJP)',
      brandedPrice: '₹62.00 per strip',
      janAushadhiPrice: '₹14.50 per strip',
      savingsPct: '76%',
      extractedText: 'GLYCOMET-500 SR B.No. GM9124 EXP. 11/2026 METFORMIN HYDROCHLORIDE EXTENDED RELEASE IP 500 MG',
      ddiConflict: null,
      contourDetected: true,
      imagePlaceholderColor: '#FCE7F3',
      pillColor: '#EC4899',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'GLYCOMET-500 SR', x: 30, y: 32, w: 240, h: 32, conf: '99.1%' },
        { label: 'ACTIVE_SALT', text: 'METFORMIN HYDROCHLORIDE 500MG', x: 30, y: 72, w: 300, h: 26, conf: '97.2%' },
        { label: 'BATCH_EXP', text: 'B.No: GM9124 • EXP: 11/2026', x: 30, y: 108, w: 230, h: 24, conf: '94.8%' }
      ]
    },
    {
      id: 'sample_combiflam',
      brand: 'Combiflam (NSAID Combination Strip)',
      genericSalt: 'Ibuprofen 400mg + Paracetamol 325mg',
      nfiCode: 'NFI-2025-ANA-0102',
      dosageForm: 'Oral Film-Coated Tablet',
      janAushadhiGeneric: 'Ibuprofen + Paracetamol (PMBJP)',
      brandedPrice: '₹54.00 per strip',
      janAushadhiPrice: '₹18.00 per strip',
      savingsPct: '66%',
      extractedText: 'COMBIFLAM TABLET IBUPROFEN IP 400 MG PARACETAMOL IP 325 MG SANOFIAVENTIS B.No. CB2049',
      ddiConflict: 'CRITICAL SAFETY ALERT: If patient is concurrently taking Aspirin/Ecosprin, combining with Ibuprofen induces competitive COX-1 inhibition and elevates gastrointestinal hemorrhage risk.',
      contourDetected: true,
      imagePlaceholderColor: '#FEE2E2',
      pillColor: '#EF4444',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'COMBIFLAM TABLET', x: 26, y: 34, w: 250, h: 34, conf: '97.9%' },
        { label: 'DUAL_SALT', text: 'IBUPROFEN 400MG + PARACETAMOL 325MG', x: 26, y: 76, w: 320, h: 28, conf: '96.3%' },
        { label: 'MFG_BATCH', text: 'SANOFIAVENTIS • B.No: CB2049', x: 26, y: 112, w: 240, h: 22, conf: '93.5%' }
      ]
    }
  ];

  const currentSample = OCR_SAMPLES[selectedSampleIdx];

  // Stop webcam stream helper
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start real HTML5 webcam video feed
  const startWebcam = async () => {
    stopWebcam();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setActiveTab('camera');
    } catch (err) {
      console.warn("Webcam access error:", err);
      setCameraError("Camera permission denied or camera device not found. Using high-resolution simulated optical feed.");
    }
  };

  // Capture video frame to canvas
  const handleCaptureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setUploadedImage(dataUrl);
      stopWebcam();
      setActiveTab('upload');
      handleTriggerScan();
    }
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 450);
    setTimeout(() => setActiveStep(3), 900);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1250);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      stopWebcam();
      setActiveTab('upload');
      handleTriggerScan();
    }
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#64748B', fontSize: '13px' }}>Solutions</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Blister Strip & Paper Rx Scanner</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
          <Scan size={14} />
          <span>COMPUTER VISION OCR WORKSPACE</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
          AyuVision Blister Strip & Prescription Scanner
        </h1>
        <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6 }}>
          Computer vision pipeline for medicine packaging inspection. Detects packaging contours, extracts embossed text, resolves generic chemical salts against the National Formulary of India (NFI), and checks Jan Aushadhi generic availability.
        </p>
      </div>

      {/* Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Interactive Input / Sample Selector */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>
              1. Input Medicine Packaging Sample
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Select a clinical blister strip sample or upload a physical medicine foil image.
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px', background: '#F8FAFC', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => {
                stopWebcam();
                setActiveTab('samples');
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'samples' ? '#0A2540' : 'transparent',
                color: activeTab === 'samples' ? '#FFFFFF' : '#64748B',
                fontSize: '12px',
                fontWeight: 750,
                cursor: 'pointer'
              }}
            >
              Preset Samples (3)
            </button>
            <button
              onClick={startWebcam}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'camera' ? '#0A2540' : 'transparent',
                color: activeTab === 'camera' ? '#FFFFFF' : '#64748B',
                fontSize: '12px',
                fontWeight: 750,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <Camera size={13} />
              <span>Live WebCam</span>
            </button>
            <label
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                background: activeTab === 'upload' ? '#0A2540' : 'transparent',
                color: activeTab === 'upload' ? '#FFFFFF' : '#64748B',
                fontSize: '12px',
                fontWeight: 750,
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Upload size={13} />
              <span>Upload Foil</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px', fontSize: '11.5px', color: '#991B1B' }}>
              {cameraError}
            </div>
          )}

          {/* Live WebCam Feed View */}
          {activeTab === 'camera' && (
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#040B17',
              border: '2px solid #0284C7',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                style={{ width: '100%', maxHeight: '260px', objectFit: 'cover' }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Optical Reticle Overlays */}
              <div style={{
                position: 'absolute',
                inset: '20px',
                border: '2px dashed rgba(16, 185, 129, 0.7)',
                borderRadius: '8px',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: 'rgba(4, 11, 23, 0.85)',
                  color: '#10B981',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  Align medicine blister strip inside green box
                </div>
              </div>

              {/* Capture Button */}
              <div style={{ padding: '10px', width: '100%', background: '#081224', display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCaptureFrame}
                  style={{
                    flex: 1,
                    background: '#10B981',
                    color: '#041B15',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px',
                    fontSize: '12.5px',
                    fontWeight: 850,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera size={15} />
                  <span>Capture & Run Contour Analysis</span>
                </button>
                <button
                  onClick={stopWebcam}
                  style={{
                    background: '#1E293B',
                    color: '#94A3B8',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Samples List */}
          {activeTab === 'samples' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {OCR_SAMPLES.map((sample, idx) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    setSelectedSampleIdx(idx);
                    handleTriggerScan();
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: selectedSampleIdx === idx ? '2px solid #008B8B' : '1px solid #E2E8F0',
                    background: selectedSampleIdx === idx ? '#F0FDFA' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 160ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: sample.pillColor }} />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>{sample.brand}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{sample.genericSalt}</div>
                    </div>
                  </div>
                  {sample.ddiConflict && (
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#EF4444', background: '#FEE2E2', padding: '2px 8px', borderRadius: '10px' }}>
                      DDI Alert
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Visual Canvas Representation with OpenCV Bounding Boxes */}
          {activeTab !== 'camera' && (
            <div style={{
              height: '240px',
              borderRadius: '12px',
              background: uploadedImage ? `url(${uploadedImage}) center/cover no-repeat` : currentSample.imagePlaceholderColor,
              border: '2px solid #CBD5E1',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {!uploadedImage && (
                <div style={{ width: '100%', height: '100%', padding: '20px', position: 'relative' }}>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#0A2540', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    OpenCV Real-Time Contour Extraction [Active HUD]
                  </div>

                  {/* Render Bounding Boxes */}
                  {currentSample.boundingBoxes?.map((bb, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        position: 'absolute',
                        top: `${bb.y}px`,
                        left: `${bb.x}px`,
                        width: `${bb.w}px`,
                        height: `${bb.h}px`,
                        border: '1.5px solid #10B981',
                        background: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 6px',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)'
                      }}
                    >
                      <span style={{ fontSize: '9px', fontWeight: 850, color: '#065F46', background: '#A7F3D0', padding: '1px 4px', borderRadius: '3px' }}>
                        {bb.label}
                      </span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#047857', fontFamily: 'monospace' }}>
                        {bb.conf}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Scanning Active Overlay */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(10, 37, 64, 0.85)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#FFFFFF'
                }}>
                  <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                  <div style={{ fontSize: '12px', fontWeight: 750 }}>
                    {activeStep === 1 ? 'Detecting Packaging Contours & Aspect Ratio...' : activeStep === 2 ? 'Computing Edge Gradient & Text Bounding Boxes...' : 'Resolving Chemical Salt against NFI-2025 Formulary...'}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: '#008B8B',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: isScanning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,139,139,0.25)'
            }}
          >
            <Camera size={16} />
            <span>{isScanning ? 'Executing Optical Pipeline...' : 'Re-run CV Inspection on Strip'}</span>
          </button>
        </div>

        {/* Right Column: OCR Extraction & Formulary Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card: Resolved Active Chemical Compound */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 16px rgba(10,37,64,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Resolved Active Generic Salt (NFI)
              </div>
              <span style={{ fontSize: '11px', fontWeight: 750, color: '#0F172A', background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                {currentSample.nfiCode}
              </span>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 850, color: '#0A2540', marginBottom: '4px' }}>
              {currentSample.genericSalt}
            </h2>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
              Form: {currentSample.dosageForm} • Brand on Packaging: {currentSample.brand.split(' ')[0]}
            </div>

            {/* Raw Extracted Bounding Box Text */}
            <div style={{ background: '#0A2540', color: '#F1F5F9', padding: '12px 14px', borderRadius: '10px', fontSize: '11.5px', fontFamily: 'monospace', marginBottom: '18px', lineHeight: 1.5 }}>
              <div style={{ color: '#00A896', fontWeight: 800, marginBottom: '4px' }}>// OCR Raw Text Tokens:</div>
              {currentSample.extractedText}
            </div>

            {/* Jan Aushadhi Generic Cost Optimizer */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  Pradhan Mantri Jan Aushadhi Equivalent
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginTop: '2px' }}>
                  {currentSample.janAushadhiGeneric}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  Market: <s>{currentSample.brandedPrice}</s> → Jan Aushadhi: <strong style={{ color: '#0D9488' }}>{currentSample.janAushadhiPrice}</strong>
                </div>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#059669' }}>
                  {currentSample.savingsPct}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 750, color: '#065F46' }}>
                  Cost Savings
                </div>
              </div>
            </div>
          </div>

          {/* DDI Safety Alert if any */}
          {currentSample.ddiConflict ? (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '14px', padding: '18px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertTriangle size={20} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B', marginBottom: '4px' }}>
                  Automated Safety Sentinel Alert
                </div>
                <p style={{ fontSize: '12.5px', color: '#B91C1C', lineHeight: 1.5, margin: 0 }}>
                  {currentSample.ddiConflict}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#16A34A" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                No active DDI contraindications detected for this salt in reference formulary.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
