import { useBookingsRange } from '../../bookings/hooks/useBookingsRange';
import { useRoomPrices } from '../../rooms/hooks/useRoomPrices';
import { useRooms } from '../../rooms/hooks/useRooms';

export function useSchedulerData(startDate, endDate) {
  const bookings = useBookingsRange(startDate, endDate);
  const rooms = useRooms();
  const prices = useRoomPrices(startDate, endDate);

  return {
    bookingsRange: bookings.data ?? [],
    rooms: rooms.data ?? [],
    prices: prices.data ?? [],
    isLoadingScheduler:
      bookings.isLoading || rooms.isLoading || prices.isLoading,
  };
}
