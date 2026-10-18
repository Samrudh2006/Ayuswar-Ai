/**
 * webPushService.js
 * Implements Phase 11: Push-Alerts for scheduled morning/night dosage alarms with vernacular reminders.
 */

export const requestPushPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { granted: false, reason: 'unsupported' };
  }

  try {
    const permission = await Notification.requestPermission();
    return { granted: permission === 'granted', permission };
  } catch (err) {
    return { granted: false, error: err.message };
  }
};

export const triggerDosagePushNotification = (medicineName, timing, vernacularNotice) => {
  const title = `💊 AyuSwar AI: ${medicineName} Time (${timing})`;
  const body = vernacularNotice || `వేళకు మందులు తీసుకోండి. Take your prescribed dosage on time.`;

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/assets/ayuswar_master_emblem.png',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200]
      });
      return true;
    } catch {
      // Fallback if Notification constructor fails (e.g. mobile requirement for ServiceWorkerRegistration.showNotification)
    }
  }

  // Fallback in-app broadcast event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ayuswar:dosage_alert', {
      detail: { title, body, medicineName, timing }
    }));
  }
  return true;
};
