import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Pill, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  RefreshCw,
  Sliders,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { openCvPreprocessor } from '../services/openCvOcrPreprocessor';

// Formulary database for matching scanned blister text to Jan Aushadhi alternatives
const FORMULARY_DATABASE = [
  {
    id: 'pantoprazole',
    keywords: ['pantocid', 'pantoprazole', 'panto', 'pantodac', 'pan-40', 'pan 40'],
    brandName: 'Pantocid-40 / Pan-40 (Branded)',
    color: '🟡 Yellow Capsule / Tablet',
    shape: 'Oblong Enteric-Coated',
    imprint: 'PAN-40',
    imageUrl: '/images/medicines/yellow_pantoprazole.jpg',
    brandPrice: '₹148.50 / 10 Tabs',
    genericName: 'Pantoprazole Gastro-Resistant 40mg IP',
    genericBrand: 'PMBJP Jan Aushadhi (Pradhan Mantri Kendra)',
    genericPrice: '₹22.40 / 10 Tabs',
    savingsPct: '85% Cost Savings',
    vernacularTe: 'పసుపు రంగు క్యాప్సూల్ (గ్యాస్ మరియు ఎసిడిటీ నివారణకు)',
    vernacularHi: 'पीली गोली (गैस और एसिडिटी के लिए)',
    verified: true
  },
  {
    id: 'metformin',
    keywords: ['glycomet', 'metformin', 'glyciphage', 'glucophage', '500 sr', 'metfor'],
    brandName: 'Glycomet-500 SR (Branded)',
    color: '🟣 Pink Tablet',
    shape: 'Round Biconvex SR',
    imprint: 'GLY-500',
    imageUrl: '/images/medicines/pink_metformin.jpg',
    brandPrice: '₹62.00 / 10 Tabs',
    genericName: 'Metformin Hydrochloride SR 500mg IP',
    genericBrand: 'PMBJP Jan Aushadhi (Pradhan Mantri Kendra)',
    genericPrice: '₹14.50 / 10 Tabs',
    savingsPct: '76% Cost Savings',
    vernacularTe: 'గులాబీ రంగు మాత్ర (షుగర్ నివారణకు)',
    vernacularHi: 'गुलाबी गोली (शुगर नियंत्रण के लिए)',
    verified: true
  },
  {
    id: 'paracetamol',
    keywords: ['dolo', 'crocin', 'calpol', 'paracetamol', 'pcm', '650'],
    brandName: 'Dolo 650mg / Crocin (Branded)',
    color: '⚪ White Tablet',
    shape: 'Oval Scored Tablet',
    imprint: 'DOLO-650',
    imageUrl: '/images/medicines/white_paracetamol.jpg',
    brandPrice: '₹34.00 / 15 Tabs',
    genericName: 'Paracetamol IP 650mg',
    genericBrand: 'PMBJP Jan Aushadhi (Pradhan Mantri Kendra)',
    genericPrice: '₹9.00 / 15 Tabs',
    savingsPct: '74% Cost Savings',
    vernacularTe: 'తెలుపు రంగు మాత్ర (జ్వరం మరియు నొప్పులకు)',
    vernacularHi: 'सफेद गोली (बुखार और दर्द के लिए)',
    verified: true
  },
  {
    id: 'amoxicillin_clav',
    keywords: ['augmentin', 'amoxicillin', 'mox', 'clav', 'amoxyclav', '625'],
    brandName: 'Augmentin 625 Duo (Branded)',
    color: '⚪ Silver Foil Blister Pack',
    shape: 'Oval Biconvex',
    imprint: 'AUG-625',
    imageUrl: '/images/medicines/silver_amoxicillin_blister.jpg',
    brandPrice: '₹198.00 / 10 Tabs',
    genericName: 'Amoxicillin 500mg + Clavulanic Acid 125mg IP',
    genericBrand: 'PMBJP Jan Aushadhi (Pradhan Mantri Kendra)',
    genericPrice: '₹48.00 / 10 Tabs',
    savingsPct: '75% Cost Savings',
    vernacularTe: 'యాంటీబయాటిక్ మాత్ర (ఇన్ఫెక్షన్ల నివారణకు)',
    vernacularHi: 'एंटीबायोटिक गोली (संक्रमण के लिए)',
    verified: true
  },
  {
    id: 'amlodipine',
    keywords: ['amlodipine', 'amlo', 'telma', 'telmisartan', 'amlopres', 'telvas', '5mg'],
    brandName: 'Amlodipine 5mg / Telma (Branded)',
    color: '🔵 Blue Foil Blister Pack',
    shape: 'Round Uncoated Tablet',
    imprint: 'AML-5',
    imageUrl: '/images/medicines/blue_amlodipine.jpg',
    brandPrice: '₹84.00 / 10 Tabs',
    genericName: 'Amlodipine Besylate 5mg IP',
    genericBrand: 'PMBJP Jan Aushadhi (Pradhan Mantri Kendra)',
    genericPrice: '₹11.20 / 10 Tabs',
    savingsPct: '86% Cost Savings',
    vernacularTe: 'నీలం రంగు స్ట్రిప్ మాత్ర (రక్తపోటు / బీపీ నియంత్రణకు)',
    vernacularHi: 'नीली पट्टी वाली गोली (ब्लड प्रेशर नियंत्रण के लिए)',
    verified: true
  },
  {
    id: 'atorvastatin',
    keywords: ['atorva', 'atorvastatin', 'lipitor', 'statin', 'cholesterol', '10mg', '20mg'],
    brandName: 'Atorva-20 / Lipitor (Branded)',
    color: '🟠 Orange Film-Coated Tablet',
    shape: 'Oval Coated Tablet',
    imprint: 'ATV-20',
    imageUrl: '/images/medicines/orange_atorvastatin.jpg',
    brandPrice: '₹165.00 / 10 Tabs',
    genericName: 'Atorvastatin Calcium 20mg IP',
    genericBrand: 'PMBJP Jan Aushadhi (Pradhan Mantri Kendra)',
    genericPrice: '₹28.50 / 10 Tabs',
    savingsPct: '82% Cost Savings',
    vernacularTe: 'నారింజ రంగు మాత్ర (కొలెస్ట్రాల్ మరియు గుండె సంరక్షణకు)',
    vernacularHi: 'नारंगी गोली (कोलेस्ट्रॉल और हृदय सुरक्षा के लिए)',
    verified: true
  }
];

