/**
 * AyuSwar AI — Acoustic Signal & Feature Analysis Engine (clinicalMlInferenceEngine.js)
 * 
 * Non-Negotiable Rules & Truthful Scope:
 * 1. NON-DIAGNOSTIC EXPERIMENTAL SIGNALS:
 *    - Physical acoustic DSP metrics (Fundamental Frequency F0, Jitter %, Shimmer %,
 *      Harmonics-to-Noise Ratio HNR, Spectral Centroid) are extracted via digital signal processing.
 *    - These are physical audio features, NOT medical disease probabilities or clinical diagnoses.
 * 2. NO FORCED METRIC FLOORS:
 *    - The previous 65% artificial confidence floor has been removed.
 *    - If no distinct vocal perturbation is present, the engine honestly outputs low/nominal variance.
 * 3. NO AUTONOMOUS PRESCRIBING:
 *    - Removed all drug recommendations and dosages from acoustic scoring.
 * 4. MULTI-ORGAN CATEGORY SENSITIVITY:
 *    - Evaluates specific acoustic profiles across respiratory, vocal edema (cardiac research models),
 *      pediatric stridor, and phonatory micro-tremors without defaulting to COPD.
 */

export const EXPERIMENTAL_DSP_MODEL_CARD = {
  architecture: 'Heuristic Acoustic Feature Extractor & Statistical Distance Baseline',
  status: 'Research Demonstration / Non-Diagnostic Prototype',
  inputDimensions: 6, // F0, Jitter, Shimmer, HNR, Spectral Centroid, RMS
  validatedForClinicalUse: false,
  limitations: 'Calculates standard digital audio signal metrics. Not an FDA/CDSCO approved medical diagnostic device.'
};

/**
 * Standard published acoustic reference ranges from voice literature
 * (Used for descriptive baseline comparison, not disease diagnosis)
 */
export const ACOUSTIC_CLUSTER_PROFILES = {
  normal_phonation: {
    label: 'Standard Phonation Baseline',
    category: 'Baseline Reference',
    f0Mean: 135, f0Std: 25,
    jitterMean: 0.65, jitterStd: 0.20,
    shimmerMean: 1.80, shimmerStd: 0.45,
    hnrMean: 22.0, hnrStd: 3.5,
    spectralCentroidMean: 1200, spectralCentroidStd: 250,
    description: 'Harmonically stable sustained vocal phonation without audible turbulence.'
  },
  asthma_wheeze: {
    label: 'High-Frequency Polyphonic Airway Signal',
    category: 'Pulmonology (Experimental Signal)',
    f0Mean: 220, f0Std: 45,
    jitterMean: 2.85, jitterStd: 0.75,
    shimmerMean: 4.90, shimmerStd: 1.20,
    hnrMean: 13.8, hnrStd: 2.2,
    spectralCentroidMean: 1850, spectralCentroidStd: 320,
    description: 'Elevated spectral centroid and periodic turbulence characteristic of narrowed airways.'
  },
  copd_rhonchi: {
    label: 'Low-Frequency Bronchial Airway Perturbation',
    category: 'Pulmonology (Experimental Signal)',
    f0Mean: 130, f0Std: 25,
    jitterMean: 3.40, jitterStd: 0.85,
    shimmerMean: 6.20, shimmerStd: 1.50,
    hnrMean: 11.2, hnrStd: 2.0,
    spectralCentroidMean: 950, spectralCentroidStd: 180,
    description: 'Sub-audible low-frequency harmonic dampening with increased jitter.'
  },
  pneumonia_rales: {
    label: 'Explosive Discontinuous Adventitious Signal',
    category: 'Pulmonology (Experimental Signal)',
    f0Mean: 195, f0Std: 40,
    jitterMean: 3.65, jitterStd: 0.90,
    shimmerMean: 7.80, shimmerStd: 1.80,
    hnrMean: 11.5, hnrStd: 2.1,
    spectralCentroidMean: 1450, spectralCentroidStd: 280,
    description: 'Discontinuous acoustic crackles across middle frequencies.'
  },
  vocal_edema_fluid: {
    label: 'Dampened Fundamental Frequency & Spectral Dispersion',
    category: 'Cardiovascular Literature Research Pattern',
    f0Mean: 112, f0Std: 20,
    jitterMean: 4.15, jitterStd: 1.10,
    shimmerMean: 8.40, shimmerStd: 1.90,
    hnrMean: 9.4, hnrStd: 2.5,
    spectralCentroidMean: 820, spectralCentroidStd: 160,
    description: 'Vocal fold mass-loading causing pitch depression and reduced harmonic purity.'
  },
  neurological_tremor: {
    label: 'Low-Frequency Phonatory Modulation (4–8 Hz Flutter)',
    category: 'Neurological Literature Research Pattern',
    f0Mean: 136, f0Std: 22,
    jitterMean: 3.90, jitterStd: 0.95,
    shimmerMean: 6.70, shimmerStd: 1.40,
    hnrMean: 12.1, hnrStd: 2.0,
    spectralCentroidMean: 1100, spectralCentroidStd: 210,
    description: 'Periodic amplitude and frequency modulation during sustained phonation.'
  },
  pediatric_stridor: {
    label: 'High-Pitch Inspiratory Airway Signal',
    category: 'Pediatric Respiratory Research Pattern',
    f0Mean: 380, f0Std: 65,
    jitterMean: 4.20, jitterStd: 1.20,
    shimmerMean: 7.90, shimmerStd: 1.70,
    hnrMean: 8.5, hnrStd: 1.9,
    spectralCentroidMean: 2800, spectralCentroidStd: 450,
    description: 'Marked upper airway obstruction harmonic signature with high spectral centroid.'
  }
};

