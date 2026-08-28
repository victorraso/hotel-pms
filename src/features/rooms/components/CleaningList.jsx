import { useMemo, useState } from 'react';
import Button from '../../../shared/ui/Button';
import { useRooms } from '../hooks/useRooms';
import { useRoomsToBeCleaned } from '../hooks/useRoomsToBeCleaned';
import { useUpdateRoom } from '../hooks/useUpdateRoom';

export default function CleaningList() {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [isCleaningId, setIsCleaningId] = useState(null);
  const [confirmBoxId, setConfirmBoxId] = useState(null);

  const { data: departures } = useRoomsToBeCleaned();
  const { data: rooms } = useRooms();
  const { mutate: updateRoom } = useUpdateRoom();

  const numberOfFloors = useMemo(() => {
    if (!rooms) return [];
    return [...new Set(rooms?.map((r) => r.floor))].sort((a, b) => a - b);
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    if (!departures) return [];
    return departures?.filter(
      (item) =>
        item.rooms.floor === selectedFloor &&
        !(item.status === 'checked_out' && item.rooms.status === 'available'),
    );
  }, [departures, selectedFloor]);

  function handleStartCleaning(roomId) {
    setIsCleaningId(roomId);
    updateRoom({
      roomId,
      fields: {
        status: 'cleaning',
      },
    });
  }

  function handleCancelCleaning(roomId) {
    setIsCleaningId(null);
    setConfirmBoxId(null);
    updateRoom({
      roomId,
      fields: {
        status: 'out_of_order',
      },
    });
  }

  function handleCheckBox(id) {
    if (confirmBoxId === id) {
      setConfirmBoxId(null);
    } else {
      setConfirmBoxId(id);
    }
  }

  function handleRoomDone(roomId) {
    setIsCleaningId(null);
    setConfirmBoxId(null);
    updateRoom({
      roomId,
      fields: {
        status: 'inspected',
      },
    });
  }

  return (
    <div>
      <div className="p-5">
        <label className="text-lg font-bold">Floor: </label>
        <select
          className="text-lg"
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(Number(e.target.value))}
        >
          {numberOfFloors.map((floor) => (
            <option key={floor} value={floor}>
              {String(floor).padStart(2, 0)}
            </option>
          ))}
        </select>
      </div>
      <div className="outline-border2 min-w-200 rounded-md outline">
        <div>
          <header className="bg-bg3 grid grid-cols-4 rounded-t-md px-5 py-1 text-base font-semibold">
            <span>Room</span>
            <span>Status</span>
            <span>Condition</span>
          </header>
          <ul>
            {filteredRooms.map((item) => (
              <li
                key={item.id}
                className="border-border2 bg-bg2 grid grid-cols-4 items-center border-t px-5 py-2"
              >
                <span>{item.rooms.roomNumber}</span>
                <span>
                  {item.status === 'checked_in' ? (
                    <p className="text-yellow-600">Still occupied</p>
                  ) : (
                    <p className="text-green-600">Disocuppied</p>
                  )}
                </span>
                <span>
                  {item.rooms.status === 'out_of_order' ? (
                    <p className="text-rose-500">Needs cleaning</p>
                  ) : item.rooms.status === 'cleaning' ? (
                    <p className="text-yellow-600">Cleaning</p>
                  ) : item.rooms.status === 'inspected' ? (
                    <p className="text-green-600">Done</p>
                  ) : (
                    <p>-</p>
                  )}
                </span>
                <div className="flex flex-row flex-nowrap items-center gap-5">
                  {item.rooms.id === isCleaningId ? (
                    <div className="flex flex-row items-center gap-7">
                      <div className="flex flex-row flex-nowrap items-center gap-3">
                        <div className="flex flex-row flex-nowrap items-center gap-1">
                          <input
                            type="checkbox"
                            checked={confirmBoxId === item.rooms.id}
                            onChange={() => handleCheckBox(item.rooms.id)}
                          />
                          <label>confirm</label>
                        </div>
                        <Button
                          color="green"
                          disabled={confirmBoxId !== item.rooms.id}
                          onClick={() => handleRoomDone(item.rooms.id)}
                        >
                          Done
                        </Button>
                      </div>
                      <Button
                        color="yellow"
                        onClick={() => handleCancelCleaning(item.rooms.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    item.status === 'checked_out' &&
                    item.rooms.status === 'out_of_order' && (
                      <Button
                        color="blue"
                        onClick={() => handleStartCleaning(item.rooms.id)}
                        disabled={isCleaningId !== null}
                      >
                        Start Cleaning
                      </Button>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
