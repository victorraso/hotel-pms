import { useQuery } from '@tanstack/react-query';
import { getRevenueBookings } from '../api/apiAnalytics';
import { toCamelCase } from '../../../shared/lib/queryUtils';

export function useRevenue(startDate, endDate) {
  return useQuery({
    queryKey: ['revenue', startDate, endDate],
    queryFn: () => getRevenueBookings(startDate, endDate),
    select: (data) => data.map(toCamelCase),
  });
}
