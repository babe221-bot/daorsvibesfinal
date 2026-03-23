import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const BUCKET_NAME = 'Pjesme';

/**
 * Uploads a file to the 'Pjesme' bucket.
 * @param file The File object from an input element.
 * @param path The path in the bucket (e.g., 'user_id/filename').
 */
export async function uploadSongFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;
  return data;
}

/**
 * Gets a signed URL for a private file in the 'Pjesme' bucket.
 * @param path The file path in the bucket.
 */
export async function getSongFileUrl(path: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, 60 * 60); // Valid for 1 hour

  if (error) throw error;
  return data.signedUrl;
}
