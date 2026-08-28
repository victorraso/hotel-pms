import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStaffMessage } from '../api/apiMessageStaff';
import toast from 'react-hot-toast';

export function useAddStaffMsg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStaffMessage,

    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
      toast.success('Message successfully created!');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to create staff message.');
    },
  });
}
