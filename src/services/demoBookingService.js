/**
 * AyuSwar AI — Demo OPD Booking Service
 * 
 * Manages runtime demo bookings in localStorage ('ayuswar_demo_bookings').
 * Strictly enforces demo identity scope: only bundled fictional identities 
 * and booking logistics are persisted. No real patient identifiers, ABHA numbers,
 * or health details are ever stored.
 */

const STORAGE_KEY = 'ayuswar_demo_bookings';

// Department code lookup for realistic OPD tokens
const DEPT_CODES = {
  'General Medicine': 'GM',
  'Pulmonology & Internal Medicine': 'PUL',
  'Pulmonology & Critical Care': 'PUL',
  'Cardiology': 'CARD',
  'Endocrinology': 'ENDO',
  'Pediatrics': 'PED',
  'Dermatology': 'DERM',
  'ENT': 'ENT'
};

// Bundled fictional patient names for demo safety guardrail
const BUNDLED_DEMO_NAMES = [
  'Ananya Rao',
  'Ramesh Patel',
  'Lakshmi Amma',
  'Narayana Rao',
  'Narayana Murthy',
  'Meera Mukherjee',
  'Sunita Deshmukh',
  'Harpreet Singh',
  'Murugan Pillai'
];

export const demoBookingService = {
  /**
   * Retrieve stored demo bookings
   */
  getBookings() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('[demoBookingService] Failed to parse demo bookings:', e);
      return [];
    }
  },

  /**
   * Create a new demo booking ticket
   */
  createBooking({
    patientName = 'Ananya Rao',
    patientAge = 28,
    patientGender = 'F',
    doctorName = 'Dr. Demo Sharma',
    department = 'General Medicine',
    specialty = 'General Medicine',
    date = 'Fri, 6 Nov 2026',
    time = '10:30 AM',
    mode = 'In-person'
  }) {
    // Generate robust UUID (no collisions)
    let uuid;
    try {
      uuid = crypto.randomUUID();
    } catch {
      uuid = 'uuid-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    }

    const shortCode = uuid.replace(/-/g, '').slice(0, 4).toUpperCase();
    const deptCode = DEPT_CODES[department] || DEPT_CODES[specialty] || 'GM';
    const seq = Math.floor(40 + Math.random() * 50); // e.g. GM-042
    const token = `${deptCode}-${String(seq).padStart(3, '0')}`;
    const bookingRef = `AS-DEMO-${shortCode}`;

    // Demo safety guardrail: sanitize patientName to ensure only fictional demo identity is persisted
    const isBundled = BUNDLED_DEMO_NAMES.some(
      n => n.toLowerCase() === String(patientName).trim().toLowerCase()
    );
    const safePatientName = isBundled ? patientName : 'Ananya Rao';

    const newBooking = {
      id: uuid,
      ref: bookingRef,
      token,
      patientName: safePatientName,
      patientAge: Number(patientAge) || 28,
      patientGender: patientGender === 'Male' ? 'M' : (patientGender === 'Female' ? 'F' : 'F'),
      doctorName: doctorName || 'Dr. Demo Sharma',
      department: department || specialty || 'General Medicine',
      specialty: specialty || department || 'General Medicine',
      date: date || 'Fri, 6 Nov 2026',
      time: time || '10:30 AM',
      mode: mode || 'In-person',
      status: 'Request sent · hospital confirms',
      statusCode: 'REQUESTED',
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        const current = this.getBookings();
        const updated = [newBooking, ...current];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('ayuswar:demo_booking_created', { detail: newBooking }));
      } catch (err) {
        console.error('[demoBookingService] Failed to persist demo booking:', err);
      }
    }

    return newBooking;
  },

  /**
   * Reset/clear demo bookings from localStorage
   */
  resetBookings() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('ayuswar:demo_booking_cleared'));
    } catch (err) {
      console.warn('[demoBookingService] Failed to clear demo bookings:', err);
    }
  }
};

export default demoBookingService;
