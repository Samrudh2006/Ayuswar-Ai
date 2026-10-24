/**
 * routePreloader.js
 * Intelligent Zero-Latency Route & Module Preloader for AyuSwar AI
 * 
 * Preloads split route chunks and heavyweight modals during browser idle periods.
 * Enables 0ms instantaneous page transitions when users click any link or button.
 */

export const ROUTE_IMPORTERS = {
  '/doctor': () => import('../components/DoctorPortal'),
  '/patient': () => import('../components/PatientPortal'),
  '/emergency': () => import('../views/EmergencyTriageView'),
  '/scanner': () => import('../views/PrescriptionScannerView'),
  '/audio-rx': () => import('../views/AudioRxStudioView'),
  '/acoustic-lab': () => import('../views/AcousticBiomarkerLabView'),
  '/architecture': () => import('../views/ArchitectureView'),
  '/benchmark': () => import('../views/ClinicalBenchmarkView'),
  '/languages': () => import('../views/IndicLanguageMatrixView'),
  '/dataset': () => import('../views/DatasetExplorerView'),
  '/handover': () => import('../views/EmergencyHandoverView'),
  '/prescription': () => import('../views/PrescriptionPreviewView'),
  '/privacy': () => import('../views/PrivacyPolicyView'),
  '/terms': () => import('../views/TermsOfServiceView'),
  '/auth': () => import('../views/UnifiedAuthView'),
  '/solutions/opd_ambient_scribe': () => import('../components/DetailedModuleView'),
  'sanjivani_modal': () => import('../components/SanjivaniEmergencyModal')
};

const preloadedCache = new Set();

/**
 * Preloads a specific route or modal module immediately (e.g., on button/link hover)
 */
export function preloadModule(keyOrPath) {
  if (!keyOrPath || preloadedCache.has(keyOrPath)) return;

  const importer = ROUTE_IMPORTERS[keyOrPath] || 
    Object.entries(ROUTE_IMPORTERS).find(([k]) => keyOrPath.startsWith(k) && k !== '/')?.[1];

  if (importer) {
    preloadedCache.add(keyOrPath);
    try {
      importer().catch(() => {
        preloadedCache.delete(keyOrPath);
      });
    } catch {}
  }
}

/**
 * Staggered idle preloading of all primary routes so the application
 * is 100% warmed up and delivers instantaneous page transitions.
 */
export function initAllRoutesPreload() {
  if (typeof window === 'undefined') return;

  const priorityKeys = [
    '/emergency',
    'sanjivani_modal',
    '/doctor',
    '/patient',
    '/audio-rx',
    '/scanner',
    '/acoustic-lab',
    '/architecture',
    '/benchmark',
    '/languages',
    '/dataset',
    '/solutions/opd_ambient_scribe'
  ];

  const runPreload = () => {
    priorityKeys.forEach((key, index) => {
      setTimeout(() => {
        preloadModule(key);
      }, 100 + index * 90); // Smooth 90ms staggered queue to preserve 60 FPS
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(runPreload, { timeout: 1500 });
  } else {
    setTimeout(runPreload, 800);
  }
}
