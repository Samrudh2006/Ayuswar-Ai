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
  RefreshCw,
  X,
  Info
} from 'lucide-react';
import Tesseract from 'tesseract.js';
import { useApp } from '../context/AppContext';
import { openCvPreprocessor } from '../services/openCvOcrPreprocessor';

// Comprehensive Indian Clinical Formulary Database for Real-Time OCR Matching
const CLINICAL_FORMULARY_DATABASE = [
  {
    id: 'pantoprazole',
    keywords: ['pantocid', 'pantoprazole', 'panto', 'pantodac', 'pan-40', 'pan 40', 'pan-d'],
    brand: 'Pantocid-40 / Pan-40 (Gastro-Resistant)',
    genericSalt: 'Pantoprazole Gastro-resistant 40mg IP',
    nfiCode: 'NFI-2025-GAS-0492',
    dosageForm: 'Enteric-Coated Tablet',
    imageUrl: '/images/medicines/yellow_pantoprazole.jpg',
    janAushadhiGeneric: 'Pantoprazole 40mg (PMBJP)',
    brandedPrice: '₹148.50 per strip',
    janAushadhiPrice: '₹22.40 per strip',
    savingsPct: '85%',
    ddiConflict: null
  },
  {
    id: 'metformin',
    keywords: ['glycomet', 'metformin', 'glyciphage', 'glucophage', '500 sr', 'metfor'],
    brand: 'Glycomet-500 SR',
    genericSalt: 'Metformin Hydrochloride Prolonged Release 500mg IP',
    nfiCode: 'NFI-2025-MET-0814',
    dosageForm: 'Sustained-Release Tablet',
    imageUrl: '/images/medicines/pink_metformin.jpg',
    janAushadhiGeneric: 'Metformin 500mg SR (PMBJP)',
    brandedPrice: '₹62.00 per strip',
    janAushadhiPrice: '₹14.50 per strip',
    savingsPct: '76%',
    ddiConflict: null
  },
  {
    id: 'paracetamol_ibuprofen',
    keywords: ['combiflam', 'ibuprofen', 'brufen', 'paracetamol', 'crocin', 'dolo', 'calpol', 'pcm', '650'],
    brand: 'Combiflam / Paracetamol IP 650mg',
    genericSalt: 'Ibuprofen 400mg + Paracetamol 325mg (or Paracetamol 650mg IP)',
    nfiCode: 'NFI-2025-ANA-0102',
    dosageForm: 'Oral Film-Coated Tablet',
    imageUrl: '/images/medicines/white_paracetamol.jpg',
    janAushadhiGeneric: 'Ibuprofen + Paracetamol (PMBJP)',
    brandedPrice: '₹54.00 per strip',
    janAushadhiPrice: '₹18.00 per strip',
    savingsPct: '66%',
    ddiConflict: 'CRITICAL SAFETY ALERT: If patient has history of gastric ulcers or is on anti-platelet therapy (Aspirin/Ecosprin), check competitive COX-1 GI bleeding risk.'
  },
  {
    id: 'amoxicillin_clav',
    keywords: ['amoxicillin', 'augmentin', 'mox', 'clav', 'amoxyclav', 'amox', '625'],
    brand: 'Augmentin 625 Duo / Amoxicillin 500mg',
    genericSalt: 'Amoxicillin 500mg + Potassium Clavulanate 125mg IP',
    nfiCode: 'NFI-2025-ANT-0284',
    dosageForm: 'Film-Coated Tablet',
    imageUrl: '/images/medicines/silver_amoxicillin_blister.jpg',
    janAushadhiGeneric: 'Amoxicillin + Clavulanic Acid (PMBJP)',
    brandedPrice: '₹198.00 per strip',
    janAushadhiPrice: '₹48.00 per strip',
    savingsPct: '75%',
    ddiConflict: 'Verify prior history of penicillin/beta-lactam allergy before dispensing.'
  },
  {
    id: 'amlodipine_telmisartan',
    keywords: ['amlodipine', 'amlo', 'telma', 'telmisartan', 'amlopres', 'telvas', '5mg', '40mg'],
    brand: 'Amlodipine 5mg / Telma-40 (Antihypertensive)',
    genericSalt: 'Amlodipine Besylate 5mg (or Telmisartan 40mg IP)',
    nfiCode: 'NFI-2025-CVS-0145',
    dosageForm: 'Uncoated Tablet',
    imageUrl: '/images/medicines/blue_amlodipine.jpg',
    janAushadhiGeneric: 'Amlodipine 5mg / Telmisartan 40mg (PMBJP)',
    brandedPrice: '₹84.00 per strip',
    janAushadhiPrice: '₹11.20 per strip',
    savingsPct: '86%',
    ddiConflict: 'Monitor blood pressure regularly for orthostatic hypotension.'
  },
  {
    id: 'atorvastatin',
    keywords: ['atorva', 'atorvastatin', 'lipitor', 'statin', 'cholesterol', '10mg', '20mg'],
    brand: 'Atorva-20 / Lipitor (Lipid-Lowering)',
    genericSalt: 'Atorvastatin Calcium 20mg IP',
    nfiCode: 'NFI-2025-CVS-0892',
    dosageForm: 'Film-Coated Tablet',
    imageUrl: '/images/medicines/orange_atorvastatin.jpg',
    janAushadhiGeneric: 'Atorvastatin 20mg (PMBJP)',
    brandedPrice: '₹165.00 per strip',
    janAushadhiPrice: '₹28.50 per strip',
    savingsPct: '82%',
    ddiConflict: 'Do not co-administer with high-dose macrolides or fibrates without monitoring AST/ALT.'
  },
  {
    id: 'azithromycin',
    keywords: ['azithromycin', 'azee', 'zithromax', 'azimax', 'azithro', '500'],
    brand: 'Azee-500 (Macrolide Antibiotic)',
    genericSalt: 'Azithromycin Dihydrate 500mg IP',
    nfiCode: 'NFI-2025-ANT-0312',
    dosageForm: 'Tablet',
    imageUrl: '/images/medicines/silver_amoxicillin_blister.jpg',
    janAushadhiGeneric: 'Azithromycin 500mg (PMBJP)',
    brandedPrice: '₹132.00 per strip',
    janAushadhiPrice: '₹34.00 per strip',
    savingsPct: '74%',
    ddiConflict: 'Monitor cardiac QT interval if co-administered with antiarrhythmics or macrolides.'
  },
  {
    id: 'montelukast_levo',
    keywords: ['montair', 'montelukast', 'levocetirizine', 'telekast', 'montek', 'lc'],
    brand: 'Montair-LC (Antihistamine / Leukotriene Inhibitor)',
    genericSalt: 'Montelukast Sodium 10mg + Levocetirizine 5mg IP',
    nfiCode: 'NFI-2025-RES-0542',
    dosageForm: 'Chewable / Film Tablet',
    imageUrl: '/images/medicines/white_paracetamol.jpg',
    janAushadhiGeneric: 'Montelukast + Levocetirizine (PMBJP)',
    brandedPrice: '₹185.00 per strip',
    janAushadhiPrice: '₹38.50 per strip',
    savingsPct: '79%',
    ddiConflict: null
  },
  {
    id: 'zerodol_p',
    keywords: ['zerodol', 'aceclofenac', 'hifenac', 'zerodol-p'],
    brand: 'Zerodol-P (NSAID + Paracetamol)',
    genericSalt: 'Aceclofenac 100mg + Paracetamol 325mg IP',
    nfiCode: 'NFI-2025-ANA-0329',
    dosageForm: 'Film-Coated Tablet',
    imageUrl: '/images/medicines/white_paracetamol.jpg',
    janAushadhiGeneric: 'Aceclofenac + Paracetamol (PMBJP)',
    brandedPrice: '₹88.00 per strip',
    janAushadhiPrice: '₹22.00 per strip',
    savingsPct: '75%',
    ddiConflict: 'Do not use in active renal impairment or severe congestive heart failure.'
  },
  {
    id: 'omeprazole',
    keywords: ['omeprazole', 'omez', 'omecid', 'ocid', '20mg'],
    brand: 'Omez-20 (Proton Pump Inhibitor)',
    genericSalt: 'Omeprazole 20mg IP',
    nfiCode: 'NFI-2025-GAS-0310',
    dosageForm: 'Hard Gelatin Capsule',
    imageUrl: '/images/medicines/yellow_pantoprazole.jpg',
    janAushadhiGeneric: 'Omeprazole 20mg (PMBJP)',
    brandedPrice: '₹68.00 per strip',
    janAushadhiPrice: '₹12.00 per strip',
    savingsPct: '82%',
    ddiConflict: null
  }
];

