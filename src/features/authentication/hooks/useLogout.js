import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { logoutApi } from '../api/apiAuth';

export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => logoutApi(queryClient.getQueryData(['user'])?.id),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['user'], exact: true });
      navigate('/login', { replace: true });
    },
  });
  return { logout, isPending };
}
