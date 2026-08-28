import { useContext } from 'react';
import { UserContext } from './UserContext';

export function useUserSession() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error('useUserSession must be used within a UserProvider');

  return context;
}
