/**
 * clinicalOfflineStorage.js — AyuSwar AI Resilient Offline Clinical Storage API
 * 
 * Provides an explicit high-level facade over IndexedDB ('ayuswar_clinical_offline_db')
 * and offline sync queues for OPD consultations, prescriptions, vitals, and RAG audio cache.
 */

import {
  openOfflineDatabase,
  enqueueOfflineAction,
  getPendingSyncQueue,
  cacheClinicalRecord,
  getCachedClinicalRecord,
  flushOfflineSyncQueue
} from './offlineSyncService.js';

export class ClinicalOfflineStorageService {
  constructor() {
    this.dbName = 'ayuswar_clinical_offline_db';
  }

  async init() {
    return openOfflineDatabase();
  }

  /**
   * Save an OPD Encounter offline with immediate local cache and sync queue entry
   */
  async saveEncounter(encounter) {
    if (!encounter || !encounter.id) return false;
    await cacheClinicalRecord('cached_encounters', encounter);
    await enqueueOfflineAction({
      type: 'encounter',
      payload: encounter,
      timestamp: Date.now()
    });
    return true;
  }

  /**
   * Retrieve cached encounter by ID
   */
  async getEncounter(encounterId) {
    return getCachedClinicalRecord('cached_encounters', encounterId);
  }

  /**
   * Save patient vitals offline
   */
  async saveVitals(vitalsRecord) {
    if (!vitalsRecord || !vitalsRecord.id) return false;
    await cacheClinicalRecord('cached_vitals', vitalsRecord);
    await enqueueOfflineAction({
      type: 'vitals',
      payload: vitalsRecord,
      timestamp: Date.now()
    });
    return true;
  }

  /**
   * Save prescription offline
   */
  async savePrescription(prescription) {
    if (!prescription || !prescription.id) return false;
    await cacheClinicalRecord('cached_prescriptions', prescription);
    await enqueueOfflineAction({
      type: 'prescription',
      payload: prescription,
      timestamp: Date.now()
    });
    return true;
  }

  /**
   * Get total count of pending sync actions
   */
  async getPendingCount() {
    const queue = await getPendingSyncQueue();
    return queue ? queue.length : 0;
  }

  /**
   * Flush all offline records to cloud backend when online
   */
  async syncAll() {
    return flushOfflineSyncQueue();
  }
}

export const clinicalOfflineStorage = new ClinicalOfflineStorageService();
