import { useQuery } from '@tanstack/react-query';
import { getExtras } from '../api/apiExtras';
import { toCamelCase } from '../lib/queryUtils';

export function useExtras() {
  const { isLoading, data: extras } = useQuery({
    queryKey: ['extras'],
    queryFn: () => getExtras(),
    select: toCamelCase,
  });

  return { isLoading, extras };
}
