import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeRoomBlockage } from '../api/apiRooms';
import { roomKeys } from './roomKeys';
import toast from 'react-hot-toast';

export function useRemoveBlockage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => removeRoomBlockage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.blocks() });
      toast.success('Blockage removed');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to remove room block');
    },
  });
}
