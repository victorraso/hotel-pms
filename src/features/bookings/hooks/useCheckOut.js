import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookingCheckOut } from '../api/apiBookings';
import { bookingKeys } from './bookingKeys';
import toast from 'react-hot-toast';
import { roomKeys } from '../../rooms/hooks/roomKeys';

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, roomId }) =>
      updateBookingCheckOut(bookingId, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: roomKeys.all,
      });
      toast.success('Check out successful!');
    },
    onError: (err) => {
      console.log(err);
      toast.error('Error while checking out, please try again.');
    },
  });
}
