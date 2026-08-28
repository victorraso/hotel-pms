import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewBooking } from '../api/apiBookings';
import toast from 'react-hot-toast';

export function useCreateNewBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewBooking,
    onSuccess: () => {
      toast.success('New booking created!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to create new booking');
    },
  });
}
