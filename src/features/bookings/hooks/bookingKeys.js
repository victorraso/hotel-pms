export const bookingKeys = {
  all: ['bookings'],
  arrivals: (date) => [...bookingKeys.all, 'arrivals', date],
  departures: (date) => [...bookingKeys.all, 'departures', date],
  stays: (date) => [...bookingKeys.all, 'stays', date],
  details: (id) => [...bookingKeys.all, 'details', id],
  byRange: (start, end) => [...bookingKeys.all, 'byRange', start, end],
};

// e.g. arrivals('2026-07-24') → ['bookings', 'arrivals', '2026-07-24']
