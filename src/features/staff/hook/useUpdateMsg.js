import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMessage } from '../api/apiMessageStaff';
import toast from 'react-hot-toast';

export function useUpdateMsg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fields }) => updateMessage(id, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages'],
      });
      toast.success('Message confirmed!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error while setting message as done.');
    },
  });
}
