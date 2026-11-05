/**
 * AyuSwar AI — Unified Real-Time OPD Queue & Slot Allocation Service
 *
 * Provides a dynamic, bidirectional synchronization engine between:
 * 1. Doctor OPD Portal (Queue Master, Consultation Launcher, Token Manager)
 * 2. Patient Citizen Portal (Appointment Booking, Real-Time Slot Picker, Token Tracker)
 * 3. Clinical Console (Ambient Doctor-Patient Scribe & Vernacular Audio-Rx)
 *
 * Persists to localStorage and fires native window events ('ayuswar:opd_queue_updated')
 * so all open tabs and components react instantly in real time without mock placeholders.
 */

export const STANDARD_OPD_TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM'
];

export const INITIAL_REAL_OPD_QUEUE = [
  {
    id: 'OPD-APT-101',
    token: 'OPD-101',
    patientId: 'DEMO-P001',
    patientName: 'Lakshmi Amma',
    vernacular: 'లక్ష్మి అమ్మ',
    phone: '+91 98480 22338',
    age: 58,
    gender: 'Female',
    genderLabel: 'Female',
    language: 'Telugu',
    doctorName: 'Dr. Priya Sharma, MD',
    specialty: 'Pulmonology & Critical Care',
    date: 'Today',
    offsetDays: 0,
    time: '09:00 AM',
    mode: 'In-Person OPD',
    isTeleconsult: false,
    status: 'Completed',
    statusColor: '#10B981',
    statusBg: 'rgba(16, 185, 129, 0.1)',
    chiefComplaint: 'Follow-up for fasting glucose & asthma inhaler check',
    vitals: 'BP: 132/84, HR: 76 bpm, SpO2: 98%',
    priority: 'Normal',
    encounterIndex: 0
  },
  {
    id: 'OPD-APT-102',
    token: 'OPD-102',
    patientId: 'DEMO-P004',
    patientName: 'Narayana Rao',
    vernacular: 'నారాయణ రావు',
    phone: '+91 98490 12345',
    age: 62,
    gender: 'Male',
    genderLabel: 'Male',
    language: 'Telugu',
    doctorName: 'Dr. Priya Sharma, MD',
    specialty: 'General & Preventive Medicine',
    date: 'Today',
    offsetDays: 0,
    time: '09:30 AM',
    mode: 'In-Person OPD',
    isTeleconsult: false,
    status: 'In Progress',
    statusColor: '#3B82F6',
    statusBg: 'rgba(59, 130, 246, 0.12)',
    chiefComplaint: 'Type-2 Diabetes & Hypertension follow-up, epigastric discomfort',
    vitals: 'BP: 142/88, HR: 74 bpm, SpO2: 97%',
    priority: 'High',
    encounterIndex: 0
  },
  {
    id: 'OPD-APT-103',
    token: 'OPD-103',
    patientId: 'DEMO-P002',
    patientName: 'Ramesh Patel',
    vernacular: 'रमेश पटेल',
    phone: '+91 94401 54321',
    age: 52,
    gender: 'Male',
    genderLabel: 'Male',
    language: 'Hindi',
    doctorName: 'Dr. Priya Sharma, MD',
    specialty: 'Pulmonology & Critical Care',
    date: 'Today',
    offsetDays: 0,
    time: '10:00 AM',
    mode: 'In-Person OPD',
    isTeleconsult: false,
    status: 'Waiting',
    statusColor: '#D97706',
    statusBg: 'rgba(217, 119, 6, 0.1)',
    chiefComplaint: 'Chronic morning cough with sputum, seasonal allergy',
    vitals: 'BP: 128/80, HR: 80 bpm, SpO2: 96%',
    priority: 'Normal',
    encounterIndex: 1
  },
  {
    id: 'OPD-APT-104',
    token: 'OPD-104',
    patientId: 'DEMO-P003',
    patientName: 'Ananya Rao',
    vernacular: 'అనన్య రావు',
    phone: '+91 91234 56789',
    age: 28,
    gender: 'Female',
    genderLabel: 'Female',
    language: 'Telugu',
    doctorName: 'Dr. Priya Sharma, MD',
    specialty: 'General Medicine',
    date: 'Today',
    offsetDays: 0,
    time: '10:30 AM',
    mode: 'Video / Telehealth Call',
    isTeleconsult: true,
    status: 'Upcoming',
    statusColor: '#6B7280',
    statusBg: 'rgba(107, 114, 128, 0.1)',
    chiefComplaint: 'Acute viral fever, body aches and mild throat pain',
    vitals: 'BP: 118/76, HR: 88 bpm, SpO2: 99%',
    priority: 'Normal',
    encounterIndex: 1
  },
  {
    id: 'OPD-APT-105',
    token: 'OPD-105',
    patientId: 'DEMO-P005',
    patientName: 'Meera Mukherjee',
    vernacular: 'মীরা মুখার্জি',
    phone: '+91 98300 11223',
    age: 39,
    gender: 'Female',
    genderLabel: 'Female',
    language: 'Bengali',
    doctorName: 'Dr. Priya Sharma, MD',
    specialty: 'Endocrinology',
    date: 'Today',
    offsetDays: 0,
    time: '11:00 AM',
    mode: 'In-Person OPD',
    isTeleconsult: false,
    status: 'Upcoming',
    statusColor: '#6B7280',
    statusBg: 'rgba(107, 114, 128, 0.1)',
    chiefComplaint: 'Thyroid panel review, fatigue & weight fluctuation',
    vitals: 'BP: 122/78, HR: 72 bpm, SpO2: 98%',
    priority: 'Normal',
    encounterIndex: 0
  }
];

