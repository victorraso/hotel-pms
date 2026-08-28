import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useOccupancy } from '../hooks/useOccupancy';
import { DEMO_TODAY } from '../../../shared/config/today';
import { useMemo, useState } from 'react';
import { formatMonthYear } from '../../../shared/lib/dateUtils';

const today = DEMO_TODAY;

export default function RoomOccupancyGraph() {
  const [y, m] = today.split('-').map(Number);
  const dateTwoStarter = new Date(y, m - 2, 1).toLocaleDateString('sv-SE');

  const [dateOne, setDateOne] = useState(today);
  const [dateTwo, setDateTwo] = useState(dateTwoStarter);

  const { data: dataA } = useOccupancy(dateOne, 0, 0);
  const { data: dataB } = useOccupancy(dateTwo, 0, 0);

  const graphData = useMemo(() => {
    if (!dataA || !dataB) return [];
    if (Object.keys(dataA).length === 0 || Object.keys(dataB).length === 0)
      return [];

    const A = dataA[dateOne.slice(0, 7)];
    const B = dataB[dateTwo.slice(0, 7)];

    if (!A || !B) return [];

    return Object.entries(A).reduce((acc, [roomNumber, occupancy]) => {
      acc.push({
        room: roomNumber,
        A: occupancy,
        B: B[roomNumber] ?? 0,
      });

      return acc;
    }, []);
  }, [dateOne, dateTwo, dataA, dataB]);

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h4 className="mb-2 text-lg font-bold">Occupancy Per Room</h4>
      <div className="bg-bg2 border-border3 h-90 w-170 rounded-md border pt-5 pr-10 pb-10">
        <div className="flex flex-row gap-7 px-5 pb-5">
          <label>Compare dates: </label>
          <input
            type="date"
            className="ml-2"
            value={dateOne}
            onChange={(e) => setDateOne(e.target.value)}
          />
          <input
            type="date"
            className="ml-2"

            value={dateTwo}
            onChange={(e) => setDateTwo(e.target.value)}
          />
        </div>
        <BarChart data={graphData} width="100%" height="100%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border2)" />

          <XAxis dataKey="room" stroke="var(--color-txt2)" />

          <YAxis domain={[0, 100]} unit="%" stroke="var(--color-txt2)" />

          <Tooltip
            cursor={false}
            formatter={(value) => `${value}%`}
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
            dataKey="A"
            name={formatMonthYear(dateOne)}
            fill="#419dff"
            minPointSize={2}
          />
          <Bar
            dataKey="B"
            name={formatMonthYear(dateTwo)}
            fill="#c35bff"
            minPointSize={2}
          />
        </BarChart>
      </div>
    </div>
  );
}
