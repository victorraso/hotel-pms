import { useQuery } from '@tanstack/react-query';
import { DEMO_TODAY } from '../../../shared/config/today';
import { roomKeys } from './roomKeys';
import { getRoomsToBeCleaned } from '../api/apiRooms';
import { toCamelCase } from '../../../shared/lib/queryUtils';

const today = DEMO_TODAY;

export function useRoomsToBeCleaned() {
  return useQuery({
    queryKey: roomKeys.cleaning(),
    queryFn: () => getRoomsToBeCleaned(today),
    select: toCamelCase,
  });
}
