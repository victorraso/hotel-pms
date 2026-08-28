import { useMemo } from 'react';
import { getLastDayOfTheMonth } from '../../../shared/lib/dateUtils';
import { useBookingsRange } from '../../bookings/hooks/useBookingsRange';
import { useRooms } from '../../rooms/hooks/useRooms';
import { calculateRoomOccupancyPerMonthPercentage } from '../utils/calculateOccupancy';

export function useOccupancy(today, monthsPast, monthsAhead) {
  const [y, m] = today.split('-').map(Number);
  const startDate = new Date(y, m - 1 - monthsPast, 1).toLocaleDateString(
    'sv-SE',
  );
  const endDate = new Date(
    y,
    m - 1 + monthsAhead,
    getLastDayOfTheMonth(y, m + monthsAhead),
  ).toLocaleDateString('sv-SE');

  const {
    data: bookings,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useBookingsRange(startDate, endDate);

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    error: roomsError,
  } = useRooms();

  const occupancyData = useMemo(() => {
    if (!bookings || !rooms) return null;
    return calculateRoomOccupancyPerMonthPercentage(
      bookings,
      rooms,
      startDate,
      endDate,
    );
  }, [bookings, rooms, startDate, endDate]);

  return {
    data: occupancyData || {},
    isLoading: isLoadingBookings || isLoadingRooms,
    error: bookingsError || roomsError,
  };
}
