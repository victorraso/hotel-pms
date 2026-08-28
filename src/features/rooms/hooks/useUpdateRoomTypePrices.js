import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrInsertRoomTypePrices } from '../api/apiRooms';
import { roomKeys } from './roomKeys';
import toast from 'react-hot-toast';

export function useUpdateRoomTypePrices(startDate, endDate, roomTypeId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items) => updateOrInsertRoomTypePrices(items),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roomKeys.pricesType(startDate, endDate, roomTypeId),
      });
      toast.success('Updated prices successfully!');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to update prices.');
    },
  });
}
