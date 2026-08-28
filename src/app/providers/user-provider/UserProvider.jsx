import { useUser } from '../../../features/authentication/hooks/useUser';
import { useUserProfile } from '../../../features/user/hooks/useUserProfile';
import { UserContext } from './UserContext';

// although react query could handle multiple hook calls, when dealing with authorizations its better to centralize it in one call... so as we need use and user profile in many places, we create one provider to centralize the security routing

export default function UserProvider({ children }) {
  const { isLoading: isLoadingAuth, isAuthenticated, user } = useUser();
  const { userProfile, isLoading: isLoadingProfile } = useUserProfile(user?.id);

  const isLoading = isLoadingAuth || (isAuthenticated && isLoadingProfile);

  return (
    <UserContext.Provider
      value={{ user, userProfile, isAuthenticated, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}
