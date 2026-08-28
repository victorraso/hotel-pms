import { useQuery } from '@tanstack/react-query';
import { getDepartmentMessages } from '../api/apiMessageStaff';
import { toCamelCase } from '../../../shared/lib/queryUtils';

export function useDepartmentMsgs(department) {
  return useQuery({
    queryKey: ['messages', department],
    queryFn: () => getDepartmentMessages(department),
    select: toCamelCase,
  });
}
