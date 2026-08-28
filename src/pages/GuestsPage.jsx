import DetailsList from '../features/bookings/components/DetailsList';
import { useTodayStays } from '../features/bookings/hooks/useStaysByDate';

export default function GuestsPage() {
  const { isLoading, stays } = useTodayStays();
  const colWidths = ['0.8fr', '2.4fr', '2fr', '1.4fr', '0.5fr'];

  const tableHeader = (
    <>
      <div>Room</div>
      <div>Guest</div>
      <div>Dates</div>
      <div>Party</div>
      <div></div>
    </>
  );

  return (
    <div className="flex flex-col gap-3 px-4 py-5">
      <DetailsList
        guestFlow={stays}
        flowKind={'staying'}
        isLoading={isLoading}
        colWidths={colWidths}
        tableHeader={tableHeader}
      />
    </div>
  );
}
