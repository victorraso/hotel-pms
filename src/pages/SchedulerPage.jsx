import { useState } from 'react';
import { useCallback } from 'react';

import { DEMO_TODAY } from '../shared/config/today';
import { HotelScheduler } from 'hotel-scheduler';
import { useSchedulerPageData } from '../features/scheduler/hooks/useSchedulerPageData';

import Modal from '../shared/ui/Modal';
import BookingDetails from '../features/bookings/components/BookingDetails';

import useTheme from '../app/providers/theme-provider/useTheme';
import useCity from '../shared/hooks/useCity';
import NewReservation from '../features/bookings/components/NewReservation';
import { useGetRoomBlocks } from '../features/rooms/hooks/useGetRoomBlocks';
import { getDateObj } from '../shared/lib/dateUtils';

export default function SchedulerPage() {
  const today = DEMO_TODAY;
  const city = useCity();
  const { state: themeState } = useTheme();

  const {
    isLoadingScheduler,
    bookingsRangeForScheduler,
    roomsForScheduler,
    pricesPerRoomType,
    occupancy,
    user,
    trailingDays,
    setTrailingDays,
    filterRooms,
    setFilterRooms,
    rowHeight,
    setRowHeight,
    onDatesChange,
    onPrefetchDates,
    buildCheckInData,
  } = useSchedulerPageData(today);

  const { data: roomBlock } = useGetRoomBlocks();

  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const onBookingClick = useCallback(
    (booking) => setSelectedBooking(buildCheckInData(booking)),
    [buildCheckInData],
  );

  const onCellClick = useCallback(
    (date, roomId) => {
      const cellDate = getDateObj(date);

      const isBlocked = roomBlock.some((room) => {
        const blockStart = getDateObj(room.startDate);
        const blockEnd = getDateObj(room.endDate);

        return (
          room.roomId === roomId &&
          cellDate >= blockStart &&
          cellDate < blockEnd
        );
      });

      if (isBlocked) {
        setSelectedBlock(true);
      } else {
        setSelectedCell([date, roomId]);
      }
    },
    [roomBlock],
  );

  const onImgClick = useCallback((image) => {
    setSelectedImg(image);
  }, []);

  return (
    <>
      <div className="m-5 h-190">
        <HotelScheduler
          rooms={roomsForScheduler}
          bookings={bookingsRangeForScheduler}
          prices={pricesPerRoomType}
          occupancy={occupancy}
          roomBlock={roomBlock}
          isLoading={isLoadingScheduler}
          dayColumnWidth={80}
          roomColumnWidth={220}
          rowHeight={40}
          lookBackDays={60}
          lookAheadDays={90}
          languageFormat={'en-US'}
          currencyFormat={'USD'}
          showWeekday={true}
          showTrailDays={true}
          showTooltip={true}
          showCellPrice={true}
          showScrollCtrls={true}
          showZoomCtrls={true}
          showOccupancy={true}
          showClock={true}
          showRoomType={true}
          showRoomTypeFilter={true}
          hideScrolls={true}
          onDatesChange={onDatesChange}
          onPrefetchDates={onPrefetchDates}
          onBookingClick={onBookingClick}
          onCellClick={onCellClick}
          onImgClick={onImgClick}
          trailingDaysProp={trailingDays}
          onTrailingDaysChange={setTrailingDays}
          filterRoomsProp={filterRooms}
          onFilterRoomsChange={setFilterRooms}
          rowHeightProp={rowHeight}
          onRowHeightChange={setRowHeight}
          darkMode={themeState.theme === 'dark' ? true : false}
          colorfulBookings={false}
          city={city}
          freeze={DEMO_TODAY}
        />
      </div>
      {selectedImg && (
        <Modal onClose={() => setSelectedImg(null)}>
          <div className="m-auto size-[80%]">
            <img src={selectedImg} />
          </div>
        </Modal>
      )}
      {selectedBooking && (
        <Modal onClose={() => setSelectedBooking(null)}>
          <BookingDetails
            bookingData={selectedBooking}
            userId={user?.id}
            setSelectedBooking={setSelectedBooking}
          />
        </Modal>
      )}
      {selectedCell && (
        <Modal onClose={() => setSelectedCell(null)}>
          <NewReservation date={selectedCell[0]} roomId={selectedCell[1]} />
        </Modal>
      )}
      {selectedBlock && (
        <Modal onClose={() => setSelectedBlock(false)}>
          <div className="border-border2 bg-bg2 text-txt flex h-40 w-120 flex-col items-center justify-center gap-5 rounded-md border p-5">
            <span className="text-3xl">🚫️</span>
            <span>This date is blocked and can't be booked.</span>
          </div>
        </Modal>
      )}
    </>
  );
}
