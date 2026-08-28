import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookingCheckIn } from '../api/apiBookings';
import toast from 'react-hot-toast';
import { bookingKeys } from './bookingKeys';

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => updateBookingCheckIn(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.all,
      });
      toast.success('Check in successful!');
    },
    onError: (err) => {
      console.log(err);
      toast.error('Error while checking in, please try again.');
    },
  });
}
