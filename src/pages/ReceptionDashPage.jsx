import { useUser } from '../features/authentication/hooks/useUser';
import MessageViewer from '../features/staff/components/MessageViewer';
import NotesWidget from '../features/widgets/components/NotesWidget';

export default function ReceptionDashPage() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col flex-wrap gap-5 px-5 pt-5">
        <MessageViewer userId={user.id} />
        <NotesWidget userId={user.id} />
      </div>
    </div>
  );
}
