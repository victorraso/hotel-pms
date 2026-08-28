import { useEffect, useState } from 'react';
import { getAvailableRoomsByDate } from '../api/apiBookings';
import { getRoomPrices } from '../../rooms/api/apiRooms';
import { formatPrice } from '../../../shared/lib/numberUtils';
import { dateIsSmaller } from '../../../shared/lib/dateUtils';

const labelCSS = 'font-bold';
const inputCSS = 'focus:ring-0 focus:outline-none italic pl-2 w-fit';
const rowCSS = 'grid grid-cols-[0.3fr_1fr] mb-1';

export default function CreateBooking({ formData, onChange, onValidStep }) {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableRoomPrices, setAvailableRoomPrices] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(formData.room?.id || null);
  const [roomTypeFilter, setRoomTypeFilter] = useState(
    formData.roomTypeFilter || 0,
  );

  useEffect(() => {
    const isStartDateValid = Boolean(formData.startDate?.trim());
    const isEndDateValid = Boolean(formData.endDate?.trim());
    const isRoomValid = Boolean(formData.room);

    const allValid = isStartDateValid && isEndDateValid && isRoomValid;

    onValidStep(allValid);
  }, [formData, onValidStep]);

  useEffect(() => {
    const startDate = formData.startDate?.trim();
    const endDate = formData.endDate?.trim();

    if (!startDate || !endDate) return;

    async function loadAvailableRooms() {
      const rooms = await getAvailableRoomsByDate(startDate, endDate);
      setAvailableRooms(rooms);
    }

    async function loadAvailableRoomPrices() {
      const [y, m, d] = endDate.split('-').map(Number);
      const nightEndDate = new Date(y, m - 1, d - 1).toLocaleDateString(
        'sv-SE',
      );

      const prices = await getRoomPrices(startDate, nightEndDate);

      const periodRoomTypePrice = prices.reduce((acc, item) => {
        const roomType = item.room_type_id;

        if (!acc[roomType]) {
          acc[roomType] = 0;
        }

        acc[roomType] += item.price_cents;

        return acc;
      }, {});

      setAvailableRoomPrices(periodRoomTypePrice);
    }

    loadAvailableRooms();
    loadAvailableRoomPrices();
  }, [formData.startDate, formData.endDate]);

  const filteredRooms = availableRooms.filter((r) => {
    if (roomTypeFilter === 0) return true;
    return r.room_type_id === Number(roomTypeFilter);
  });

  useEffect(() => {
    if (formData.room && formData.room.room_type_id) {
      const typeId = formData?.room?.room_type_id;
      const newPrice = availableRoomPrices[typeId];

      if (newPrice) {
        onChange({
          target: {
            name: 'accomodationCost',
            value: newPrice,
          },
        });
        onChange({
          target: {
            name: 'taxCost',
            value: newPrice * 0.02,
          },
        });
      }
    }
  }, [availableRoomPrices]);

  // if opened via the cell click of the scheduler
  useEffect(() => {
    if (formData.cellRoomId && availableRooms.length > 0) {
      async function addCellRoomToForm() {
        const cellRoom = await availableRooms.find(
          (r) => r.id === formData.cellRoomId,
        );
        onChange({
          target: {
            name: 'room',
            value: cellRoom,
          },
        });
        onChange({
          target: {
            name: 'accomodationCost',
            value: availableRoomPrices[cellRoom.room_type_id],
          },
        });
        onChange({
          target: {
            name: 'taxCost',
            value: availableRoomPrices[cellRoom.room_type_id] * 0.02,
          },
        });
        onChange({
          target: {
            name: 'roomTypeFilter',
            value: cellRoom.room_type_id,
          },
        });
        setSelectedRoom(formData.cellRoomId);
        setRoomTypeFilter(Number(cellRoom.room_type_id));
      }
      addCellRoomToForm();
    }
  }, [formData.cellRoomId, availableRooms]);

  function handleDateChange(e) {
    let yDate = e.target.value;
    let xDate = formData.endDate;

    if (e.target.name === 'endDate') {
      yDate = formData.startDate;
      xDate = e.target.value;
    }

    if (dateIsSmaller(xDate, yDate)) return;

    onChange(e);
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className={rowCSS}>
        <label className={labelCSS}>Start date: </label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleDateChange}
          className={inputCSS}
        />
      </div>
      <div className={rowCSS}>
        <label className={labelCSS}>End date: </label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleDateChange}
          className={inputCSS}
        />
      </div>
      <div className={`mt-3 ${rowCSS}`}>
        <label className={labelCSS}>Room type: </label>
        <select
          name="roomTypeFilter"
          value={formData.roomTypeFilter}
          onChange={(e) => {
            onChange(e);
            setRoomTypeFilter(Number(e.target.value));
          }}
          className={`${inputCSS} bg-bg2`}
        >
          <option value="0">All</option>
          <option value="1">Standard Single</option>
          <option value="2">Standard Double</option>
          <option value="3">Deluxe Double</option>
          <option value="4">Executive Suite</option>
          <option value="5">Presidential Suite</option>
        </select>
      </div>
      <div className="bg-bg border-border3 mt-5 grid grid-cols-[0.6fr_1fr_1fr] rounded-t-md border p-2 pl-3 font-bold">
        <span>Number</span>
        <span>Type</span>
        <span>Total Cost (Incl. Taxes)</span>
      </div>
      <div className="border-border3 bg-bg h-40 overflow-y-scroll rounded-b-md border border-t-0">
        {filteredRooms.map((r) => (
          <div
            key={r.id}
            onClick={() => {
              onChange({
                target: {
                  name: 'room',
                  value: r,
                },
              });
              onChange({
                target: {
                  name: 'accomodationCost',
                  value: availableRoomPrices[r.room_type_id],
                },
              });
              onChange({
                target: {
                  name: 'taxCost',
                  value: availableRoomPrices[r.room_type_id] * 0.02,
                },
              });
              setSelectedRoom(r.id);
            }}
            className={`hover:border-border3 cursor-pointer border border-transparent p-1 pl-3 ${selectedRoom === r.id && 'bg-bg-today'} grid grid-cols-[0.6fr_1fr_1fr]`}
          >
            <span>{r.room_number}</span>
            <span>{r.room_types.name}</span>
            <span>
              {formatPrice(
                availableRoomPrices[r.room_type_id] +
                  availableRoomPrices[r.room_type_id] * 0.02,
              )}
            </span>
          </div>
        ))}
      </div>
    </form>
  );
}