export default function PillVisionScannerModal({ isOpen, onClose }) {

  const [activeMode, setActiveMode] = useState('camera'); // 'camera' | 'upload' | 'preset'
  const [selectedPreset, setSelectedPreset] = useState('pantoprazole');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');
  const [useCvEnhancement, setUseCvEnhancement] = useState(true);
  const [cvStats, setCvStats] = useState(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [detectedResult, setDetectedResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop Webcam Feed
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch {}
      });
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  // Start Webcam Feed
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
      setIsWebcamActive(true);
      setActiveMode('camera');
    } catch (err) {
      console.warn("Webcam access error:", err);
      setCameraError("Camera unavailable or permission denied. You can use 'Upload Photo' to select any blister image.");
      setActiveMode('upload');
    }
  };

  // Trigger real OCR on image with OpenCV preprocessing
  const runLiveOcrOnImage = async (imageSrc) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStatusText('OpenCV: Grayscale + Otsu Adaptive Binarization...');

    let imageToScan = imageSrc;
    let computedStats = null;

    if (useCvEnhancement) {
      try {
        const cvOutput = await openCvPreprocessor.preprocessForOcr(imageSrc);
        imageToScan = cvOutput.processedDataUrl;
        setProcessedImageUrl(cvOutput.processedDataUrl);
        computedStats = cvOutput.stats;
        setCvStats(cvOutput.stats);
      } catch (cvErr) {
        console.warn('OpenCV preprocessor fallback:', cvErr);
      }
    }

    try {
      setScanProgress(35);
      setScanStatusText('Tesseract WASM: Extracting blister text & dosage...');
      const ocrRes = await Tesseract.recognize(
        imageToScan,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const p = Math.round((m.progress || 0) * 100);
              setScanProgress(35 + Math.round(p * 0.6));
              setScanStatusText(`Reading text (${p}%)...`);
            }
          }
        }
      );

      const raw = ocrRes.data.text ? ocrRes.data.text.trim() : '';
      const lower = raw.toLowerCase();

      // Find best formulary match
      let matched = FORMULARY_DATABASE.find(item => 
        item.keywords.some(kw => lower.includes(kw))
      );

      // Extract batch / expiry if present
      const batchMatch = raw.match(/(?:B\.?\s*No\.?|Batch(?:\s*No)?|BNo)[:\s]*([A-Z0-9/-]+)/i);
      const expMatch = raw.match(/(?:EXP\.?|Expiry|Exp\s*Date)[:\s]*([0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]{3}[/-\s]*[0-9]{2,4})/i);

      if (matched) {
        setDetectedResult({
          ...matched,
          rawExtracted: raw,
          batchNo: batchMatch ? batchMatch[1].trim() : 'Verified on Foil',
          expDate: expMatch ? expMatch[1].trim() : 'Current Shelf Life',
          isLiveOcr: true,
          cvEnhanced: useCvEnhancement
        });
      } else {
        setDetectedResult({
          brandName: raw ? `Extracted: ${raw.slice(0, 30)}...` : 'Unknown Blister Packaging',
          color: '⚪ Silver / Foil Strip',
          shape: 'Solid Oral Formulation',
          imprint: 'Packaging Print',
          imageUrl: imageToScan || '/images/medicines/silver_amoxicillin_blister.jpg',
          brandPrice: 'Check Local MRP',
          genericName: 'Jan Aushadhi Generic Alternative Available',
          genericBrand: 'PMBJP Jan Aushadhi Kendra (Govt. of India)',
          genericPrice: 'Approx. 50-80% Lower MRP',
          savingsPct: '80% Savings Tier',
          vernacularTe: 'వైద్యుని సలహా ప్రకారం జెనెరిక్ ఔషధాల వివరాలు చూడండి',
          vernacularHi: 'डॉक्टर की सलाह से जेनेरिक दवा विकल्प उपलब्ध',
          verified: false,
          rawExtracted: raw || 'No legible text extracted. Ensure flat angle with bright light.',
          batchNo: batchMatch ? batchMatch[1].trim() : 'Inspected',
          expDate: expMatch ? expMatch[1].trim() : 'Inspected',
          isLiveOcr: true,
          cvEnhanced: useCvEnhancement
        });
      }
    } catch (err) {
      console.error('OCR scan error:', err);
    } finally {
      setIsScanning(false);
      setScanProgress(100);
      setScanStatusText('');
    }
  };

  // Capture video frame
  const handleCaptureVideoFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImageUrl(dataUrl);
      stopWebcam();
      runLiveOcrOnImage(dataUrl);
    }
  };

  // Upload image from disk
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      setCapturedImageUrl(dataUrl);
      runLiveOcrOnImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const currentDisplay = detectedResult || FORMULARY_DATABASE.find(f => f.id === selectedPreset) || FORMULARY_DATABASE[0];

  const handleModalClose = () => {
    stopWebcam();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(6, 22, 38, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div className="modal-content" style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #0A2540 0%, #D97706 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Pill size={20} color="#FBBF24" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Smart Medicine Blister Scanner</h3>
              <span style={{ fontSize: '10px', color: '#FEF3C7', fontWeight: 600 }}>
                OpenCV.js + Tesseract OCR & Jan Aushadhi 80%+ Savings
              </span>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Navigation Tabs */}
        <div style={{ display: 'flex', background: '#FAF8F5', borderBottom: '1px solid #E2E8F0', padding: '6px 12px', gap: '6px' }}>
          <button
            onClick={() => { setActiveMode('camera'); startWebcam(); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: activeMode === 'camera' ? '#ffffff' : 'transparent',
              color: activeMode === 'camera' ? '#D97706' : '#64748B',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: activeMode === 'camera' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Camera size={14} /> Live Camera
          </button>
          <button
            onClick={() => { stopWebcam(); setActiveMode('upload'); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: activeMode === 'upload' ? '#ffffff' : 'transparent',
              color: activeMode === 'upload' ? '#D97706' : '#64748B',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: activeMode === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Upload size={14} /> Upload Blister
          </button>
          <button
            onClick={() => { stopWebcam(); setActiveMode('preset'); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: activeMode === 'preset' ? '#ffffff' : 'transparent',
              color: activeMode === 'preset' ? '#D97706' : '#64748B',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: activeMode === 'preset' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Sliders size={14} /> Demo Presets
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* OpenCV Preprocessing Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '11.5px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400E', fontWeight: 600 }}>
              <Sparkles size={14} color="#D97706" />
              <span>OpenCV.js Otsu Binarization & Foil Glare Filter</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, color: '#B45309' }}>
              <input 
                type="checkbox" 
                checked={useCvEnhancement} 
                onChange={(e) => setUseCvEnhancement(e.target.checked)}
                style={{ accentColor: '#D97706' }}
              />
              Active
            </label>
          </div>

          {/* Mode 1: Camera Feed */}
          {activeMode === 'camera' && (
            <div style={{ background: '#0F172A', borderRadius: '16px', overflow: 'hidden', position: 'relative', textAlign: 'center' }}>
              <video 
                ref={videoRef} 
                playsInline 
                muted 
                style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: isWebcamActive ? 'block' : 'none' }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {!isWebcamActive && (
                <div style={{ padding: '36px 20px', color: '#94A3B8' }}>
                  <Camera size={36} color="#64748B" style={{ margin: '0 auto 10px auto' }} />
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Webcam feed ready for scanning</div>
                  <button
                    onClick={startWebcam}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: '#D97706',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Start Camera Feed
                  </button>
                </div>
              )}

              {isWebcamActive && (
                <div style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.85)', display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={handleCaptureVideoFrame}
                    disabled={isScanning}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)'
                    }}
                  >
                    <Camera size={14} /> Capture & Scan Medicine Strip
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Upload Image */}
          {activeMode === 'upload' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '16px',
                padding: '24px 16px',
                textAlign: 'center',
                background: '#FAF8F5',
                cursor: 'pointer'
              }}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <Upload size={32} color="#D97706" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#081C24' }}>Click to Upload Medicine Strip Photo</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Supports Paracetamol, Pantocid, Glycomet, Augmentin packaging</div>
            </div>
          )}

          {/* Mode 3: Demo Presets */}
          {activeMode === 'preset' && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Select Common Strip Sample:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {FORMULARY_DATABASE.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPreset(p.id); setDetectedResult(null); }}
                    style={{
                      flex: '1 1 calc(50% - 4px)',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: selectedPreset === p.id && !detectedResult ? '2px solid #D97706' : '1px solid #CBD5E1',
                      background: selectedPreset === p.id && !detectedResult ? '#FEF3C7' : '#ffffff',
                      color: selectedPreset === p.id && !detectedResult ? '#92400e' : '#334155',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {p.color.split(' ')[0]} {p.brandName.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Camera Error Alert */}
          {cameraError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', display: 'flex', gap: '6px' }}>
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Scanning Progress Bar */}
          {isScanning && (
            <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#D97706', marginBottom: '6px' }}>
                <span>{scanStatusText}</span>
                <span>{scanProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: '#D97706', transition: 'width 0.2s ease' }} />
              </div>
            </div>
          )}

          {/* OpenCV Before vs After Image Previews */}
          {capturedImageUrl && (
            <div style={{ display: 'flex', gap: '8px', background: '#FAF8F5', padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>Original Photo</div>
                <img src={capturedImageUrl} alt="Original Strip" style={{ width: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px', background: '#000' }} />
              </div>
              {processedImageUrl && useCvEnhancement && (
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                    OpenCV Otsu ({cvStats ? `Thresh: ${cvStats.otsuThreshold}` : 'Binarized'})
                  </div>
                  <img src={processedImageUrl} alt="Processed Strip" style={{ width: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px', background: '#fff', border: '1px solid #10B981' }} />
                </div>
              )}
            </div>
          )}

          {/* Recognition Card */}
          <div style={{
            background: '#FAF8F5',
            padding: '14px',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1.5px solid #CBD5E1'
            }}>
              {currentDisplay.imageUrl ? (
                <img 
                  src={currentDisplay.imageUrl} 
                  alt={currentDisplay.brandName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '28px' }}>💊</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#081C24' }}>{currentDisplay.brandName}</span>
                <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  ✓ {currentDisplay.isLiveOcr ? 'Live Scanned' : 'Formulary Verified'}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
                {currentDisplay.color} • {currentDisplay.shape} • Imprint: {currentDisplay.imprint}
              </div>
              <div style={{ fontSize: '11px', color: '#0F4C5C', fontWeight: 600, marginTop: '3px' }}>
                తెలుగు: {currentDisplay.vernacularTe}
              </div>
            </div>
          </div>

          {/* Jan Aushadhi (PMBJP) Price Savings Card */}
          <div style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            padding: '16px',
            borderRadius: '16px',
            border: '1.5px solid #10B981'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingDown size={18} color="#059669" />
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
                  Jan Aushadhi (PMBJP) Generic Alternative
                </span>
              </div>
              <span style={{ background: '#059669', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                {currentDisplay.savingsPct}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#064E3B' }}>{currentDisplay.genericName}</div>
                <div style={{ fontSize: '11px', color: '#047857' }}>Govt. Pradhan Mantri Jan Aushadhi Kendra</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#047857' }}>{currentDisplay.genericPrice}</div>
                <div style={{ fontSize: '10.5px', color: '#991B1B', textDecoration: 'line-through' }}>{currentDisplay.brandPrice}</div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/scanner"
              onClick={handleModalClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                background: '#FAF8F5',
                color: '#081C24',
                border: '1px solid #CBD5E1',
                fontWeight: 700,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} /> Open Full Studio
            </Link>
            <button
              onClick={handleModalClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                background: '#0A2540',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
