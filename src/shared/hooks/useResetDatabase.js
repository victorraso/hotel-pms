import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../api/supabase';

export function useResetDatabase() {
  const [isPending, startTransition] = useTransition();

  function handleResetAndSeed() {
    startTransition(async () => {
      const { error } = await supabase.rpc('reset_and_seed_database');

      if (error) {
        console.error('Reset database error:', error);
        toast.error('Failed to reset database');
      } else {
        toast.success('Database reset');
      }
    });
  }

  return {
    isPending,
    handleResetAndSeed,
  };
}
