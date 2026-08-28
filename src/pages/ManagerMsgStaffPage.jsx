import MessageHistory from '../features/staff/components/MessageHistory';
import MessageStaff from '../features/staff/components/MessageStaff';

export default function ManagerMsgStaffPage() {
  return (
    <div className="flex flex-row flex-wrap items-start justify-center gap-10 p-5">
      <MessageStaff />
      <MessageHistory />
    </div>
  );
}
