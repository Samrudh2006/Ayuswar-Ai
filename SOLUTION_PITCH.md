# AyuSwar AI
*Ayu (life) + Swar (voice) — Voice-First Sovereign Health Assistant for Bharat*  
One-page solution pitch · Gnani's Great Indian AI Internship Challenge 2026  
Live app: [ayuswar-ai.vercel.app](https://ayuswar-ai.vercel.app) · Code: [github.com/Samrudh2006/Ayuswar-Ai](https://github.com/Samrudh2006/Ayuswar-Ai)

---

### *What would healthcare software look like if it listened and spoke in the languages India actually uses?*

---

### THE CRISIS IN BHARAT'S CLINICS · WHY I BUILT THIS
In rural Primary Health Centres (PHCs), 1 doctor serves over 2,500 villagers daily; losing 42% of consultation time to manual EHR typing causes severe clinician burnout. Prescriptions fail when patients cannot read English slips, and families are drained by expensive branded medicines. In emergencies, describing acute pain in a second language costs life-saving minutes. AyuSwar AI solves this at the root: replacing keyboards and paper slips with ambient, sovereign Indic voice.

---

### HOW AYUSWAR WORKS (VOICE-FIRST TELEMETRY)
| 🎙️ LISTEN | ➔ | 🧠 UNDERSTAND | ➔ | 🩺 ASSIST | ➔ | 🚑 CONNECT |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Voice intake in Telugu, Hindi & English | | Dialect speech mapped to ICD-10 notes | | SOAP drafts, spoken Rx & triage | | Hospital maps & WhatsApp handover |

---

### ⚙️ GNANI.AI INDIC ENGINE UNDER THE HOOD
| 🎙️ PRISMA V3 (STT) | 📊 TIMBRE V2.5 (TTS) | 🧠 EVON 30B (LLM) |
| :--- | :--- | :--- |
| Rayalaseema Telugu dialect ASR + linguistic diarization separating doctor & patient speech without manual buttons. | Nalini 24kHz maternal voice reading prescriptions aloud with 1:1 karaoke highlighting and Telugu food cues. | Maps colloquial Telugu symptom idioms to WHO ICD-10 (e.g. K21.9 for GERD, R00.2) & SNOMED-CT without hallucinations. |

---

### THREE PRODUCTION WORKFLOWS

| 🩺 AMBIENT OPD SCRIBE | 🚑 SANJIVANI 108 | 📊 ACOUSTIC VOICE LAB |
| :--- | :--- | :--- |
| Transcribes consultations in regional Telugu dialects using automated pitch DSP diarization. Suggests WHO ICD-10 & SNOMED-CT codes for physician review. The system assists; it never decides.<br><br>*Includes PMBJP generic substitution saving up to 86% on routine medication.* | Voice symptom intake, rules-based red/yellow/green triage, GPS nearest hospital mapping, and structured clinician handover summaries with live ambulance coordination telemetry.<br><br>*Research simulation; emergency ambulance dispatch is an interface demo.* | Records voice and breathing sounds to compute on-device signal features (pitch F0, Harmonics-to-Noise Ratio, 380–450Hz wheeze harmonics) via Web Audio API with bilingual voice readouts.<br><br>*Physical signal screening demonstration, not clinical diagnosis.* |

**Plus:** **PMBJP Jan Aushadhi** generic savings · **Audio-Rx** spoken prescriptions in native dialect with **WhatsApp** delivery · **ABDM M3 FHIR** zero-network offline sync

---

### 🛡️ ARCHITECTURE & ZERO-MOCK TESTING
React + Vite PWA on Vercel with native Capacitor wrapper. Provider calls route through a secure serverless gateway (`/api/gnani/stt`, `/api/gnani/tts`, `/api/evon`) keeping API keys strictly server-side, rate-limiting requests, and failing closed honestly when unconfigured. Client-side 48kHz audio DSP analysis runs directly on the device. Protected by **74 automated clinical & safety test specifications passing 100% green**.

> **Stated plainly:** AyuSwar AI is a working prototype built on synthetic benchmark profiles and open government formularies — not a medical device, not clinically validated, not a diagnostic tool, and designed strictly to keep a certified doctor in the loop. Emergency workflows are labelled simulations; for a real emergency, India dials **112** or **108**.

---

### WHY THIS FITS GNANI'S SOVEREIGN MISSION
India-first healthcare needs Indic-first voice — exactly the stack Gnani has pioneered. AyuSwar shows what that stack achieves end to end: consultation scribing, generic medicine savings, vernacular WhatsApp audio prescriptions, and rural offline continuity. Next on my roadmap: field evaluation with rural ASHA health workers in Andhra Pradesh, real-time SIP telephony integration, and clinical trials.

---

### A PERSONAL NOTE FROM THE BUILDER
> **A personal note from the builder:** Growing up in Andhra Pradesh and watching elders in my family struggle to understand English prescription slips at local clinics showed me that healthcare failure in rural India is rarely about medicine—it is about communication. When a patient takes the wrong dose because they cannot read the label, or spends ₹200 on branded tablets when a ₹30 Jan Aushadhi generic exists at the government counter, software has failed them. I built AyuSwar AI solo from Aditya University for this challenge because voice is the only interface that respects people who cannot read or type.

---

| 💊 86% SAVINGS | 📊 48kHz DSP | 🛡️ 74 / 74 GREEN | 🩺 ABDM M3 READY |
| :---: | :---: | :---: | :---: |
| PMBJP Jan Aushadhi Generic Substitution | WebAudio Client Wheeze Harmonics (380-450Hz) | Zero-Mock Clinical Invariant Tests Passed | FHIR R4 JSON & Encrypted Offline Buffer |

---

**Satya Samrudh Dwivedula** · B.Tech CSE, Aditya University (expected Sep 2028)  
*AyuSwar AI · Solution pitch · 2026*
