import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockRoom } from '../api/apiRooms';
import toast from 'react-hot-toast';
import { roomKeys } from './roomKeys';

export function useBlockRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (block) => blockRoom(block),
    onSuccess: () => {
      toast.success('Room blocked!');
      queryClient.invalidateQueries({ queryKey: roomKeys.blocks() });
    },
    onError: (err) => {
      console.error(err);

      if (err.code === 'HTL01') {
        toast.error('This room booked during those dates.');
      } else {
        toast.error('Failed to block room');
      }
    },
  });
}
