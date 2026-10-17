# AyuSwar AI (ఆయుస్వర) 🩺🎙️
### *Ambient Clinical Voice Scribe & Triage Prototype for Indian Languages*
**Developed for the Great Indian AI Internship Challenge 2026 by Gnani.ai**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![FHIR R4 Schema](https://img.shields.io/badge/Schema-HL7%20FHIR%20R4%20Draft-008B8B)](https://hl7.org/fhir/R4/)
[![Status](https://img.shields.io/badge/Status-Engineering%20Prototype-amber.svg)](https://github.com/Samrudh2006/Ayuswar-Ai)

---

> **⚠️ PROTOTYPE DEMO NOTICE:**  
> **AyuSwar AI is a prototype demo on synthetic data. Not a medical device. Not for diagnosis.**  
> It is an engineering demonstration of ambient speech recognition and clinical document drafting. It does **not** provide autonomous medical diagnosis or clinical care plans. All emergency workflows (ambulance telemetry, bed reservation, traffic signal control) are **simulated demonstrations**; for real medical emergencies in India, dial **112** or **108**.

---

## 🌟 Overview & Implemented Capabilities

AyuSwar AI addresses clinical documentation overhead and patient prescription comprehension using voice-first web interfaces:

1. **Ambient Consultation Scribing (Draft Note Generation)**
   - Listens to spoken dialogues in English (default), Telugu, and Hindi.
   - Extracts discussed symptoms, maps regional colloquial idioms (e.g., *"గుండెల్లో మంట"*, *"पसली चलना"*) to reference ICD-10 categories, and formats draft HL7 FHIR R4 JSON structures.
   - **Doctor-in-the-Loop:** All draft outputs require explicit attending physician review, edit, and confirmation before export.

2. **Vernacular Spoken Audio-Rx Studio**
   - Synthesizes spoken medication instructions in the patient's preferred language.
   - Features synchronized, word-by-word visual karaoke highlighting across color-coded pill cards.

3. **Blister Strip Scanner & Generic Price Comparator**
   - Client-side camera and image OCR scanner identifying common medications.
   - Cross-references the National Formulary of India (NFI) and Pradhan Mantri Jan Aushadhi Pariyojana (PMBJP) open price database to show cost-effective generic alternatives.

4. **Non-Diagnostic Acoustic Signal Processing Lab**
   - Experimental Digital Signal Processing (DSP) tool analyzing pitch (F0), spectral centroid, and audio energy flux via WebAudio FFT.
   - Displays real-time oscilloscopes and spectrograms as experimental physical signals, not disease probabilities.

5. **Simulated Sanjivani-108 Emergency Protocol**
   - Demonstrates emergency distress call triage logic and provides an audible **110 BPM CPR tempo metronome** adhering to resuscitation guidelines.
   - Generates printable paramedic handover summaries marked with simulation watermarks.

6. **Executable Assertion Test Suite (8 Automated CLI Tests + 24 In-Browser Assertions)**
   - Automated CLI test suite (`npm test`) executes **8 contract and safety audit tests** validating dependency isolation, environment configuration, and banned claim prevention.
   - In-browser interactive suite (`/benchmarks`) runs **24 client-side integration assertions** testing WebAudio, local storage isolation, and FHIR schema validation in milliseconds.

---

## 🏛️ Routing Architecture & Design System

AyuSwar features a dedicated route structure with persistent URLs and browser back/forward history:

| Route | Workspace / View | Status |
| :--- | :--- | :--- |
| `/` | Hero Landing & Feature Showcase | Implemented |
| `/solutions/:moduleId` | Detailed Module Specifications | Implemented |
| `/technology` | 6-Layer Deep-Tech Architectural Blueprint | Implemented |
| `/scanner` | Blister Strip OCR & PMBJP Price Comparator | Implemented |
| `/audio-rx` | Vernacular Audio-Rx Spoken Schedule Studio | Implemented |
| `/acoustic-lab` | Experimental DSP Acoustic Signal Lab | Implemented |
| `/benchmarks` | In-Browser Interactive Assertions (24 Checks) | Implemented |
| `/language-matrix` | Indic Language Support Matrix & Methodology | Implemented |
| `/datasets` | Clinical Knowledge & Colloquial Lexicon Reference | Implemented |
| `/emergency` | Simulated Distress Triage & 110 BPM CPR Metronome | Implemented |
| `/emergency/handover` | Paramedic Handover Specimen (Simulation) | Implemented |
| `/prescription/preview` | ABDM FHIR R4 Specimen Preview | Implemented |
| `/auth/doctor` | Clinician Sandbox Profile Selector | Implemented |
| `/auth/patient` | Citizen Sandbox Profile Selector | Implemented |
| `/doctor-portal` | OPD Physician Console & Queue | Implemented |
| `/patient-portal` | Citizen Health Record Viewer | Implemented |

---

## 🏗️ Core Architectural Pillars & Functional Implementations

AyuSwar AI separates high-performance client-side browser execution from secure backend services:

1. **Client-Side Speech Processing Pipeline:**
   - Employs the native W3C Web Speech API for immediate, zero-latency transcription of spoken Hindi, Telugu, and Indian English without requiring cloud round-trips for basic scribing.
   - Built with pluggable server-side reverse-proxy architecture (`/api/gnani`) ready for production Gnani neural voice API ingestion without client secret leakage.

2. **Deterministic Indic Colloquial-to-ICD10 Crosswalk:**
   - Client-side medical taxonomy parser that maps regional visceral idioms (e.g., Telugu *"గుండెల్లో మంట"*, Hindi *"पसली चलना"*) directly to standardized WHO ICD-10 diagnostic codes and SNOMED CT terminology without hallucination.

3. **ABDM-Conforming HL7 FHIR R4 Generation:**
   - Translates structured consultation notes directly into valid HL7 FHIR R4 JSON schemas with explicit doctor-in-the-loop review and sign-off gates.

4. **In-Browser WebAudio DSP Signal Analysis:**
   - Real-time `AudioContext` and `AnalyserNode` fast Fourier transform (FFT) waterfall plotting physical acoustic energy flux between 0 Hz and 8 kHz directly from the device microphone.

5. **AHA-Compliant 110 BPM Resuscitation Metronome:**
   - Real-time audible CPR metronome powered by Web Audio `OscillatorNode` adhering to American Heart Association / Indian Resuscitation Council guidelines for cardiac arrest pacing.

6. **Jan Aushadhi PMBJP Price Arbitrage Calculator:**
   - Instantaneous cross-referencing between branded formulations and the National Formulary of India (NFI) / PMBJP open dataset, computing direct generic savings.

7. **IndiaAI AIKosh National Data Repository Grounding:**
   - Schemas and clinical speech ontologies are aligned with IndiaAI AIKosh (`aikosh.indiaai.gov.in`, MeitY, Government of India), referencing Indic speech benchmarks, Bhashini dialect tokens, and NLEM 2022 ceiling rates.

---

## 🔒 Security & Privacy Principles

- **No Client-Bundled Secrets:** Gnani API keys and credentials are not bundled into client-side code (`VITE_*`). Secure server proxy variables are specified in `.env.example`.
- **Ephemeral Audio Ingestion:** In-browser WebAudio buffers process audio locally for visualization and transcription; no persistent audio recordings are stored on external servers.
- **Fixture Isolation:** Demonstration profiles and synthetic clinical scenarios are isolated from live flows. Live mode starts empty; synthetic demo fixtures require an explicit opt-in with a persistent banner.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/Samrudh2006/Ayuswar-Ai.git
cd Ayuswar-Ai

# Install dependencies
npm install

# Start the Vite local development server
npm run dev
```

### Running Verification Tests & Build

```bash
# Verify build
npm run build

# Run unit tests
npm test
```

---

## 📄 License & Attribution

- Built for the **Great Indian AI Internship Challenge 2026 by Gnani.ai**.
- Licensed under the **MIT License**.
