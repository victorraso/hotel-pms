import { useMutation } from '@tanstack/react-query';
import { createNewGuest } from '../api/apiGuests';
import toast from 'react-hot-toast';

export function useCreateGuest() {
  return useMutation({
    mutationFn: createNewGuest,
    onSuccess: () => {
      toast.success('New guest successfully registered!');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to register new guest');
    },
  });
}
