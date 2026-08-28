import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPayment } from '../api/apiCreatePayment';
import { bookingKeys } from './bookingKeys';
import toast from 'react-hot-toast';

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: (paymentId, variables) => {
      toast.success('Payment Successful!');
      queryClient.invalidateQueries({
        queryKey: bookingKeys.details(variables.bookingId),
      });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'arrivals'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Payment failed');
    },
  });
}
