import { supabase } from '../../../shared/api/supabase';
import { updateRoom } from '../../rooms/api/apiRooms';

export async function getBookings() {
  let query = supabase.from('bookings').select(
    `
      id,
      start_date,
      end_date,
      payment_status,
      adults,
      children,
      guests (full_name, email, nationality),
      rooms(room_number)
      `,
  );

  const { data: bookings, error } = await query;

  if (error) {
    throw new Error('Bookings api failed', error.message);
  }

  return bookings;
}

export async function getBookingsByRange(startDate, endDate) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(full_name, email, nationality)')
    .gte('start_date', startDate)
    .lte('end_date', endDate);

  if (error) throw new Error(`Failed to get booking range: ${error.message}`);

  return data;
}

export async function getArrivalsByDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      start_date,
      end_date,
      payment_status,
      adults,
      children,
      guests (full_name, email, nationality),
      rooms(room_number)
      `,
    )
    .eq('start_date', date)
    .eq('status', 'confirmed');

  if (error) throw new Error(`Failed to get arrivals: ${error.message}`);

  return data;
}

export async function getDeparturesByDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      start_date,
      end_date,
      status,
      payment_status,
      adults,
      children,
      guests (full_name, email, nationality),
      rooms(id, room_number, floor, status)
      `,
    )
    .eq('end_date', date)
    .eq('status', 'checked_in');

  if (error) throw new Error(`Failed to get departures: ${error.message}`);

  return data;
}

export async function getStaysByDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      start_date,
      end_date,
      payment_status,
      adults,
      children,
      guests (full_name, email, nationality),
      rooms(room_number)
      `,
    )
    .lte('start_date', date)
    .gt('end_date', date)
    .eq('status', 'checked_in');

  if (error) throw new Error(`Failed to get stays: ${error.message}`);

  return data;
}

export async function getAvailableRoomsByDate(start, end) {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('room_id')
    .lt('start_date', end)
    .gt('end_date', start)
    .in('status', ['confirmed', 'checked_in']);

  const bookedRoomIds = bookings.map((b) => b.room_id);

  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('*, room_types(name)')
    .not('id', 'in', `(${bookedRoomIds.join(',')})`);

  if (error) throw new Error(`Failed to get available rooms: ${error.message}`);

  return rooms;
}

export async function getBookingDetails(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      guests (full_name, email, nationality, date_of_birth, national_id),
      rooms(room_number, floor, status, room_types(name, max_capacity)),
      extra_purchases(*),
      payments(*)
      `,
    )
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to get booking details: ${error.message}`);

  return data;
}

export async function updateBooking(bookingId, fields) {
  const { data, error } = await supabase
    .from('bookings')
    .update(fields)
    .eq('id', bookingId)
    .select()
    .single();

  if (error)
    throw new Error(
      `Failed to update booking: ${error.message}, {cause: error}`,
    );

  return data;
}

export async function updateBookingPaymentStatus(bookingId, paymentStatus) {
  return updateBooking(bookingId, { payment_status: paymentStatus });
}

export async function updateBookingCheckIn(bookingId) {
  return updateBooking(bookingId, {
    status: 'checked_in',
  });
}

export async function updateBookingCheckOut(bookingId, roomId) {
  const booking = await updateBooking(bookingId, {
    status: 'checked_out',
  });
  await updateRoom(roomId, { status: 'out_of_order' });
  return booking;
}

export async function createNewBooking(newBooking) {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...newBooking,
      reservation_number: generateReservationNumber(),
    })
    .select();

  if (error) throw new Error(`Failed to create new booking ${error.message}`);

  return data;
}

function generateReservationNumber() {
  const cryptoCode = crypto.randomUUID().split('-')[0].toUpperCase();
  return `RES-DESK${cryptoCode}`;
}
