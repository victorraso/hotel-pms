import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSchedulerData } from './useSchedulerData';
import { useScheduler } from '../../../app/providers/scheduler-provider/useScheduler';
import { useUser } from '../../authentication/hooks/useUser';
import useFlags from '../../../shared/hooks/useFlags';
import { getBookingsByRange } from '../../bookings/api/apiBookings';
import { bookingKeys } from '../../bookings/hooks/bookingKeys';
import { getRoomPrices } from '../../rooms/api/apiRooms';
import { roomKeys } from '../../rooms/hooks/roomKeys';
import { getNumberOfNights } from '../../../shared/lib/dateUtils';

export function useSchedulerPageData(today) {
  const queryClient = useQueryClient();

  const {
    bookingsStartDate,
    setBookingsStartDate,
    bookingsEndDate,
    setBookingsEndDate,
    trailingDays,
    setTrailingDays,
    filterRooms,
    setFilterRooms,
    rowHeight,
    setRowHeight,
  } = useScheduler();

  const { bookingsRange, rooms, prices, isLoadingScheduler } = useSchedulerData(
    bookingsStartDate,
    bookingsEndDate,
  );

  const { user } = useUser();
  const flagsMap = useFlags(bookingsRange);

  const onDatesChange = (dates) => {
    setBookingsStartDate(dates[0]);
    setBookingsEndDate(dates[dates.length - 1]);
  };

  const onPrefetchDates = useCallback(
    (dates) => {
      const start = dates[0];
      const end = dates[dates.length - 1];

      queryClient.prefetchQuery({
        queryKey: bookingKeys.byRange(start, end),
        queryFn: () => getBookingsByRange(start, end),
      });

      queryClient.prefetchQuery({
        queryKey: roomKeys.prices(start, end),
        queryFn: () => getRoomPrices(start, end),
      });
    },
    [queryClient],
  );

  const bookingsRangeForScheduler = useMemo(
    () =>
      bookingsRange?.map((b) => ({
        bookingId: b.id,
        roomId: b.room_id,
        startDate: b.start_date,
        endDate: b.end_date,
        guest: b.guests.full_name,
        status: b.status.split('_').join('-'),
        rawStatus: b.status,
        nationality: b.guests.nationality,
      })),
    [bookingsRange],
  );

  const roomsForScheduler = useMemo(
    () =>
      rooms
        ?.map((r) => ({
          id: r.id,
          name: r.room_number,
          image: r.room_types.default_image_url,
          type: r.room_types.name,
        }))
        .sort((a, b) => Number(a.name) - Number(b.name)),
    [rooms],
  );

  const roomTypeNamesToRoomIds = useMemo(
    () =>
      rooms.reduce((acc, room) => {
        const typeName = room.room_types?.name;

        if (typeName) {
          if (!acc[typeName]) {
            acc[typeName] = [];
          }
          acc[typeName].push(room.id);
        }
        return acc;
      }, {}) ?? {},
    [rooms],
  );

  const roomTypeIdToTypeName = useMemo(
    () =>
      rooms?.reduce((acc, room) => {
        if (room.room_types?.name) {
          acc[room.room_type_id] = room.room_types.name;
        }
        return acc;
      }, {}) ?? {},
    [rooms],
  );

  const pricesPerRoomType = useMemo(
    () =>
      prices?.reduce((acc, item) => {
        const typeName = roomTypeIdToTypeName[item.room_type_id];

        if (!typeName) return acc;

        const date = item.date;
        const price = item.price_cents;

        const targetRoomIds = roomTypeNamesToRoomIds[typeName] || [];

        targetRoomIds.forEach(() => {
          if (!acc[typeName]) {
            acc[typeName] = {};
          }
          acc[typeName][date] = price;
        });

        return acc;
      }, {}) ?? {},
    [prices, roomTypeIdToTypeName, roomTypeNamesToRoomIds],
  );

  /* const roomBlock = [
    {
      roomId: 1,
      startDate: '2026-07-10',
      endDate: '2026-07-20',
    }, */

  const occupancy = useMemo(() => {
    const staying = [];
    const checkIn = [];
    const checkOut = [];

    for (let i = 0; i < bookingsRangeForScheduler.length; i++) {
      const item = bookingsRangeForScheduler[i];

      if (item.endDate < today || item.startDate > today) continue;

      if (
        item.startDate === today &&
        item.status === 'confirmed' &&
        item.status !== 'checked-in'
      ) {
        checkIn.push(item);
      } else if (item.endDate === today && item.status !== 'checked-out') {
        checkOut.push(item);
      } else if (
        item.startDate <= today &&
        item.endDate > today &&
        item.status === 'checked-in'
      ) {
        staying.push(item);
      }
    }

    return { staying, checkIn, checkOut };
  }, [bookingsRangeForScheduler, today]);

  const buildCheckInData = useCallback(
    (booking) => ({
      booking: {
        id: booking.bookingId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.rawStatus,
        guests: {
          fullName: booking.guest,
        },
      },
      flag: flagsMap?.[booking.nationality],
      nights: getNumberOfNights(booking.startDate, booking.endDate),
    }),
    [flagsMap],
  );

  return {
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
  };
}
