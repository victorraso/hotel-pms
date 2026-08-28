import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DEMO_TODAY } from '../../../shared/config/today';
import { useOccupancy } from '../hooks/useOccupancy';
import { formatMonthYear } from '../../../shared/lib/dateUtils';
import { useState } from 'react';

const today = DEMO_TODAY;

export default function TotalOccupancyGraph() {
  const [monthsPast, setMonthsPast] = useState(4);
  const [monthsAhead, setMonthsAhead] = useState(3);

  const { data: occupancyData } = useOccupancy(today, monthsPast, monthsAhead);

  // turn occupancyData into an array of objects which Recharts understands. month and monthly occupancy percentage.
  const totalOccupancyPerMonthPercentage = Object.entries(occupancyData).reduce(
    (acc, [monthKey, roomsInMonth]) => {
      const values = Object.values(roomsInMonth);
      const total = values.reduce((sum, v) => sum + v, 0);
      acc.push({
        month: formatMonthYear(`${monthKey}-01`),
        occupancy: Math.round(total / values.length),
      });
      return acc;
    },
    [],
  );

  const [y, m] = today.split('-').map(Number);
  const highlightDatePast = new Date(y, m - 2, 1).toLocaleDateString('sv-SE');
  const highlightDateAhead = new Date(y, m, 1).toLocaleDateString('sv-SE');

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h4 className="mb-2 text-lg font-bold">Total Occupancy</h4>
      <div className="bg-bg2 border-border3 h-90 w-170 rounded-md border pt-5 pr-10 pb-15">
        <div className="flex flex-row gap-7 px-5 pb-5">
          <div>
            <label>Months back: </label>
            <input
              type="number"
              min="1"
              className="border-border2 ml-2 w-15 rounded-md border pl-1"
              value={monthsPast}
              onChange={(e) => setMonthsPast(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Months ahead: </label>
            <input
              type="number"
              min="1"
              className="border-border2 ml-2 w-15 rounded-md border pl-1"
              value={monthsAhead}
              onChange={(e) => setMonthsAhead(Number(e.target.value))}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={totalOccupancyPerMonthPercentage}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border2)"
            />
            <XAxis
              dataKey="month"
              stroke="var(--color-txt2)"
              tickMargin={10}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              domain={[0, 100]}
              unit="%"
              stroke="var(--color-txt2)"
              tickMargin={10}
            />
            <ReferenceArea
              x1={formatMonthYear(highlightDatePast)}
              x2={formatMonthYear(highlightDateAhead)}
              fill="#c35bff"
              fillOpacity={0.3}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Occupancy']}
              contentStyle={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border3)',
                color: 'var(--color-txt)',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
            <Line type="monotone" dataKey="occupancy" stroke="#419dff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
