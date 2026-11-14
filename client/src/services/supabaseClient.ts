import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a file (Resume, vehicle photo, inspection doc) to Supabase Storage bucket.
 * Falls back cleanly to demo URL if Supabase credentials are not configured yet.
 */
export const uploadFileToSupabase = async (
  file: File,
  bucket = 'autoforge-storage',
  folder = 'uploads'
): Promise<{ url: string; error?: string }> => {
  if (!supabase) {
    console.warn('[Supabase Storage] Supabase credentials not configured in .env. Using mock file URL.');
    // Demo object URL fallback for offline testing
    return {
      url: URL.createObjectURL(file),
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('[Supabase Storage Error]:', uploadError);
      return { url: '', error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl };
  } catch (err: any) {
    console.error('[Supabase Upload Exception]:', err);
    return { url: '', error: err.message || 'File upload failed' };
  }
};
