/**
 * Pharmacovigilance Sentinel & Geriatric Beers Criteria Engine
 * Based on NEJM AI (2024), AGS Beers Criteria 2023, and KDIGO Renal Guidelines.
 */

export function evaluatePharmacovigilanceSafety({
  drugId,
  drugKeywords = [],
  patientAge = 45,
  eGfr = 90
}) {
  const isGeriatric = patientAge >= 65;
  const isRenalImpaired = eGfr < 60;
  const isSevereRenal = eGfr < 30;

  const kw = drugKeywords.map(k => k.toLowerCase());
  const id = (drugId || '').toLowerCase();

  const isNsaid = kw.some(k => ['combiflam', 'ibuprofen', 'brufen', 'zerodol', 'aceclofenac', 'diclofenac', 'nimesulide'].includes(k)) ||
                  ['combiflam', 'zerodol_p'].includes(id);

  const isMetformin = kw.some(k => ['glycomet', 'metformin', 'glyciphage', 'glucophage'].includes(k)) ||
                      id === 'metformin';

  const isAntihypertensive = kw.some(k => ['amlodipine', 'telmisartan', 'telma', 'amlopres'].includes(k)) ||
                             id.includes('amlodipine');

  const isStatin = kw.some(k => ['atorva', 'atorvastatin', 'lipitor', 'statin'].includes(k)) ||
                   id === 'atorvastatin';

  // 1. NSAID Evaluations (Beers Criteria + KDIGO)
  if (isNsaid) {
    if (isSevereRenal) {
      return {
        severity: 'CRITICAL',
        badge: 'Absolute Contraindication',
        color: '#DC2626',
        bgColor: '#FEF2F2',
        borderColor: '#F87171',
        title: 'KDIGO Severe Renal Impairment Alert (eGFR < 30 mL/min)',
        details: 'Systemic NSAIDs inhibit renal vasodilatory prostaglandins, precipitating acute renal failure and hyperkalemia.',
        recommendation: 'Discontinue NSAID immediately. Substitute with pure Paracetamol 650mg SOS for analgesia.'
      };
    }
    if (isGeriatric) {
      return {
        severity: 'HIGH_RISK',
        badge: 'AGS Beers Criteria 2023 Warning',
        color: '#B91C1C',
        bgColor: '#FFF1F2',
        borderColor: '#FDA4AF',
        title: 'Geriatric Beers Criteria Warning (Age ≥ 65)',
        details: 'High risk of severe peptic ulcer bleeding, fluid retention, worsening of baseline hypertension, and acute tubular injury in older adults.',
        recommendation: 'Avoid chronic NSAID therapy. Use lowest effective dose with PPI gastroprotection or switch to Paracetamol.'
      };
    }
  }

  // 2. Metformin Evaluations (MALA Boxed Warning)
  if (isMetformin) {
    if (isSevereRenal) {
      return {
        severity: 'CRITICAL',
        badge: 'Black Box Safety Alert',
        color: '#DC2626',
        bgColor: '#FEF2F2',
        borderColor: '#F87171',
        title: 'Metformin-Associated Lactic Acidosis (MALA) Risk',
        details: 'Metformin is strictly contraindicated in patients with eGFR < 30 mL/min due to drug accumulation and high mortality lactic acidosis risk.',
        recommendation: 'Discontinue Metformin. Review with endocrinologist for insulin or SGLT2/DPP-4 alternatives suitable for low eGFR.'
      };
    }
    if (eGfr >= 30 && eGfr < 45) {
      return {
        severity: 'MODERATE_RISK',
        badge: 'Renal Dose Modification',
        color: '#D97706',
        bgColor: '#FFFBEB',
        borderColor: '#FCD34D',
        title: 'eGFR 30–44 mL/min Renal Adjustment',
        details: 'Renal clearance moderately impaired. Maximum daily ceiling is 500mg SR.',
        recommendation: 'Cap dosage at 500mg daily. Monitor serum creatinine and eGFR every 3 months.'
      };
    }
  }

  // 3. Antihypertensive in Geriatric
  if (isAntihypertensive && isGeriatric) {
    return {
      severity: 'MONITORING',
      badge: 'Geriatric Fall Prevention',
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
      title: 'Orthostatic Hypotension & Fall Sentinel',
      details: 'Antihypertensives in patients ≥65 can cause postural dizziness upon standing.',
      recommendation: 'Advise patient to sit on bed edge for 30 seconds before standing. Monitor seated vs standing BP.'
    };
  }

  // 4. Statin Hepatic & Muscle Monitoring
  if (isStatin && isGeriatric) {
    return {
      severity: 'MONITORING',
      badge: 'Myopathy & Interaction Guard',
      color: '#0D9488',
      bgColor: '#F0FDFA',
      borderColor: '#99F6E4',
      title: 'Statin Myopathy & Hepatic Sentinel',
      details: 'Higher susceptibility to myalgia and drug interactions with concurrent macrolide or calcium-channel blockers in elderly patients.',
      recommendation: 'Educate patient to report unexplained muscle tenderness or tea-colored urine promptly.'
    };
  }

  // Baseline Cleared
  return {
    severity: 'CLEARED',
    badge: 'Formulary Cleared',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    title: 'Cleared by Beers Criteria & KDIGO Renal Matrix',
    details: `No active age-related contraindications or renal dose adjustments required for Age ${patientAge} with eGFR ${eGfr} mL/min.`,
    recommendation: 'Standard clinical dispensing schedule approved.'
  };
}
