import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a file (Vehicle condition photo, technician resume) to Supabase Storage bucket.
 * Bucket defaults to 'grage' (or custom bucket).
 * If frontend direct upload encounters RLS, it automatically falls back via backend relay or demo URL.
 */
export const uploadFileToSupabase = async (
  file: File,
  bucket = 'grage',
  folder = 'uploads'
): Promise<{ url: string; error?: string }> => {
  if (!supabase) {
    console.warn('[Supabase Storage] Supabase credentials not set. Falling back to local object URL.');
    return { url: URL.createObjectURL(file) };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}.${fileExt}`;

    // 1. Attempt direct Supabase Client Upload
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return { url: data.publicUrl };
    }

    // 2. If RLS policy blocks anon insert, relay through backend upload endpoint
    if (uploadError.message.includes('row-level security') || uploadError.message.includes('policy')) {
      console.warn('[Supabase Storage] Client RLS restricted; relaying through backend admin client...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('folder', folder);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const relayRes = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (relayRes.ok) {
        const relayData = await relayRes.json();
        if (relayData.url) {
          return { url: relayData.url };
        }
      }
    }

    console.error('[Supabase Storage Error]:', uploadError);
    return { url: '', error: uploadError.message };
  } catch (err: any) {
    console.error('[Supabase Upload Exception]:', err);
    return { url: URL.createObjectURL(file), error: err.message };
  }
};
