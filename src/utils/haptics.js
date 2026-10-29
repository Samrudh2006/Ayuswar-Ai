/**
 * haptics.js — Native Device Haptic Feedback Engine
 * Provides subtle tactile confirmation on mobile devices (Android / Capacitor / Mobile Web).
 */

export const triggerHaptic = (type = 'light') => {
  if (typeof window === 'undefined' || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(22);
        break;
      case 'success':
        navigator.vibrate([15, 35, 20]);
        break;
      case 'warning':
      case 'alert':
        navigator.vibrate([40, 40, 40]);
        break;
      default:
        navigator.vibrate(15);
    }
  } catch {}
};
