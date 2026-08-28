import { supabase } from '../../../shared/api/supabase';

export async function getRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*, room_types(name, default_image_url)')
    .order('room_number', { ascending: true });

  if (error) throw new Error(`Failed getting rooms: ${error.message}`);

  return data;
}

export async function updateRoom(roomId, fields) {
  const { data, error } = await supabase
    .from('rooms')
    .update(fields)
    .eq('id', roomId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update room: ${error.message}`);

  return data;
}

export async function getRoomsToBeCleaned(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      status,
      adults,
      children,
      rooms(id, room_number, floor, status)
      `,
    )
    .eq('end_date', date);

  if (error)
    throw new Error(
      `Failed to get departures for the cleaning team: ${error.message}`,
    );

  return data;
}

export async function getRoomTypes() {
  const { data, error } = await supabase.from('room_types').select('*');

  if (error) throw new Error(`Failed to get room types, ${error.message}`);

  return data;
}

export async function getRoomPrices(startDate, endDate) {
  const { data, error } = await supabase
    .from('room_type_prices')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw new Error(`Failed to get room prices: ${error.message}`);

  return data;
}

export async function getRoomTypePrices(startDate, endDate, roomTypeId) {
  const { data, error } = await supabase
    .from('room_type_prices')
    .select('*')
    .eq('room_type_id', roomTypeId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw new Error(`Failed to get room prices: ${error.message}`);

  return data;
}

export async function updateOrInsertRoomTypePrices(items) {
  const { data, error } = await supabase
    .from('room_type_prices')
    .upsert(items, { onConflict: 'room_type_id,date' })
    .select();

  if (error)
    throw new Error(`Failed to update room type prices: ${error.message}`);

  return data;
}

export async function getBlockedRooms() {
  const { data, error } = await supabase.from('room_blocks').select('*');

  if (error) throw new Error(`Failed to get room blocks: ${error.message}`);

  return data;
}

export async function blockRoom(newBlock) {
  const { data, error } = await supabase
    .from('room_blocks')
    .insert(newBlock)
    .select();

  if (error) {
    const err = new Error(error.message);
    err.code = error.code;
    throw err;
  }

  return data;
}

export async function removeRoomBlockage(blockId) {
  const { error } = await supabase
    .from('room_blocks')
    .delete()
    .eq('id', blockId);

  if (error) throw new Error(`Failed to remove block: ${error.message}`);
}
