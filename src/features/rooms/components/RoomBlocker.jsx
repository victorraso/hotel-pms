import { useRef, useState } from 'react';
import Button from '../../../shared/ui/Button';
import {
  dateIsSmaller,
  toISOStringMidnight,
} from '../../../shared/lib/dateUtils';
import { useRooms } from '../hooks/useRooms';
import { useGetRoomBlocks } from '../hooks/useGetRoomBlocks';
import Spinner from '../../../shared/ui/Spinner';
import { useBlockRoom } from '../hooks/useBlockRoom';
import { useRemoveBlockage } from '../hooks/useRemoveBlockage';

const BLOCK_COLORS = [
  'bg-cyan-100',
  'bg-cyan-200',
  'bg-cyan-300',
  'bg-cyan-400',
  'bg-cyan-500',
  'bg-cyan-600',
  'bg-cyan-700',
  'bg-amber-100',
  'bg-amber-200',
  'bg-amber-300',
  'bg-amber-400',
  'bg-amber-500',
  'bg-amber-600',
  'bg-amber-700',
  'bg-rose-100',
  'bg-rose-200',
  'bg-rose-300',
  'bg-rose-400',
  'bg-rose-500',
  'bg-rose-600',
  'bg-rose-700',
];

const colGrid = `minmax(0, 0.3fr) minmax(0, 1fr) minmax(0, 0.4fr) minmax(0, 0.3fr)`;

export default function RoomBlocker() {
  const formRef = useRef();
  const [isValid, setIsValid] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const rooms = useRooms();
  const { data: blocks, isLoading: isLoadingBlocks } = useGetRoomBlocks();
  const { mutate: blockRoom, isPending: isPendingRoomBlock } = useBlockRoom();
  const { mutate: unBlockRoom, isPending: isPendingUnblockRoom } =
    useRemoveBlockage();

  const sortedBlocks = blocks?.sort(
    (a, b) =>
      new Date(toISOStringMidnight(a.startDate)).getTime() -
      new Date(toISOStringMidnight(b.startDate)).getTime(),
  );

  function handleData() {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());

    const allFilled =
      Boolean(formValues.startDate.trim()) &&
      Boolean(formValues.endDate.trim()) &&
      Boolean(formValues.roomId.trim()) &&
      Boolean(formValues.reason.trim());

    setIsValid(allFilled);
  }

  function handleSubmit() {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());

    blockRoom(
      {
        room_id: formValues.roomId,
        start_date: formValues.startDate,
        end_date: formValues.endDate,
        blocked: true,
        reason: formValues.reason,
      },
      {
        onSuccess: () => {
          formRef.current.reset();
          setStartDate('');
          setEndDate('');
          setIsValid(false);
        },
      },
    );
  }

  function handleRemoveBlock(blockId) {
    unBlockRoom(blockId);
  }

  return (
    <>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <h4 className="text-lg font-bold">Room Blocker</h4>
        <div className="border-border2 bg-bg2 flex flex-col gap-1 rounded-md border p-5">
          <div className="grid grid-cols-2">
            <label>Start date: </label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={(e) => {
                if (endDate && dateIsSmaller(endDate, e.target.value)) {
                  return;
                } else {
                  setStartDate(e.target.value);
                  handleData();
                }
              }}
            />
          </div>
          <div className="grid grid-cols-2">
            <label>End date: </label>
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={(e) => {
                if (startDate && dateIsSmaller(e.target.value, startDate)) {
                  return;
                } else {
                  setEndDate(e.target.value);
                  handleData();
                }
              }}
            />
          </div>
          <select name="roomId" onChange={handleData} className="bg-bg2 mt-3">
            <option hidden value="">
              Room Number
            </option>
            {rooms?.data?.map((r) => (
              <option key={r.id} value={r.id}>
                Room {r.room_number}
              </option>
            ))}
          </select>
          <div className="mt-5 flex flex-col gap-1">
            <label>Reason</label>
            <textarea
              name="reason"
              onChange={handleData}
              className="border-border2 h-15 w-full resize-none border p-2 text-xs focus:ring-0 focus:outline-none"
              spellCheck={false}
            ></textarea>
          </div>
          {isValid && (
            <div className="mt-5">
              <Button
                color="green"
                disabled={isPendingRoomBlock}
                onClick={handleSubmit}
              >
                Create
              </Button>
            </div>
          )}
        </div>
      </form>
      {isLoadingBlocks ? (
        <span className="mt-10">
          <Spinner size="20px" />
        </span>
      ) : (
        <div className="flex min-w-120 flex-col items-start">
          {sortedBlocks?.map((b, index) => {
            const room = rooms?.data?.find((r) => r.id === b.roomId);
            const color = BLOCK_COLORS[index % BLOCK_COLORS.length];
            return (
              <div
                key={b.id}
                style={{ '--col-grid': colGrid }}
                className={`border-border2 mt-3 grid w-140 grid-cols-(--col-grid) gap-5 rounded-xl border px-10 py-1 text-gray-900 ${color}`}
              >
                <span>
                  <div>Room</div>
                  <div>{room?.room_number}</div>
                </span>
                <span className="overflow-hidden text-nowrap text-ellipsis">
                  {b.reason}
                </span>
                <span>
                  <div>{b.startDate}</div>
                  <div>{b.endDate}</div>
                </span>
                <button
                  onClick={() => handleRemoveBlock(b.id)}
                  disabled={isPendingUnblockRoom}
                  className="group bg-bg text-txt border-border3 relative ml-5 flex w-5 cursor-pointer items-center justify-center overflow-hidden rounded-sm border px-2 text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-in-out hover:w-15"
                >
                  <span className="absolute opacity-100 group-hover:opacity-0">
                    {'->'}
                  </span>
                  <span className="absolute opacity-0 transition-opacity duration-900 group-hover:opacity-100">
                    Unblock
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
