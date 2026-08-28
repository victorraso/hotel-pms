import DetailsList from '../features/bookings/components/DetailsList';
import { useTodayCheckIns } from '../features/bookings/hooks/useArrivalsByDate';

export default function CheckInsPage() {
  const { isLoading, arrivals } = useTodayCheckIns();
  const colWidths = ['0.8fr', '2.4fr', '2fr', '1.4fr', '1fr', '0.5fr'];

  const tableHeader = (
    <>
      <div>Room</div>
      <div>Guest</div>
      <div>Dates</div>
      <div>Payment</div>
      <div>Party</div>
      <div></div>
    </>
  );

  return (
    <div className="flex flex-col gap-3 px-4 py-5">
      <DetailsList
        guestFlow={arrivals}
        flowKind={'checkIns'}
        isLoading={isLoading}
        colWidths={colWidths}
        tableHeader={tableHeader}
      />
    </div>
  );
}
