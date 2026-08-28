import {
  getDateObj,
  getLastDayOfTheMonth,
} from '../../../shared/lib/dateUtils';

export function calculateRoomOccupancyPerMonthPercentage(
  bookings,
  rooms,
  startDate,
  endDate,
) {
  if (!bookings || !rooms) return;

  const monthsOccupancy = {};

  // pre build every month for month-empty cases
  const cursorDate = getDateObj(startDate);
  cursorDate.setDate(1);
  const rangeEndDate = getDateObj(endDate);

  while (cursorDate <= rangeEndDate) {
    const monthKey = `${cursorDate.getFullYear()}-${String(cursorDate.getMonth() + 1).padStart(2, '0')}`;

    monthsOccupancy[monthKey] = {};
    rooms.forEach((room) => {
      monthsOccupancy[monthKey][room.room_number] = 0;
    });

    cursorDate.setMonth(cursorDate.getMonth() + 1);
  }

  rooms.forEach((room) => {
    bookings.forEach((b) => {
      if (b.room_id !== room.id) return;

      const currentDate = getDateObj(b.start_date);
      const bookingEnd = getDateObj(b.end_date);

      while (currentDate < bookingEnd) {
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(
          2,
          '0',
        );
        const monthKey = `${currentYear}-${currentMonth}`;

        if (monthsOccupancy[monthKey]?.[room.room_number] !== undefined) {
          monthsOccupancy[monthKey][room.room_number] += 1;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  });

  // turn room occupancy into monthly percentage
  Object.entries(monthsOccupancy).forEach(([monthKey, roomsInMonth]) => {
    const [year, month] = monthKey.split('-');
    const daysInMonth = getLastDayOfTheMonth(year, month);

    Object.keys(roomsInMonth).forEach((roomNumber) => {
      roomsInMonth[roomNumber] = Math.round(
        (roomsInMonth[roomNumber] * 100) / daysInMonth,
      );
    });
  });

  return monthsOccupancy;
}
