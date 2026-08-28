import { supabase } from '../../../shared/api/supabase';

export async function loginApi({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error('Login Failed', error.message);
  }

  await signInAttendance(data.user.id);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error('User could not be found', error.message);

  return data?.user;
}

export async function logoutApi(userId) {
  await signOutAttendance(userId);

  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function signInAttendance(userId) {
  const { error } = await supabase
    .from('user_attendance')
    .insert({ user_id: userId, signed_in_at: new Date().toISOString() });

  if (error) throw new Error(`Failed to sign in attendance: ${error.message}`);
}

export async function signOutAttendance(userId) {
  const { error } = await supabase
    .from('user_attendance')
    .update({ signed_out_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('signed_out_at', null);

  if (error) throw new Error(`Failed to sign out attendance: ${error.message}`);
}
