import { supabase } from '../../../shared/api/supabase';

export async function addStaffMessage(newMsg) {
  const { data, error } = await supabase
    .from('staff_messages')
    .insert(newMsg)
    .select();

  if (error) throw new Error(`Failed to add staff message: ${error.message}`);

  return data;
}

export async function getStaffMessages() {
  const { data, error } = await supabase.from('staff_messages').select('*');

  if (error) throw new Error(`Failed to get staff message: ${error.message}`);

  return data;
}

export async function getDepartmentMessages(department) {
  const { data, error } = await supabase
    .from('staff_messages')
    .select('*')
    .eq('department', department);

  if (error)
    throw new Error(`Failed to get department messages: ${error.message}`);

  return data;
}

export async function updateMessage(msgId, fields) {
  const { data, error } = await supabase
    .from('staff_messages')
    .update(fields)
    .eq('id', msgId)
    .select();

  if (error) throw new Error(`Failed to update message: ${error.message}`);

  return data;
}

export async function deleteMessages(msgIds) {
  const { error } = await supabase
    .from('staff_messages')
    .delete()
    .in('id', msgIds);

  if (error) throw new Error(`Failed to delete messages: ${error.message}`);
}
