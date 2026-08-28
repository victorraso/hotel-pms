import { useQuery } from '@tanstack/react-query';
import { getRooms } from '../api/apiRooms';
import { roomKeys } from './roomKeys';

export function useRooms() {
  return useQuery({
    queryKey: roomKeys.list(),
    queryFn: getRooms,
    staleTime: Infinity,
  });
}
