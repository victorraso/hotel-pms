import { supabase } from '../../../shared/api/supabase';

export async function getUserProfile(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Could not get user profile', error.message);
  }

  return data;
}
