import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useMemo, useState } from 'react';

import { DEMO_TODAY } from '../../../shared/config/today';
import { useRevenue } from '../hooks/useRevenue';
import {
  getDateObj,
  getLastDayOfTheMonth,
  getNumberOfNights,
} from '../../../shared/lib/dateUtils';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const today = DEMO_TODAY;

export default function RevenueADRGraph() {
  const thisYear = Number(today.slice(0, 4));
  const [graphYear, setGraphYear] = useState(thisYear);

  const yearOptions = useMemo(() => {
    let options = [];
    for (let x = thisYear - 3; x <= thisYear; x++) {
      options.push(x);
    }
    return options;
  }, [thisYear]);

  const { data: revenueBookings } = useRevenue(
    `${graphYear}-01-01`,
    `${graphYear}-12-${getLastDayOfTheMonth(graphYear, 12)}`,
  );

  const revenueNights = useMemo(() => {
    if (!revenueBookings) return [];
    return revenueBookings.reduce((acc, booking) => {
      let currDate = getDateObj(booking.startDate);
      const endDate = getDateObj(booking.endDate);
      const nights = getNumberOfNights(booking.startDate, booking.endDate);
      const pricePerNight = booking.accommodationTotalCents / nights;

      while (currDate < endDate) {
        acc.push({
          bookingId: booking.id,
          date: currDate.toLocaleDateString('sv-SE'),
          perNightCents: pricePerNight,
          totalAmount: booking.accommodationTotalCents,
          nights: nights,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
        });
        currDate.setDate(currDate.getDate() + 1);
      }
      return acc;
    }, []);
  }, [revenueBookings]);

  const graphData = useMemo(() => {
    if (!revenueNights) return [];
    const data = months.map((month) => ({
      month: month,
      revenue: 0,
      adr: 0,
      nights: 0,
    }));

    revenueNights.forEach((item) => {
      const monthIndex = Number(item.date.slice(5, 7)) - 1;
      data[monthIndex].revenue += item.perNightCents;
      data[monthIndex].nights += 1;
    });

    data.forEach((obj) => {
      obj.revenue = Math.round(obj.revenue) / 100;
      obj.adr =
        obj.nights > 0 ? Math.round((obj.revenue * 100) / obj.nights) / 100 : 0;
    });

    return data;
  }, [revenueNights]);

  return (
    <div className="mx-10 flex h-130 w-full flex-col items-center justify-center p-5">
      <h4 className="mb-2 text-lg font-bold">Revenue & Average Daily Rate</h4>
      <div className="bg-bg2 border-border3 h-full w-full rounded-md border p-5 pb-15">
        <div className="flex flex-row gap-2 px-5 pb-5">
          <label>Year: </label>
          <select
            value={graphYear}
            onChange={(e) => setGraphYear(e.target.value)}
            className="border-border2 rounded-md border px-2"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <ResponsiveContainer>
          <ComposedChart data={graphData} margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{
                value: 'Revenue ($)',
                angle: -90,
                position: 'insideLeft',
                offset: -10,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'ADR ($)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              formatter={(value, name) =>
                name === 'revenue'
                  ? [`$${value.toLocaleString()}`, 'Revenue']
                  : [`$${value}`, 'ADR']
              }
              contentStyle={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border3)',
                color: 'var(--color-txt)',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="#419dff"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="adr"
              stroke="#c35bff"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="ADR"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
