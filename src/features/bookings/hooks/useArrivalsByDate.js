import { useQuery } from '@tanstack/react-query';
import { bookingKeys } from './bookingKeys';
import { getArrivalsByDate } from '../api/apiBookings';
import { toCamelCase } from '../../../shared/lib/queryUtils';
import { DEMO_TODAY } from '../../../shared/config/today';

const today = DEMO_TODAY;

export function useArrivalsByDate(date) {
  const { isLoading, data: arrivals } = useQuery({
    queryKey: bookingKeys.arrivals(date),
    queryFn: () => getArrivalsByDate(date),
    select: (data) => data.map(toCamelCase),
  });

  return { isLoading, arrivals };
}

export function useTodayCheckIns() {
  // const todayReal = getRealTodayDate();
  return useArrivalsByDate(today);
}
