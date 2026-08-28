import DetailsList from '../features/bookings/components/DetailsList';
import { useTodayCheckOuts } from '../features/bookings/hooks/useDeparturesByDate';

export default function CheckOutsPage() {
  const { isLoading, departures } = useTodayCheckOuts();
  const colWidths = ['0.8fr', '2fr', '1fr', '0.5fr'];

  const tableHeader = (
    <>
      <div>Room</div>
      <div>Guest</div>
      <div>Party</div>
      <div></div>
    </>
  );

  return (
    <div className="flex flex-col gap-3 px-4 py-5">
      <DetailsList
        guestFlow={departures}
        flowKind={'checkOuts'}
        isLoading={isLoading}
        colWidths={colWidths}
        tableHeader={tableHeader}
      />
    </div>
  );
}
