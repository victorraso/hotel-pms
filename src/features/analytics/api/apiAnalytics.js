import { supabase } from '../../../shared/api/supabase';

export async function getRevenueBookings(startDate, endDate) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .in('status', ['checked_in', 'checked_out'])
    .gte('end_date', startDate)
    .lte('start_date', endDate)
    .order('start_date', { ascending: true });

  if (error)
    throw new Error(`Failed to get bookings for revenue: ${error.message}`);

  return data;
}
