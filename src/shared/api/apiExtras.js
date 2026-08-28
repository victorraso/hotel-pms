import { supabase } from './supabase';

export async function getExtras() {
  const { data, error } = await supabase.from('extras').select('*');

  if (error) throw new Error(`Failed to get extras: ${error.message}`);

  return data;
}
