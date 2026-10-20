# 🎙️ LinkedIn Launch Copy: Live Voice AI & Acoustic Biomarker Lab (AyuSwar AI)

---

Can a standard smartphone microphone detect vocal cord fatigue, glottal turbulence, and airway resistance before a clinical spirometry test? 🫁⚡

In rural India and Tier-2/3 Primary Health Centers, access to dedicated pulmonology equipment, spirometers, and specialist auscultation is scarce. Yet, nearly every health worker and patient carries an audio sensor in their pocket: a mobile microphone.

As part of **AyuSwar AI**, we built and open-sourced the **Live Acoustic Biomarker Lab** — an in-browser, real-time vocal and respiratory digital signal processing (DSP) engine built directly on the Web Audio API.

No uncompressed audio is ever sent to a server. Zero latency, 100% on-device patient privacy.

Here is what happens under the hood when a patient speaks or breathes into the mic:

---

### 🔬 1. Client-Side Real-Time Autocorrelation ($F_0$ Pitch Tracking)
Instead of streaming uncompressed raw audio to an expensive cloud server, the entire signal processing pipeline runs locally in the browser:
* **Fundamental Frequency ($F_0$):** Measures phonatory vocal cord vibration across low, mid, and high registers (80 Hz – 420 Hz).
* **Harmonics-to-Noise Ratio (HNR in dB):** Quantifies glottal turbulence and air leakage during sustained phonation.
* **Perturbation Analysis (Jitter % & Shimmer %):** Detects cycle-to-cycle frequency and amplitude instability.

---

### 🎶 2. Narrow-Band Wheeze & Adventitious Sound Detection
Continuous musical adventitious sounds (wheezes and stridors) are characterized by distinct resonant peaks between 350 Hz and 900 Hz:
* Real-time FFT frequency spectrum analyzer samples up to 1024 bins at 44.1/48 kHz.
* Detects narrow-band energy spikes where resonant peak-to-average spectral ratios exceed 2.2x, providing instant visual HUD alerts during respiratory distress.

---

### ⏱️ 3. One-Tap 5-Second Phonation & Wheeze Sampler
Doctors and rural healthcare workers can prompt a patient for a simple 5-second sustained 'Aaah' vowel:
* Aggregates dozens of windowed acoustic frames across the phonation window.
* Automatically filters outlier frames and calculates statistically robust medians.
* Maps feature vectors against published respiratory and voice acoustics literature benchmarks (Asthma wheeze whistle profiles, pediatric stridor, COPD low-frequency dampening, and standard phonation baselines).

---

### 🔊 4. Vernacular Voice Readout for Non-Literate Patients
Acoustic data is useless if the patient can't understand it. With one tap on "Speak Acoustic Readout", the lab synthesizes a clear, vernacular spoken explanation using neural Indic TTS (Gnani Timbre), making the physical findings accessible across linguistic barriers.

---

### 🛡️ 5. Honest Clinical Guardrails
Acoustic telemetry is a physical engineering measurement — not a replacement for stethoscopic auscultation, spirometry, or a licensed doctor's diagnostic judgment. AyuSwar AI labels all extracted signals transparently as experimental digital decision aids without inflated probabilistic claims.

---

🔗 **Try the Live Lab in your browser right now:**
https://ayuswar-ai.vercel.app/acoustic-lab

💻 **Open Source Code on GitHub:**
https://github.com/Samrudh2006/Ayuswar-Ai

👉 Would love feedback from digital health researchers, biomedical engineers, and pulmonology specialists on expanding non-invasive acoustic biomarkers for primary care!

#HealthTech #DigitalHealth #AIinHealthcare #AcousticBiomarkers #WebAudio #BiomedicalEngineering #OpenSource #Telemedicine #IndicAI #AyuSwarAI #VoiceAI
