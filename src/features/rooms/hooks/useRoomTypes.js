import { useQuery } from '@tanstack/react-query';
import { roomKeys } from './roomKeys';
import { getRoomTypes } from '../api/apiRooms';

export function useRoomTypes() {
  return useQuery({
    queryKey: roomKeys.types(),
    queryFn: getRoomTypes,
  });
}
