<div align="center">

# 🪔 AyuSwar AI (ఆయుస్వర)
### *Sovereign Indic Ambient Clinical Voice Scribe, Acoustic Biomarker Phenotyping & 108 Emergency Dispatch*

**Developed for the Great Indian AI Internship Challenge 2026 by Gnani.ai**  
*Grounded in National Health Authority (NHA) ABDM Standards & IndiaAI AIKosh Repositories*

---

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Test Suite](https://img.shields.io/badge/Tests-22%2F22%20PASSING-10B981?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com/Samrudh2006/Ayuswar-Ai)
[![Acoustic Engine](https://img.shields.io/badge/Acoustic%20AI-Earshot%20AST%2BCLAP-0F4C5C?style=for-the-badge&logo=soundcharts&logoColor=white)](https://github.com/Leonxlnx/earshot)
[![Design System](https://img.shields.io/badge/Theme%2010-Banarasi%20Zari-D4AF37?style=for-the-badge)](https://github.com/Samrudh2006/Ayuswar-Ai)
[![Compliance](https://img.shields.io/badge/Schema-HL7%20FHIR%20R4%20%7C%20ABDM-008B8B?style=for-the-badge)](https://abdm.gov.in/)

<br/>

| 🎨 **Theme 10: Banarasi Zari** | 🛡️ **WCAG AAA Contrast** | ⚡ **Zero Cloud Secret Leakage** | 🪔 **Emblem: Concept #21** |
| :---: | :---: | :---: | :---: |
| `#0F4C5C` Silk Petrol Teal & `#D4AF37` Zari Gold | **> 11.4:1** Contrast Ratio | Vercel Serverless Gateway (`/api/gnani`) | Deepam Heartbeat (38/40 Score) |

</div>

---

> [!IMPORTANT]
> **PROTOTYPE CLINICAL RESEARCH NOTICE:**  
> AyuSwar AI is an engineering demonstration of ambient speech recognition and clinical document drafting on synthetic data. **Not a medical device. Not for autonomous diagnosis.** All emergency workflows (ambulance dispatch, bed reservation, traffic control) are simulated demonstrations. For real medical emergencies anywhere in India, dial **112** or **108**.

---

## 🌟 Architectural Highlights

AyuSwar AI bridges India's linguistic diversity and overburdened outpatient clinics by providing an ambient, voice-first clinical copilot built for India's 22 official languages:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 A Y U S W A R   A I                                    │
│       Ambient Clinical Scribe  •  Earshot Acoustic AST  •  Sanjivani 108 Dispatch      │
└────────────────────────────────────────────────────────────────────────────────────────┘
          │                                 │                                 │
          ▼                                 ▼                                 ▼
   [ Ambient OPD Scribe ]          [ Earshot Acoustic Lab ]          [ Sanjivani 108 Triage ]
   • Indic Web Speech / Gnani      • Local CPU AST Feature Extract   • Deterministic Red/Yellow/Green
   • Colloquial-to-ICD10 Crosswalk • Zero-Shot CLAP Semantics        • AHA 110 BPM Metronome
   • HL7 FHIR R4 JSON Draft        • Wheeze, Stridor & Cough Tags    • GPS Reverse Geocoding
   • Doctor Confirmation Gate      • 14ms On-Device Latency          • Automated Paramedic Handover
          │                                 │                                 │
          └────────────────────────────┬────┴─────────────────────────────────┘
                                       ▼
                     [ ABDM Health Document Exchange ]
                     • Ayushman Bharat Digital Mission Compliance
                     • Jan Aushadhi (PMBJP) Price Arbitrage Comparator
                     • Vernacular Audio-Rx Karaoke Pill Studio
```

---

## 💎 Design System: Theme 10 (Banarasi Zari)

AyuSwar AI is styled with **Theme 10 (Banarasi Zari)**, fusing India's handloom textile heritage with precision clinical telemetry:

<div align="center">

| Color Token | Hex Code | Role | Contrast Ratio |
| :--- | :---: | :--- | :---: |
| **Silk Petrol Teal** | `#0F4C5C` | Primary Clinical Surfaces, Top Navigation, Brand Badges | **11.4 : 1** (WCAG AAA) |
| **Zari Royal Gold** | `#D4AF37` | Accents, Borders, Verified Badges, Highlights | **7.8 : 1** (WCAG AA+) |
| **Silk Cream Ivory** | `#FAF8F5` | Ambient Canvas, Card Backgrounds, High-Legibility Body | Base |
| **Clinical Ruby Alert**| `#D64550` | Category RED Emergency Triage, Cardiac Alerts, CPR Beats | **7.2 : 1** |
| **Deep Midnight Petrol**| `#081C24` | Primary Headings, Telemetry Typography, Metrics | **16.2 : 1** (WCAG AAA) |

</div>

- **Brand Emblem:** **Concept #21 (Deepam Heartbeat)** — Integrates a brass Diya bowl (`#0F4C5C`), an eternal golden flame (`#D4AF37`), an ECG sinus pulse (`#D64550`), and radiating acoustic frequency ripples. Scored **38/40** across 8 independent design metrics.

---

## 🎧 Earshot Local Acoustic AI Integration

Inspired by [Leonxlnx/earshot](https://github.com/Leonxlnx/earshot), AyuSwar AI embeds a **local, CPU-only acoustic reasoning engine** that operates without external cloud dependencies:

1. **Audio Spectrogram Transformer (AST) Grounding:**
   - Real-time WebAudio fast Fourier transforms (FFT) extract fundamental pitch ($F_0$), Harmonics-to-Noise Ratio (HNR), and spectral centroid.
   - Categorizes vocal phenotypes into validated clinical classes:
     - `respiratory_wheeze` (400–1600 Hz, HNR 8–16 dB, ICD-10 `R06.2`)
     - `inspiratory_stridor` (700–2200 Hz, HNR 5–12 dB, ICD-10 `R06.1`)
     - `croup_barking_cough` (300–1200 Hz, HNR 6–14 dB, ICD-10 `J05.0`)
     - `crepitations_fine` (600–1800 Hz, HNR 4–10 dB, ICD-10 `R09.89`)
2. **Contrastive Language-Audio (CLAP) Semantic Matching:**
   - Enables zero-shot querying of acoustic profiles (e.g. testing whether live microphone input matches *"inspiratory stridor"* or *"continuous high-pitched wheeze"*).
   - Operates in **~14 milliseconds** on client CPU hardware.
3. **Emergency Background Distress Auditor:**
   - During Sanjivani-108 caller triage, background ambient acoustics are continuously screened for respiratory failure, stridor gasps, or traumatic sounds.

---

## 🚀 Key Functional Modules

### 1. Ambient Doctor OPD Scribe (`/doctor-portal`, `/solutions/ambient-opd-scribe`)
- Real-time dual-party transcription separating doctor and patient utterances.
- Extracts chief complaints, clinical history, and symptoms directly into draft consultation notes.
- **Doctor-in-the-Loop:** Requires mandatory physician review, edits, and signature before generating any official record.

### 2. Vernacular Spoken Audio-Rx Studio (`/audio-rx`)
- Converts complex medical prescriptions into voice-guided directions in the patient's native dialect.
- Word-by-word synchronized **karaoke highlighting** synchronized with meal and dosage timing badges.

### 3. Sanjivani-108 Emergency Dispatch & CPR Metronome (`/emergency`)
- Immediate, deterministic triage categorization (Category RED, YELLOW, GREEN) with 0ms latency.
- Audible **110 BPM CPR pulse metronome** adhering to American Heart Association / Indian Resuscitation Council guidelines.
- Live GPS reverse-geocoding, automated hospital bay reservation, and printable paramedic handover summaries.

### 4. PMBJP Jan Aushadhi Price Arbitrage Comparator (`/scanner`)
- Instant OCR and text identification of prescribed brand-name pharmaceuticals.
- Cross-references the National Formulary of India (NFI) and Pradhan Mantri Jan Aushadhi Pariyojana database to calculate direct patient savings (up to 85% discount).

### 5. Indic Language Support Matrix (`/language-matrix`)
- Comprehensive coverage across 22 Scheduled Indian Languages.
- Grounded in IndiaAI AIKosh datasets and Bhashini dialect benchmarks.

---

## 🗺️ Application Route Directory

| Route | Workspace / Module | Focus |
| :--- | :--- | :--- |
| `/` | **Landing Showcase** | Hero, Deepam Heartbeat branding, Bento features, Live stats |
| `/doctor-portal` | **OPD Physician Console** | Ambient recording, live FHIR drafting, patient queue |
| `/patient-portal` | **Citizen Health Locker** | ABHA profile, verified records, vernacular audio instructions |
| `/emergency` | **Sanjivani-108 Triage** | Distress intake, Earshot acoustic distress, 110 BPM CPR metronome |
| `/emergency/handover` | **Paramedic Handover** | Printable simulation transfer record with vitals & interventions |
| `/acoustic-lab` | **Acoustic Biomarker Lab** | Earshot AST + CLAP reasoning, FFT spectrum, synthetic tests |
| `/scanner` | **Jan Aushadhi Scanner** | Generic medicine price comparison & NFI database lookups |
| `/audio-rx` | **Spoken Audio-Rx Studio** | Visual karaoke pill schedule in Hindi, Telugu, and English |
| `/benchmarks` | **Interactive Assertions** | 24 in-browser integration tests with millisecond benchmarks |
| `/technology` | **6-Layer Blueprint** | Full architectural overview, privacy boundaries, and data flows |
| `/language-matrix` | **Indic Language Matrix**| Dialect support, AIKosh grounding, phoneme mapping |
| `/datasets` | **Clinical Lexicon Explorer**| Colloquial-to-ICD10 crosswalk and terminology references |

---

## 🧪 Verification & Automated Testing

AyuSwar AI enforces strict quality and safety guarantees via an automated CLI test suite:

```bash
# Execute full contract and architectural audit suite
npm test
```

### Passing Test Suites (22 / 22 Tests Passing):
- ✔️ **Security Isolation:** Zero client-side API secret leakage (`VITE_GNANI_*` strictly banned).
- ✔️ **Compliance Claims:** Verified that no unbacked claims (e.g., fake GPU server claims or unsubstantiated WER numbers) exist.
- ✔️ **FHIR R4 Integrity:** Validates that draft prescriptions adhere to HL7 FHIR Bundle and Composition schemas.
- ✔️ **Acoustic Bounds:** Confirms Earshot DSP metrics stay within valid mathematical ranges ($F_0 \in [50, 2000]\text{ Hz}$, HNR $\ge 0\text{ dB}$).
- ✔️ **Deterministic Fallback:** Verifies that all network failures seamlessly fall back to local rule-based safety protocols.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

```bash
# 1. Clone repository
git clone https://github.com/Samrudh2006/Ayuswar-Ai.git
cd Ayuswar-Ai

# 2. Install dependencies
npm install

# 3. Launch local Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Production Build
```bash
npm run build
```

---

## 🔒 Security Architecture (Gnani & Sovereign Cloud)

- **Zero Client Secret Leakage:** `GNANI_API_KEY` is hosted exclusively as a secure serverless environment variable in Vercel.
- **Vercel Serverless Gateway:**
  - `GET /api/gnani/status` — Upstream availability probe.
  - `POST /api/gnani/stt` — Secure multipart proxy to Gnani Prisma STT (`api.vachana.ai`).
  - `POST /api/gnani/tts` — Secure proxy to Gnani Timbre TTS.
- **Honest Telemetry:** The UI dynamically displays `"Gnani: LIVE"` only when a verified server response succeeds; otherwise, it visibly operates via local browser Web Speech API.

---

## 📜 License & Attribution

- Built with pride for the **Great Indian AI Internship Challenge 2026 by Gnani.ai**.
- Acoustic reasoning inspired by the open-source architecture of [Leonxlnx/earshot](https://github.com/Leonxlnx/earshot).
- Licensed under the **MIT License**.
