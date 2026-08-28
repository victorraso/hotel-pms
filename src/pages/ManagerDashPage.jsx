import TotalOccupancyGraph from '../features/analytics/components/TotalOccupancyGraph';
import RevenueADRGraph from '../features/analytics/components/RevenueADRGraph';
import RoomOccupancyGraph from '../features/analytics/components/RoomOccupancyGraph';

export default function ManagerDashPage() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center p-5">
      <RevenueADRGraph />
      <RoomOccupancyGraph />
      <TotalOccupancyGraph />
    </div>
  );
}
