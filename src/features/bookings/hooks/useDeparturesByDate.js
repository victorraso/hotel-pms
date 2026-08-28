import { useQuery } from '@tanstack/react-query';
import { getDeparturesByDate } from '../api/apiBookings';
import { toCamelCase } from '../../../shared/lib/queryUtils';
import { bookingKeys } from './bookingKeys';
import { DEMO_TODAY } from '../../../shared/config/today';

const today = DEMO_TODAY;

export function useDeparturesByDate(date) {
  const { isLoading, data: departures } = useQuery({
    queryKey: bookingKeys.departures(date),
    queryFn: () => getDeparturesByDate(date),
    select: (data) => data.map(toCamelCase),
  });

  return { isLoading, departures };
}

export function useTodayCheckOuts() {
  return useDeparturesByDate(today);
}
