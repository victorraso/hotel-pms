import { useQuery } from '@tanstack/react-query';
import { getBookingsByRange } from '../api/apiBookings';
import { bookingKeys } from './bookingKeys';

export function useBookingsRange(startDate, endDate) {
  return useQuery({
    queryKey: bookingKeys.byRange(startDate, endDate),
    queryFn: () => getBookingsByRange(startDate, endDate),
    enabled: Boolean(startDate) && Boolean(endDate), // prevent api to be called with empty dates
  });
}