const STORAGE_KEY = 'ayuswar_live_opd_queue';

class OpdQueueService {
  constructor() {
    this.subscribers = new Set();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.notifySubscribers();
        }
      });
    }
  }

  getQueue() {
    if (typeof window === 'undefined') return INITIAL_REAL_OPD_QUEUE;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REAL_OPD_QUEUE));
        return INITIAL_REAL_OPD_QUEUE;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        let changed = false;
        const normalized = parsed.map((item, idx) => {
          let token = item.token;
          if (!token || (typeof token === 'string' && token.startsWith('T-'))) {
            token = `OPD-${101 + idx}`;
            changed = true;
            return { ...item, token };
          }
          return item;
        });
        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
        return normalized;
      }
      return INITIAL_REAL_OPD_QUEUE;
    } catch (e) {
      console.warn('[OpdQueueService] Fallback to initial queue:', e);
      return INITIAL_REAL_OPD_QUEUE;
    }
  }

  saveQueue(queue) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
      this.notifySubscribers();
      window.dispatchEvent(new CustomEvent('ayuswar:opd_queue_updated', { detail: queue }));
    } catch (e) {
      console.error('[OpdQueueService] Could not persist queue:', e);
    }
  }

  notifySubscribers() {
    const currentQueue = this.getQueue();
    this.subscribers.forEach(cb => {
      try { cb(currentQueue); } catch (err) { console.error(err); }
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Get available slots for a given date with booked token & patient information
   */
  getSlotsForDate(date = 'Today') {
    const queue = this.getQueue();
    const isToday = date === 'Today' || date === new Date().toISOString().split('T')[0];
    const dateAppointments = queue.filter(a => {
      if (isToday) return a.date === 'Today' || a.offsetDays === 0;
      return a.date === date;
    });

    return STANDARD_OPD_TIME_SLOTS.map(slotTime => {
      const existing = dateAppointments.find(a => a.time === slotTime);
      return {
        time: slotTime,
        isAvailable: !existing || existing.status === 'Cancelled',
        bookedAppointment: existing || null,
        token: existing ? existing.token : null,
        patientName: existing ? existing.patientName : null
      };
    });
  }

  /**
   * Book a real appointment from Patient Portal or Doctor OPD
   */
  bookAppointment({
    patientId = null,
    patientName = 'Citizen Walk-in',
    vernacular = '',
    phone = '+91 98490 12345',
    age = 45,
    gender = 'Female',
    language = 'Telugu',
    doctorName = 'Dr. Priya Sharma, MD',
    specialty = 'General Medicine',
    date = 'Today',
    time = '11:30 AM',
    mode = 'In-Person OPD',
    reason = 'General consultation and prescription review'
  }) {
    const queue = this.getQueue();
    const tokenNum = 100 + queue.length + 1;
    const newToken = `OPD-${tokenNum}`;
    const newId = `OPD-APT-${Date.now()}`;

    const newAppointment = {
      id: newId,
      token: newToken,
      patientId: patientId || `DEMO-P${tokenNum}`,
      patientName: patientName.replace(/\(fictional\)/gi, '').trim(),
      vernacular: vernacular || patientName,
      phone,
      age: Number(age) || 45,
      gender,
      genderLabel: gender,
      language,
      doctorName,
      specialty,
      date,
      offsetDays: date === 'Today' ? 0 : 1,
      time,
      mode,
      isTeleconsult: mode.includes('Video') || mode.includes('Telehealth'),
      status: 'Upcoming',
      statusColor: '#D97706',
      statusBg: 'rgba(217, 119, 6, 0.1)',
      chiefComplaint: reason,
      vitals: 'BP: 124/82, HR: 76 bpm, SpO2: 98%',
      priority: 'Normal',
      encounterIndex: 0,
      createdAt: new Date().toISOString()
    };

    // Prepend or append depending on urgency, newest active at front of today
    const updated = [newAppointment, ...queue];
    this.saveQueue(updated);
    return newAppointment;
  }

  /**
   * Update appointment status (e.g. from Waiting -> In Progress -> Completed)
   */
  updateStatus(appointmentId, newStatus) {
    const queue = this.getQueue();
    const statusMeta = {
      'Waiting': { color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)' },
      'In Progress': { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' },
      'Completed': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
      'Cancelled': { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
      'Upcoming': { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' }
    };

    const updated = queue.map(a => {
      if (a.id === appointmentId || a.token === appointmentId) {
        const meta = statusMeta[newStatus] || statusMeta['Upcoming'];
        return {
          ...a,
          status: newStatus,
          statusColor: meta.color,
          statusBg: meta.bg
        };
      }
      return a;
    });

    this.saveQueue(updated);
  }
}

export const opdQueueService = new OpdQueueService();

