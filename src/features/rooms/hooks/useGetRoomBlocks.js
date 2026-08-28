import { useQuery } from '@tanstack/react-query';
import { toCamelCase } from '../../../shared/lib/queryUtils';
import { getBlockedRooms } from '../api/apiRooms';
import { roomKeys } from './roomKeys';

export function useGetRoomBlocks() {
  return useQuery({
    queryKey: roomKeys.blocks(),
    queryFn: getBlockedRooms,
    select: toCamelCase,
  });
}
