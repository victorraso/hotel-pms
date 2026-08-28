import { useQuery } from '@tanstack/react-query';
import { getRoomTypePrices } from '../api/apiRooms';
import { roomKeys } from './roomKeys';

export function useRoomTypePrices(startDate, endDate, roomTypeId) {
  return useQuery({
    queryKey: roomKeys.pricesType(startDate, endDate, roomTypeId),
    queryFn: () => getRoomTypePrices(startDate, endDate, roomTypeId),
    enabled: Boolean(startDate) && Boolean(endDate) && Boolean(roomTypeId),
  });
}
