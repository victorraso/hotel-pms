import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMessages } from '../api/apiMessageStaff';
import toast from 'react-hot-toast';

export function useDeleteMsgs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (msgIds) => deleteMessages(msgIds),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
      toast.success('Messages deleted!');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to delete messages.');
    },
  });
}
