import { useQuery } from '@tanstack/react-query';
import { roomKeys } from './roomKeys';
import { getRoomPrices } from '../api/apiRooms';

export function useRoomPrices(startDate, endDate) {
  return useQuery({
    queryKey: roomKeys.prices(startDate, endDate),
    queryFn: () => getRoomPrices(startDate, endDate),
    enabled: Boolean(startDate) && Boolean(endDate), // prevent api to be called with empty dates
  });
}
