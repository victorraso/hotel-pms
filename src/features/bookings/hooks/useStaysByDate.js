import { useQuery } from '@tanstack/react-query';
import { bookingKeys } from './bookingKeys';
import { getStaysByDate } from '../api/apiBookings';
import { toCamelCase } from '../../../shared/lib/queryUtils';
import { DEMO_TODAY } from '../../../shared/config/today';

const today = DEMO_TODAY;

export function useStaysByDate(date) {
  const { isLoading, data: stays } = useQuery({
    queryKey: bookingKeys.stays(date),
    queryFn: () => getStaysByDate(date),
    select: (data) => data.map(toCamelCase),
  });

  return { isLoading, stays };
}

export function useTodayStays() {
  return useStaysByDate(today);
}
