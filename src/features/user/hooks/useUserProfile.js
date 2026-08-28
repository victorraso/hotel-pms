import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/apiUserProfile';
import { toCamelCase } from '../../../shared/lib/queryUtils';

// !!id stops the query from firing until it has id
// passing id to query key lets it be unique to that id
export function useUserProfile(id) {
  const { isLoading, data: userProfile } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => getUserProfile(id),
    select: toCamelCase,
    enabled: !!id,
  });

  return { isLoading, userProfile };
}
