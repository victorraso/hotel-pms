import { supabase } from '../../../shared/api/supabase';

export async function createNewGuest(newGuest) {
  const { data, error } = await supabase
    .from('guests')
    .insert({ ...newGuest })
    .select();

  if (error) throw new Error(`Failed to create a new guest ${error.message}`);

  return data;
}
