import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

function getSupabaseCredentials(): SupabaseCredentials {
  const url = process.env.COZE_SUPABASE_URL;
  const anonKey = process.env.COZE_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('COZE_SUPABASE_URL is not set');
  }
  if (!anonKey) {
    throw new Error('COZE_SUPABASE_ANON_KEY is not set');
  }

  return { url, anonKey };
}

function getSupabaseClient(token?: string): SupabaseClient {
  // 如果已有客户端且无需 token，直接返回缓存的客户端
  if (!token && supabaseClient) {
    return supabaseClient;
  }

  const { url, anonKey } = getSupabaseCredentials();

  const options = {
    db: {
      timeout: 60000,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  };

  if (token) {
    return createClient(url, anonKey, {
      ...options,
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
  }

  // 缓存无 token 的客户端
  supabaseClient = createClient(url, anonKey, options);
  return supabaseClient;
}

export { getSupabaseCredentials, getSupabaseClient };
