import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRoom } from '../api/apiRooms';
import { roomKeys } from './roomKeys';
import toast from 'react-hot-toast';

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, fields }) => updateRoom(roomId, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roomKeys.cleaning(),
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error('Could not update room');
    },
  });
}
