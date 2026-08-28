import Spinner from '../../../shared/ui/Spinner';
import { useUserProfile } from '../hooks/useUserProfile';

export default function UserName({ id }) {
  const { isLoading, userProfile } = useUserProfile(id);

  if (isLoading)
    return (
      <span className="ml-1">
        <Spinner size="7px" />
      </span>
    );
  if (!userProfile) return null;

  return <span>{userProfile.fullName}</span>;
}
