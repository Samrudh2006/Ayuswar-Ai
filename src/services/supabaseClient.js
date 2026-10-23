/**
 * AyuSwar AI — Supabase Client Wrapper
 * 
 * Safely accesses client-side Supabase configuration.
 * - Uses only publishable anonymous key (VITE_SUPABASE_ANON_KEY).
 * - NEVER accesses or exposes server service role keys in frontend code.
 * - Gracefully reports unconfigured state when keys are unset, enabling demo prototype fallback.
 */

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseAnonKey.includes('placeholder')
);

export const supabaseConfig = {
  isConfigured: isSupabaseConfigured,
  url: isSupabaseConfigured ? supabaseUrl : null,
  provider: isSupabaseConfigured ? 'SUPABASE_POSTGRES' : 'LOCAL_DEMO_STORAGE'
};

/**
 * Lightweight mock/proxy for environments without active Supabase credentials
 */
class SafeSupabaseProxy {
  constructor() {
    this.auth = {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      async signInWithOtp({ email, phone }) {
        if (!isSupabaseConfigured) {
          return {
            data: { messageId: 'demo-otp-sent' },
            error: null,
            isDemoFallback: true
          };
        }
        return { data: null, error: new Error('Supabase client uninitialized') };
      },
      async verifyOtp({ email, phone, token, type }) {
        if (!isSupabaseConfigured) {
          return {
            data: {
              user: {
                id: 'demo-user-' + Date.now(),
                email: email || 'demo-user@ayuswar.ai',
                phone: phone || '+91-9876543210'
              },
              session: { access_token: 'demo-token-' + Date.now() }
            },
            error: null,
            isDemoFallback: true
          };
        }
        return { data: null, error: new Error('Supabase client uninitialized') };
      },
      async signOut() {
        return { error: null };
      }
    };
  }

  from(tableName) {
    return {
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: (data) => Promise.resolve({ data, error: null }),
      update: (data) => ({
        eq: () => Promise.resolve({ data, error: null })
      })
    };
  }
}

export const supabase = new SafeSupabaseProxy();
