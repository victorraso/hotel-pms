import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { bookingKeys } from './bookingKeys';
import { getBookingDetails } from '../api/apiBookings';
import { toCamelCase } from '../../../shared/lib/queryUtils';

export function useBookingDetails(booking) {
  const { isFetching: isFetchingDetails, data: bookingDetails } = useQuery({
    queryKey: bookingKeys.details(booking?.id),
    queryFn: () => getBookingDetails(booking.id),
    select: toCamelCase,
    enabled: !!booking?.id, // when false queryFn will not execute
    initialData: booking,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  return {
    isFetchingDetails,
    bookingDetails: bookingDetails ?? {},
  };
}
