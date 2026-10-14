# AyuSwar AI (ఆయుస్వర) 🩺🎙️
### *Ambient Clinical Voice Scribe & Triage Prototype for Indian Languages*
**Developed for the Great Indian AI Internship Challenge 2026 by Gnani.ai**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![FHIR R4 Schema](https://img.shields.io/badge/Schema-HL7%20FHIR%20R4%20Draft-008B8B)](https://hl7.org/fhir/R4/)
[![Status](https://img.shields.io/badge/Status-Engineering%20Prototype-amber.svg)](https://github.com/Samrudh2006/Ayuswar-Ai)

---

> **⚠️ NON-DIAGNOSTIC PROTOTYPE NOTICE:**  
> AyuSwar AI is an engineering demonstration of ambient speech recognition and clinical document drafting. It is **not** a certified medical device and does **not** provide autonomous medical diagnosis or clinical care plans. All emergency workflows (ambulance telemetry, bed reservation, traffic signal control) are **simulated demonstrations**; for real medical emergencies in India, dial **112** or **108**.

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

6. **24-Point Executable Assertion Test Suite**
   - Unlike mock certificates, the test suite executes **24 real unit and contract assertions** measuring execution duration in milliseconds.

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
| `/benchmarks` | 24 Executed Software Assertions | Implemented |
| `/language-matrix` | Indic Language Support Matrix & Methodology | Implemented |
| `/datasets` | Clinical Knowledge & Colloquial Lexicon Reference | Implemented |
| `/emergency` | Simulated Distress Triage & 110 BPM CPR Metronome | Implemented |
| `/emergency/handover` | Paramedic Handover Specimen (Simulation) | Implemented |
| `/prescription/preview` | ABDM FHIR R4 Specimen Preview | Implemented |
| `/assistant` | Dedicated Virtual Assistant Workspace | Implemented |
| `/avatar` | Lifelike 4-Frame Avatar Assistant Gallery | Implemented |
| `/auth/doctor` | Clinician Demo Profile Selector | Implemented |
| `/auth/patient` | Citizen Demo Profile Selector | Implemented |
| `/doctor-portal` | OPD Physician Console & Queue | Implemented |
| `/patient-portal` | Citizen Health Record Viewer | Implemented |

---

## 🤖 Lifelike Conversational Avatar Assistant (`AvatarAssistant.jsx`)

The voice assistant interface includes a photorealistic doctor avatar (white coat + stethoscope) engineered for high visual fidelity and low device overhead:

1. **4 Synchronized High-Resolution Frames (`public/avatar/*.png`):**
   - `idle.png`: Attentive, calm resting posture with subtle breathing sway.
   - `listening.png`: Attentive conversational posture with micro-movement.
   - `blink.png`: Natural organic eye blink triggered every 3.2 to 5.8 seconds with random jitter (140ms closure).
   - `speaking.png`: Phoneme-synced mouth opening dynamically toggled during speech.

2. **Viseme & Audio Synchronization:**
   - Mouth state dynamically reacts to speech synthesis events and syllable cadences (110–200ms alternating phases).
   - Text fallback viseme simulation ensures natural speaking motion when raw audio streams are unavailable.

3. **Performance & Device Compatibility:**
   - Ultra-lightweight: ~380 KB per compressed frame; loads instantaneously and delivers silky 60 FPS transitions without WebGL overhead or shader compilation delays.
   - Strict `prefers-reduced-motion` compliance locks avatar to the static idle frame and disables swaying/blinking animations for motion-sensitive users.

4. **Vernacular Multilingual Speech & Captions:**
   - Supports live captions and speech in **English (`en-IN`)**, **Telugu (`te-IN`)**, and **Hindi (`hi-IN`)**.
   - Employs standard browser `speechSynthesis` with honest provider labeling (no unverified external API claims).

5. **Mandatory Safety Disclaimer:**
   - Prominently displays: `"AI assistant, not a doctor. Prototype demo."` to preserve clinical transparency.

6. **Interactive Gallery:**
   - Explore all 4 synchronized states side-by-side or interactively at `/avatar`.

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
