import { useMemo, useState } from 'react';
import { SchedulerContext } from './SchedulerContext';

export function SchedulerProvider({ children }) {
  const [bookingsStartDate, setBookingsStartDate] = useState('');
  const [bookingsEndDate, setBookingsEndDate] = useState('');
  const [trailingDays, setTrailingDays] = useState(5);
  const [filterRooms, setFilterRooms] = useState('all');
  const [rowHeight, setRowHeight] = useState(40);

  const value = useMemo(
    () => ({
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
    }),
    [bookingsStartDate, bookingsEndDate, trailingDays, filterRooms, rowHeight],
  );

  return (
    <SchedulerContext.Provider value={value}>
      {children}
    </SchedulerContext.Provider>
  );
}