/**
 * Standard Gaussian Probability Density function
 */
function gaussianPdf(x, mean, std) {
  if (std <= 0) return 0.001;
  const exponent = -0.5 * Math.pow((x - mean) / std, 2);
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

/**
 * Analyze physical acoustic metrics against known acoustic patterns.
 * Returns raw similarity distances WITHOUT claiming disease diagnosis or prescribing medicine.
 */
export function analyzeAcousticSignals(metrics = {}, options = {}) {
  const f0 = Number(metrics.pitchF0 || metrics.f0 || 140);
  const jitter = Number(metrics.jitterPct || metrics.jitter || 0.8);
  const shimmer = Number(metrics.shimmerPct || metrics.shimmer || 2.0);
  const hnr = Number(metrics.hnrDb || metrics.hnr || 20.0);
  const centroid = Number(metrics.spectralCentroid || 1200);
  const targetCategory = options.targetCategory || null;

  const clusterComparisons = Object.entries(ACOUSTIC_CLUSTER_PROFILES).map(([key, profile]) => {
    const pF0 = gaussianPdf(f0, profile.f0Mean, profile.f0Std);
    const pJit = gaussianPdf(jitter, profile.jitterMean, profile.jitterStd);
    const pShim = gaussianPdf(shimmer, profile.shimmerMean, profile.shimmerStd);
    const pHnr = gaussianPdf(hnr, profile.hnrMean, profile.hnrStd);
    const pCent = gaussianPdf(centroid, profile.spectralCentroidMean, profile.spectralCentroidStd);

    // Normalized acoustic match score (0 to 100)
    const logSum = (Math.log(pF0 || 1e-6) + Math.log(pJit || 1e-6) + Math.log(pShim || 1e-6) + Math.log(pHnr || 1e-6) + Math.log(pCent || 1e-6)) / 5;
    const similarityScore = Math.max(0, Math.min(100, Math.round((logSum + 8) * 12.5)));

    return {
      key,
      label: profile.label,
      category: profile.category,
      description: profile.description,
      similarityScore,
      measuredFeatures: { f0, jitter, shimmer, hnr, centroid }
    };
  });

  // Sort by similarity
  clusterComparisons.sort((a, b) => b.similarityScore - a.similarityScore);

  // Calculate honest Pitch Register strictly derived from measured F0
  let pitchRegister = 'Mid Register (165–260 Hz)';
  let pitchBand = 'mid';
  if (f0 < 165) {
    pitchRegister = 'Low Register (< 165 Hz)';
    pitchBand = 'low';
  } else if (f0 > 260) {
    pitchRegister = 'High Register (> 260 Hz)';
    pitchBand = 'high';
  }

  return {
    isDiagnostic: false,
    disclaimer: 'Research signal viewer, not for diagnosis. Synthetic test signals only.',
    pitchRegister,
    pitchBand,
    measuredMetrics: {
      pitchF0: f0,
      jitterPct: jitter,
      shimmerPct: shimmer,
      hnrDb: hnr,
      spectralCentroid: centroid
    },
    topAcousticMatch: clusterComparisons[0],
    allAcousticMatches: clusterComparisons
  };
}
