import { useState } from 'react';

import { useUser } from '../../authentication/hooks/useUser';

import useFlags from '../../../shared/hooks/useFlags';

import Skeleton from '../../../shared/ui/Skeleton';
import Table from '../../../shared/ui/Table';
import BookingDetails from './BookingDetails';
import DetailsRow from './DetailsRow';
import Modal from '../../../shared/ui/Modal';

export default function DetailsList({
  guestFlow,
  flowKind,
  isLoading,
  colWidths,
  tableHeader,
}) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const flagsMap = useFlags(guestFlow);
  const colGrid = colWidths.join(' ');

  const { user } = useUser();

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {isLoading ? (
          <Skeleton />
        ) : (
          <Table
            colGrid={colGrid}
            header={tableHeader}
            bodyData={guestFlow}
            bodyRender={(booking) => (
              <DetailsRow
                key={booking.id}
                booking={booking}
                flagSVG={flagsMap?.[booking.guests?.nationality]}
                setSelectedBooking={setSelectedBooking}
                flowKind={flowKind}
              />
            )}
          />
        )}
      </div>
      {selectedBooking && (
        <Modal onClose={() => setSelectedBooking(null)}>
          <BookingDetails
            bookingData={selectedBooking}
            userId={user?.id}
            setSelectedBooking={setSelectedBooking}
          />
        </Modal>
      )}
    </>
  );
}
