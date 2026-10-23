/**
 * AyuSwar AI — Unified Authentication Service
 * 
 * Provides production-ready OTP authentication abstraction:
 * 1. Supabase Auth (when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set).
 * 2. Honest Prototype Fallback (when Supabase is unconfigured).
 * 
 * Complies with zero-client-secret rules: no service-role secrets are bundled or referenced.
 */

import { supabase, isSupabaseConfigured, supabaseConfig } from './supabaseClient.js';

const DEMO_USER_STORAGE_KEY = 'ayuswar_session_profile';

export const authService = {
  isConfigured() {
    return isSupabaseConfigured;
  },

  getProviderInfo() {
    return {
      configured: isSupabaseConfigured,
      provider: isSupabaseConfigured ? 'Supabase Auth (OTP)' : 'Prototype Demo Auth (Local)',
      authMode: isSupabaseConfigured ? 'PRODUCTION_OTP' : 'DEMO_PROTOTYPE'
    };
  },

  /**
   * Request OTP for email or phone
   */
  async requestOtp({ destination, type = 'phone' }) {
    if (!destination) {
      throw new Error('Destination (mobile number or email) is required.');
    }

    if (isSupabaseConfigured) {
      const payload = type === 'email' ? { email: destination } : { phone: destination };
      const { data, error } = await supabase.auth.signInWithOtp(payload);
      if (error) throw error;
      return { success: true, data, isDemo: false };
    }

    // Honest Demo Fallback
    return {
      success: true,
      message: 'Demo 6-digit OTP dispatched (Enter 123456 or any 6 digits).',
      isDemo: true,
      demoCode: '123456'
    };
  },

  /**
   * Verify 6-digit OTP
   */
  async verifyOtp({ destination, token, type = 'phone', role = 'doctor', fullName = 'Demo User' }) {
    if (!destination || !token) {
      throw new Error('Destination and OTP token are required.');
    }

    if (isSupabaseConfigured) {
      const payload = type === 'email' 
        ? { email: destination, token, type: 'email' }
        : { phone: destination, token, type: 'sms' };
      
      const { data, error } = await supabase.auth.verifyOtp(payload);
      if (error) throw error;

      return {
        success: true,
        user: data.user,
        session: data.session,
        isDemo: false
      };
    }

    // Honest Demo Fallback Verification
    const syntheticUser = {
      id: 'demo-user-' + Date.now(),
      fullName: fullName || (role === 'doctor' ? 'Dr. Lakshmi Prasad' : 'Lakshmi Amma'),
      role: role || 'doctor',
      destination,
      type,
      authenticatedAt: new Date().toISOString(),
      isDemo: true
    };

    try {
      sessionStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(syntheticUser));
    } catch {
      // Ignore storage errors in restricted contexts
    }

    return {
      success: true,
      user: syntheticUser,
      isDemo: true
    };
  },

  /**
   * Get Active Session
   */
  async getActiveSession() {
    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.getSession();
      return data?.session || null;
    }

    try {
      const raw = sessionStorage.getItem(DEMO_USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Sign Out
   */
  async signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    try {
      sessionStorage.removeItem(DEMO_USER_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    return { success: true };
  }
};