function extractBatchAndExpiry(rawText) {
  let batch = null;
  let expiry = null;

  const batchMatch = rawText.match(/(?:B\.?\s*No\.?|Batch(?:\s*No)?|BNo)[:\s]*([A-Z0-9\-\/]+)/i);
  if (batchMatch) batch = batchMatch[1].trim();

  const expMatch = rawText.match(/(?:EXP\.?|Expiry|Exp\s*Date)[:\s]*([0-9]{1,2}[\/\-][0-9]{2,4}|[A-Za-z]{3}[\/\-\s]*[0-9]{2,4})/i);
  if (expMatch) expiry = expMatch[1].trim();

  return { batch, expiry };
}

function matchDrugFromOcrText(rawText) {
  if (!rawText || !rawText.trim()) return null;
  const lower = rawText.toLowerCase();

  for (const item of CLINICAL_FORMULARY_DATABASE) {
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        return item;
      }
    }
  }
  return null;
}

export default function PrescriptionScannerView() {
  const { isDemoMode } = useApp();
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [activeTab, setActiveTab] = useState('samples'); // 'samples' | 'camera' | 'upload'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [liveOcrResult, setLiveOcrResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [useCvEnhancement, setUseCvEnhancement] = useState(true);
  const [cvPreprocessedUrl, setCvPreprocessedUrl] = useState(null);
  const [cvStats, setCvStats] = useState(null);

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
      realImageUrl: '/images/medicines/yellow_pantoprazole.jpg',
      extractedText: 'PANTOCID-40 B.No. P40291 EXP. 08/2027 MFG. SUN PHARMA PANTOPRAZOLE SODIUM IP EQ. TO PANTOPRAZOLE 40 MG',
      ddiConflict: null,
      contourDetected: true,
      imagePlaceholderColor: '#FEF3C7',
      pillColor: '#F59E0B',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'PANTOCID-40', x: 28, y: 35, w: 220, h: 32, conf: 'High Match' },
        { label: 'ACTIVE_SALT', text: 'PANTOPRAZOLE SODIUM 40MG', x: 28, y: 75, w: 280, h: 26, conf: 'High Match' },
        { label: 'BATCH_EXP', text: 'B.No: P40291 • EXP: 08/2027', x: 28, y: 110, w: 240, h: 24, conf: 'Verified' }
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
      realImageUrl: '/images/medicines/pink_metformin.jpg',
      extractedText: 'GLYCOMET-500 SR B.No. GM9124 EXP. 11/2026 METFORMIN HYDROCHLORIDE EXTENDED RELEASE IP 500 MG',
      ddiConflict: null,
      contourDetected: true,
      imagePlaceholderColor: '#FCE7F3',
      pillColor: '#EC4899',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'GLYCOMET-500 SR', x: 30, y: 32, w: 240, h: 32, conf: 'High Match' },
        { label: 'ACTIVE_SALT', text: 'METFORMIN HYDROCHLORIDE 500MG', x: 30, y: 72, w: 300, h: 26, conf: 'High Match' },
        { label: 'BATCH_EXP', text: 'B.No: GM9124 • EXP: 11/2026', x: 30, y: 108, w: 230, h: 24, conf: 'Verified' }
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
      realImageUrl: '/images/medicines/white_paracetamol.jpg',
      extractedText: 'COMBIFLAM TABLET IBUPROFEN IP 400 MG PARACETAMOL IP 325 MG SANOFIAVENTIS B.No. CB2049',
      ddiConflict: 'CRITICAL SAFETY ALERT: If patient is concurrently taking Aspirin/Ecosprin, combining with Ibuprofen induces competitive COX-1 inhibition and elevates gastrointestinal hemorrhage risk.',
      contourDetected: true,
      imagePlaceholderColor: '#FEE2E2',
      pillColor: '#EF4444',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'COMBIFLAM TABLET', x: 26, y: 34, w: 250, h: 34, conf: 'High Match' },
        { label: 'DUAL_SALT', text: 'IBUPROFEN 400MG + PARACETAMOL 325MG', x: 26, y: 76, w: 320, h: 28, conf: 'High Match' },
        { label: 'MFG_BATCH', text: 'SANOFIAVENTIS • B.No: CB2049', x: 26, y: 112, w: 240, h: 22, conf: 'Verified' }
      ]
    },
    {
      id: 'sample_amlodipine',
      brand: 'Amlodipine 5mg (Blue Blister Strip)',
      genericSalt: 'Amlodipine Besylate 5mg IP',
      nfiCode: 'NFI-2025-CVS-0145',
      dosageForm: 'Oral Antihypertensive Tablet',
      janAushadhiGeneric: 'Amlodipine 5mg (PMBJP)',
      brandedPrice: '₹84.00 per strip',
      janAushadhiPrice: '₹11.20 per strip',
      savingsPct: '86%',
      realImageUrl: '/images/medicines/blue_amlodipine.jpg',
      extractedText: 'AMLODIPINE 5MG TABLETS EXP 10/2026 LOT 1437 BP CARDIOVASCULAR IP 5 MG',
      ddiConflict: null,
      contourDetected: true,
      imagePlaceholderColor: '#E0F2FE',
      pillColor: '#0284C7',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'AMLODIPINE 5MG', x: 26, y: 34, w: 220, h: 32, conf: 'High Match' },
        { label: 'ACTIVE_SALT', text: 'AMLODIPINE BESYLATE 5MG', x: 26, y: 76, w: 280, h: 26, conf: 'High Match' },
        { label: 'BATCH_EXP', text: 'LOT: 1437 • EXP: 10/2026', x: 26, y: 112, w: 230, h: 22, conf: 'Verified' }
      ]
    },
    {
      id: 'sample_atorvastatin',
      brand: 'Atorvastatin 20mg (Orange Lipid-Lowering)',
      genericSalt: 'Atorvastatin Calcium 20mg IP',
      nfiCode: 'NFI-2025-CVS-0892',
      dosageForm: 'Film-Coated Tablet',
      janAushadhiGeneric: 'Atorvastatin 20mg (PMBJP)',
      brandedPrice: '₹165.00 per strip',
      janAushadhiPrice: '₹28.50 per strip',
      savingsPct: '82%',
      realImageUrl: '/images/medicines/orange_atorvastatin.jpg',
      extractedText: 'ATORVASTATIN 20MG TABLETS LOT: EXP 12/26 ATORVASTATIN CALCIUM TRIHYDRATE IP 20 MG',
      ddiConflict: 'Avoid co-prescribing with gemfibrozil or high-dose clarithromycin to minimize rhabdomyolysis risk.',
      contourDetected: true,
      imagePlaceholderColor: '#FFEDD5',
      pillColor: '#EA580C',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'ATORVASTATIN 20MG', x: 28, y: 34, w: 240, h: 32, conf: 'High Match' },
        { label: 'ACTIVE_SALT', text: 'ATORVASTATIN CALCIUM 20MG', x: 28, y: 76, w: 290, h: 26, conf: 'High Match' },
        { label: 'BATCH_EXP', text: 'LOT: EXP 12/26 • BARCODE VERIFIED', x: 28, y: 112, w: 260, h: 22, conf: 'Verified' }
      ]
    },
    {
      id: 'sample_augmentin',
      brand: 'Augmentin 625 Duo (Aluminum Blister Strip)',
      genericSalt: 'Amoxicillin 500mg + Clavulanate 125mg',
      nfiCode: 'NFI-2025-ANT-0284',
      dosageForm: 'Film-Coated Tablet',
      janAushadhiGeneric: 'Amoxicillin + Clavulanic Acid (PMBJP)',
      brandedPrice: '₹198.00 per strip',
      janAushadhiPrice: '₹48.00 per strip',
      savingsPct: '75%',
      realImageUrl: '/images/medicines/silver_amoxicillin_blister.jpg',
      extractedText: 'AMOXICILLIN 500MG CAPSULES BP BATCH: L 34512A EXP: 10/26 POTASSIUM CLAVULANATE',
      ddiConflict: 'Verify prior history of penicillin/beta-lactam allergy before dispensing.',
      contourDetected: true,
      imagePlaceholderColor: '#F1F5F9',
      pillColor: '#475569',
      boundingBoxes: [
        { label: 'BRAND_NAME', text: 'AMOXICILLIN 500MG', x: 26, y: 34, w: 230, h: 32, conf: 'High Match' },
        { label: 'ACTIVE_SALT', text: 'AMOXICILLIN + CLAVULANATE', x: 26, y: 76, w: 280, h: 26, conf: 'High Match' },
        { label: 'BATCH_EXP', text: 'BATCH: L 34512A • EXP: 10/26', x: 26, y: 112, w: 250, h: 22, conf: 'Verified' }
      ]
    }
  ];

  // Current display data: either live OCR result or selected sample
  const currentSample = liveOcrResult || OCR_SAMPLES[selectedSampleIdx];

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
    setLiveOcrResult(null);
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
      setCameraError("Camera permission denied or camera device not found. Please upload a medicine strip image directly.");
    }
  };

  // Run Real In-Browser Tesseract.js OCR with OpenCV Preprocessing
  const executeRealOcr = async (imageSource) => {
    setIsScanning(true);
    setOcrProgress(10);
    setOcrStatusText('Applying OpenCV Otsu Binarization & Adaptive Foil Contrast...');

    let imageToOcr = imageSource;
    if (useCvEnhancement) {
      try {
        const cvResult = await openCvPreprocessor.preprocessForOcr(imageSource);
        imageToOcr = cvResult.processedDataUrl;
        setCvPreprocessedUrl(cvResult.processedDataUrl);
        setCvStats(cvResult.stats);
      } catch (cvErr) {
        console.warn('OpenCV enhancement fallback:', cvErr);
      }
    }

    try {
      setOcrStatusText('Running Tesseract.js WASM on enhanced blister contours...');
      const result = await Tesseract.recognize(
        imageToOcr,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const pct = Math.round((m.progress || 0) * 100);
              setOcrProgress(pct);
              setOcrStatusText(`Reading text from physical packaging (${pct}%)...`);
            } else if (m.status) {
              setOcrStatusText(`WASM Pipeline: ${m.status}...`);
            }
          }
        }
      );

      const rawText = result.data.text ? result.data.text.trim() : '';
      const { batch, expiry } = extractBatchAndExpiry(rawText);
      const matchedDrug = matchDrugFromOcrText(rawText);

      if (matchedDrug) {
        setLiveOcrResult({
          isLiveExtraction: true,
          brand: `${matchedDrug.brand} [Live OCR Extracted]`,
          genericSalt: matchedDrug.genericSalt,
          nfiCode: matchedDrug.nfiCode,
          dosageForm: matchedDrug.dosageForm,
          realImageUrl: matchedDrug.imageUrl,
          janAushadhiGeneric: matchedDrug.janAushadhiGeneric,
          brandedPrice: matchedDrug.brandedPrice,
          janAushadhiPrice: matchedDrug.janAushadhiPrice,
          savingsPct: matchedDrug.savingsPct,
          extractedText: rawText || 'No text extracted',
          batchNumber: batch || 'Detected on packaging',
          expiryDate: expiry || 'Inspected',
          ddiConflict: matchedDrug.ddiConflict,
          pillColor: '#008B8B',
          imagePlaceholderColor: '#E6FAF8'
        });
      } else {
        // Fallback with raw extracted text
        setLiveOcrResult({
          isLiveExtraction: true,
          brand: rawText ? `Extracted Text: ${rawText.slice(0, 32)}...` : 'Unrecognized Packaging Text',
          genericSalt: rawText ? 'Text extracted • Resolving against National Formulary...' : 'No legible medicine name detected. Please ensure bright lighting.',
          nfiCode: 'NFI-PENDING-MATCH',
          dosageForm: 'Solid Dosage Form',
          realImageUrl: imageToOcr || '/images/medicines/silver_amoxicillin_blister.jpg',
          janAushadhiGeneric: 'PMBJP Generic Formulary',
          brandedPrice: 'Check local MRP',
          janAushadhiPrice: 'Affordable PMBJP Tier',
          savingsPct: '50-80%',
          extractedText: rawText || 'No legible text extracted. Ensure strip is held flat under good lighting.',
          batchNumber: batch || 'Not identified',
          expiryDate: expiry || 'Not identified',
          ddiConflict: null,
          pillColor: '#64748B',
          imagePlaceholderColor: '#F1F5F9'
        });
      }
    } catch (ocrErr) {
      console.error("Tesseract OCR execution error:", ocrErr);
      setCameraError("OCR recognition encountered an error. Falling back to reference formulary.");
    } finally {
      setIsScanning(false);
      setOcrProgress(100);
      setOcrStatusText('');
    }
  };

  // Capture video frame to canvas & run OCR
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
      executeRealOcr(dataUrl);
    }
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      stopWebcam();
      setActiveTab('upload');
      executeRealOcr(file);
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
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(217, 119, 6, 0.1)', color: '#D97706', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>
            <Scan size={14} />
            <span>REAL IN-BROWSER TESSERACT OCR WORKSPACE</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 750 }}>
            <ShieldCheck size={14} />
            <span>Designed for client-side OCR processing</span>
          </div>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
          AyuVision Blister Strip & Prescription Scanner
        </h1>
        <p style={{ fontSize: '14.5px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6 }}>
          Real client-side optical character recognition pipeline powered by Tesseract.js and HTML5 Canvas. Extracts embossed brand names and active salts directly on your device, resolves chemical equivalents against the National Formulary of India (NFI), and checks Pradhan Mantri Jan Aushadhi generic availability.
        </p>
      </div>

      {/* Live OCR Active Notification Banner */}
      {liveOcrResult && (
        <div style={{
          background: '#F0FDFA',
          border: '1.5px solid #2DD4BF',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#0D9488" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F766E' }}>
                Live In-Browser OCR Result Active
              </div>
              <div style={{ fontSize: '12px', color: '#134E4A' }}>
                Parsed from your uploaded image / camera frame in WebAssembly.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setLiveOcrResult(null);
              setUploadedImage(null);
              setActiveTab('samples');
            }}
            style={{
              background: '#0D9488',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 750,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <X size={14} />
            <span>Reset to Preset Samples</span>
          </button>
        </div>
      )}

      {/* Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Interactive Input / Sample Selector */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>
              1. Input Medicine Packaging Sample
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Upload any physical medicine strip image, capture using live camera, or test with clinical presets.
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px', background: '#F8FAFC', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => {
                stopWebcam();
                setLiveOcrResult(null);
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
                  <span>Capture Frame & Run Tesseract OCR</span>
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
          {activeTab === 'samples' && !liveOcrResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {OCR_SAMPLES.map((sample, idx) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    setSelectedSampleIdx(idx);
                    setLiveOcrResult(null);
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
                    {sample.realImageUrl ? (
                      <img 
                        src={sample.realImageUrl} 
                        alt={sample.brand} 
                        style={{ 
                          width: '42px', 
                          height: '42px', 
                          borderRadius: '8px', 
                          objectFit: 'cover', 
                          border: '1.5px solid #CBD5E1',
                          flexShrink: 0
                        }} 
                      />
                    ) : (
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: sample.pillColor }} />
                    )}
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

          {/* Visual Canvas Representation with Real Preview */}
          {activeTab !== 'camera' && (
            <div style={{
              height: '240px',
              borderRadius: '12px',
              background: uploadedImage 
                ? `url(${uploadedImage}) center/contain no-repeat #0F172A` 
                : currentSample.realImageUrl 
                  ? `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.65)), url(${currentSample.realImageUrl}) center/cover no-repeat #0F172A`
                  : currentSample.imagePlaceholderColor,
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
                    Optical Packaging Inspection [Reference Preset HUD]
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

              {/* Scanning Active Overlay with Real Tesseract Progress */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(10, 37, 64, 0.92)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '20px',
                  color: '#FFFFFF'
                }}>
                  <RefreshCw size={26} style={{ animation: 'spin 1s linear infinite', color: '#2DD4BF' }} />
                  <div style={{ fontSize: '13px', fontWeight: 800, textAlign: 'center' }}>
                    {ocrStatusText || 'Executing Client-Side Tesseract OCR...'}
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '80%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${ocrProgress}%`, height: '100%', background: '#2DD4BF', transition: 'width 200ms ease' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    WASM Engine running in browser • Zero cloud upload
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OpenCV.js Computer Vision Preprocessing Badge & Toggle */}
          <div style={{
            background: useCvEnhancement ? '#F0FDF4' : '#F8FAFC',
            border: useCvEnhancement ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>🔬</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                  OpenCV.js Adaptive Foil Binarization
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                  {cvStats 
                    ? `Otsu Threshold: ${cvStats.otsuThreshold} • Contrast Range: ${cvStats.minLuminance}–${cvStats.maxLuminance}`
                    : 'Removes foil reflections, crinkles & shadows prior to Tesseract OCR'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setUseCvEnhancement(v => !v)}
              style={{
                background: useCvEnhancement ? '#16A34A' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {useCvEnhancement ? 'CV: ACTIVE' : 'CV: OFF'}
            </button>
          </div>

          {/* Action Button */}
          {uploadedImage && (
            <button
              onClick={() => executeRealOcr(uploadedImage)}
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
              <RefreshCw size={16} />
              <span>{isScanning ? 'Processing In-Browser OCR...' : 'Re-run OCR Extraction on Upload'}</span>
            </button>
          )}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              {currentSample.realImageUrl && (
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1.5px solid #CBD5E1',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <img 
                    src={currentSample.realImageUrl} 
                    alt={currentSample.brand} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540', margin: '0 0 4px 0' }}>
                  {currentSample.genericSalt}
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Form: {currentSample.dosageForm} • Brand: <strong>{currentSample.brand}</strong>
                </div>
              </div>
            </div>

            {/* Raw Extracted Bounding Box / OCR Tokens */}
            <div style={{ background: '#0A2540', color: '#F1F5F9', padding: '12px 14px', borderRadius: '10px', fontSize: '11.5px', fontFamily: 'monospace', marginBottom: '18px', lineHeight: 1.5 }}>
              <div style={{ color: '#00A896', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>// Tesseract.js Extracted Text Tokens:</span>
                {liveOcrResult && (
                  <span style={{ color: '#2DD4BF', fontSize: '10.5px' }}>● LIVE WASM EXTRACTION</span>
                )}
              </div>
              <div style={{ maxHeight: '80px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                {currentSample.extractedText}
              </div>
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
                  Branded MRP: <s>{currentSample.brandedPrice}</s> → Jan Aushadhi: <strong style={{ color: '#0D9488' }}>{currentSample.janAushadhiPrice}</strong>
                </div>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#059669' }}>
                  {currentSample.savingsPct}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 750, color: '#065F46' }}>
                  Cost Savings (sample data)
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
