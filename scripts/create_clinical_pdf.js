import fs from 'node:fs';
import path from 'node:path';

function createAyuSwarPdf() {
  const outputDir = path.resolve('sample_reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'AyuSwar_Clinical_Acoustic_Report.pdf');

  // Minimal standard PDF 1.4 specification
  const textLines = [
    "AYUSWAR AI (ఆయుస్వర) - CLINICAL ACOUSTIC REPORT",
    "=======================================================",
    "Report ID: AS-2026-OCT-8842    Date: 28-Oct-2026",
    "ABDM Facility: #1402          Standard: ABDM M3 / NABL",
    "",
    "PATIENT DEMOGRAPHICS",
    "Name: Lakshmi Amma (లక్ష్మి అమ్మ)",
    "ABHA Address: 91-4521-8932-1049@abdm",
    "Age / Gender: 56 Y / Female",
    "Primary Language: Telugu (Rayalaseema Dialect)",
    "",
    "INDIC VERNACULAR NARRATIVE & ONTOLOGY RESOLUTION",
    "Chief Complaint: Gundello dadaga undi, raatri poota baaga dammu vastondi.",
    "Mapped Findings:",
    "  * Gundello Dada (Palpitations): WHO ICD-10 R00.2 | SNOMED-CT 80313002",
    "  * Dammu / Aayasam (Bronchial Dyspnea): WHO ICD-10 J45.901 | SNOMED-CT 267036007",
    "",
    "PHYSICAL ACOUSTIC TELEMETRY (2048-pt FFT DSP ENGINE)",
    "-------------------------------------------------------",
    "Biomarker Parameter          Measured Value    Clinical Baseline",
    "-------------------------------------------------------",
    "Fundamental Pitch (F0)       120.4 Hz          85 - 255 Hz",
    "Pitch Jitter (Relative)      2.42%             < 1.04% [ELEVATED]",
    "Amplitude Shimmer (Relative) 5.18%             < 3.81% [ELEVATED]",
    "Harmonics-to-Noise (HNR)     14.2 dB           > 20.0 dB [TURBULENT]",
    "Acoustic Distress Index      64 / 100          < 30 (Normal)",
    "-------------------------------------------------------",
    "",
    "PHARMACOVIGILANCE & PMBJP JAN AUSHADHI FORMULARY",
    "Prescription: Budesonide 200mcg + Formoterol 6mcg Inhaler",
    "Jan Aushadhi Substitution: PMBJP Code #1842",
    "Cost Comparison: Brand Rs. 640.00 vs Jan Aushadhi Rs. 120.00 (81.2% Savings)",
    "Drug-Drug Interactions: None detected against hypertensive baseline.",
    "",
    "Attending Physician: Dr. K. S. Venkatesh, MD (Pulmonology)",
    "NMC Reg No: 48921-AP | Signature: Verified Digital E-Sign"
  ];

  let streamContent = "BT\n/F1 10 Tf\n14 TL\n50 780 Td\n";
  for (const line of textLines) {
    const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    streamContent += `(${escaped}) '\n`;
  }
  streamContent += "ET\n";

  const streamLen = Buffer.byteLength(streamContent, 'utf-8');

  const pdfParts = [
    "%PDF-1.4\n",
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n",
    `5 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}endstream\nendobj\n`
  ];

  let xref = "xref\n0 6\n0000000000 65535 f \n";
  let offset = 0;
  for (let i = 0; i < pdfParts.length; i++) {
    if (i > 0) {
      xref += offset.toString().padStart(10, '0') + " 00000 n \n";
    }
    offset += Buffer.byteLength(pdfParts[i], 'utf-8');
  }

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`;
  const fullPdf = pdfParts.join('') + xref + trailer;

  fs.writeFileSync(outputPath, fullPdf, 'binary');
  console.log(`✓ Successfully generated pure standards-compliant PDF: ${outputPath}`);
}

createAyuSwarPdf();

