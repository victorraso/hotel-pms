import { useQuery } from '@tanstack/react-query';
import { getStaffMessages } from '../api/apiMessageStaff';
import { toCamelCase } from '../../../shared/lib/queryUtils';

export function useGetStaffMsgs() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: getStaffMessages,
    select: toCamelCase,
  });
}
