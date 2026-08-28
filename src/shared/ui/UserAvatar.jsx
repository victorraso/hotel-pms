import { useState } from 'react';

import { useUserSession } from '../../app/providers/user-provider/useUserSession';
import Spinner from './Spinner';

const defaultAvatarImg =
  'https://ntyftsjiytqpfaarbjob.supabase.co/storage/v1/object/public/avatars/default-user.jpg';

function Avatar({ src, alt, className }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
      {!imgLoaded && <Spinner size={'5px'} />}
      <img
        className={className}
        src={src}
        alt={alt}
        hidden={!imgLoaded}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
      />
    </>
  );
}

export default function UserAvatar() {
  const { userProfile, isAuthenticated, isLoading } = useUserSession();

  const imgSrc = userProfile?.avatarUrl || defaultAvatarImg;

  if (!isAuthenticated || isLoading) return null;

  return (
    <div className="text-txt mr-2 flex flex-row items-center justify-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center">
        <Avatar
          key={imgSrc}
          src={imgSrc}
          alt="user image"
          className="shadow-txt3 rounded-b-full shadow-xs"
        />
      </div>
      <span className="text-md">{userProfile?.fullName}</span>
    </div>
  );
}
