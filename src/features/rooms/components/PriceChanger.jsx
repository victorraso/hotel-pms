import { useMemo, useState } from 'react';
import {
  formatDate,
  getDateObj,
  getLastDayOfTheMonth,
  toISOStringMidnight,
} from '../../../shared/lib/dateUtils';
import { useRoomTypePrices } from '../hooks/useRoomTypePrices';
import { DEMO_TODAY } from '../../../shared/config/today';
import { useRoomTypes } from '../hooks/useRoomTypes';
import { formatPrice } from '../../../shared/lib/numberUtils';
import Button from '../../../shared/ui/Button';
import { useUpdateRoomTypePrices } from '../hooks/useUpdateRoomTypePrices';
import Spinner from '../../../shared/ui/Spinner';

const today = DEMO_TODAY;

const weekdayColCSS = 'w-22';
const fromToCSS =
  'grid grid-cols-[0.2fr_1fr] gap-2 items-center justify-start ml-1 font-normal';
const everyCheckboxCSS = 'mr-1';

const headerWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function PriceChanger() {
  const [filterMonth, setFilterMonth] = useState(
    today.split('-')[1].padStart(1, 1),
  );
  const [filterYear, setFilterYear] = useState(today.split('-')[0]);
  const [filterRoomType, setFilterRoomType] = useState('');

  const firstDayISO = toISOStringMidnight(`${filterYear}-${filterMonth}-01`);
  const lastDayISO = toISOStringMidnight(
    `${filterYear}-${filterMonth}-${getLastDayOfTheMonth(filterYear, filterMonth)}`,
  );

  const [byRangeFromValue, setByRangeFromValue] = useState('');
  const [byRangeToValue, setByRangeToValue] = useState('');
  const [byRangeWeekdaySelection, setByRangeWeekdaySelection] = useState([]);
  const [newPriceValueCents, setNewPriceValueCents] = useState(0);

  // year select options
  const yearOptions = useMemo(() => {
    const thisYear = Number(today.split('-')[0]);
    const years = [];

    for (let x = 0; x < 10; x++) {
      let year = thisYear + x;
      years.push(year);
    }

    return years;
  }, []);

  const { data: roomTypes } = useRoomTypes();

  const { data: prices, isLoading: isLoadingPrices } = useRoomTypePrices(
    firstDayISO,
    lastDayISO,
    filterRoomType || undefined,
  );

  const { mutate: updatePrices, isPending: isPendingPricesUpdate } =
    useUpdateRoomTypePrices(firstDayISO, lastDayISO, filterRoomType);

  const datesThisMonth = useMemo(() => {
    const lastDay = getDateObj(lastDayISO.split('T')[0]).getDate();
    let dates = [];
    for (let x = 1; x <= lastDay; x++) {
      dates.push(`${filterYear}-${filterMonth}-${String(x).padStart(2, '0')}`);
    }
    return dates;
  }, [filterYear, filterMonth, lastDayISO]);

  const daysThisMonth = useMemo(() => {
    return (datesThisMonth || []).map((date) => date.split('-')[2]);
  }, [datesThisMonth]);

  const averagePrice = Math.round(
    prices?.reduce((acc, curr) => {
      acc += curr.price_cents;
      return acc;
    }, 0) / prices?.length,
  );

  function averageColor(price) {
    if (!averagePrice) return 'bg-gray-200';

    if (price <= averagePrice * 0.8) return 'bg-yellow-200';
    if (price <= averagePrice * 0.9) return 'bg-yellow-400';
    if (price <= averagePrice) return 'bg-green-400';
    if (price >= averagePrice * 1.2) return 'bg-rose-400';
    if (price >= averagePrice * 1.5) return 'bg-red-500';
    if (price > averagePrice) return 'bg-blue-400';
  }

  const calendarGrid = useMemo(() => {
    const monthPrices = [];
    for (let x = 0; x < datesThisMonth.length; x++) {
      let date = datesThisMonth[x] || [];
      let item = prices?.find((item) => item.date === date) || {};
      let dayPriceObj = {
        id: item.id || '',
        room_type_id: filterRoomType || '',
        date: datesThisMonth[x] || '',
        price_cents: item.price_cents || '',
      };

      monthPrices.push(dayPriceObj);
    }

    const weeks = [];
    // create a week with 7 empty slots
    let currentWeek = Array(7).fill(null);
    // track last placed weekday to detect wraparound
    let lastWeekdayIndex = -1;

    monthPrices.forEach((item) => {
      const dateObj = getDateObj(item.date);

      // get weekday index, sunday = 6
      let weekdayIndex = dateObj.getDay() - 1;
      if (weekdayIndex === -1) weekdayIndex = 6;

      // if week is fully filled with dates push it to the weeks array and start a new empty one
      // a new week starts when the weekdayindex doesn't increase (Mon = 0, Sun = 6)
      if (weekdayIndex <= lastWeekdayIndex) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }

      currentWeek[weekdayIndex] = {
        ...item,
        dateObj: dateObj,
        weekdayIndex: dateObj.getDay(),
      };
      lastWeekdayIndex = weekdayIndex;
    });

    if (currentWeek.some((day) => day !== null)) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [prices, datesThisMonth, filterRoomType]);

  // by range edit
  function handleByRangeData() {
    const toEditItems = calendarGrid
      .flat()
      .filter((item) => {
        const day = item?.dateObj.getDate() || 0;
        let wdIndex = item?.weekdayIndex - 1;
        if (wdIndex === -1) wdIndex = 6;
        return (
          byRangeWeekdaySelection.includes(wdIndex) &&
          day >= Number(byRangeFromValue) &&
          day <= Number(byRangeToValue)
        );
      })
      .map((obj) => ({
        room_type_id: obj.room_type_id,
        date: obj.date,
        price_cents: newPriceValueCents,
      }));

    updatePrices(toEditItems);
  }

  function handleWeekdayCheckbox(index) {
    if (byRangeWeekdaySelection?.includes(index)) {
      setByRangeWeekdaySelection(
        byRangeWeekdaySelection?.filter((i) => i !== index),
      );
    } else {
      setByRangeWeekdaySelection([...byRangeWeekdaySelection, index]);
    }
  }

  function handleSelectAllWeekdayCheckboxes(e) {
    if (e.target.checked) {
      const allIndexes = headerWeekdays.map((item, index) => index);
      setByRangeWeekdaySelection([...allIndexes]);
    } else {
      setByRangeWeekdaySelection([]);
    }
  }

  const isAllCheckboxesSelected =
    byRangeWeekdaySelection?.length === headerWeekdays.length;

  function handleNewPrice(e) {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    const cents = parseInt(digitsOnly || '0', 10);
    setNewPriceValueCents(cents);
  }

  return (
    <div className="border-border2 bg-bg2 rounded-md border">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="text-md bg-bg3 flex flex-row gap-5 rounded-t-md px-5 py-5 font-semibold"
      >
        <select
          name="month"
          value={filterMonth}
          onChange={(e) => {
            setFilterMonth(e.target.value);
          }}
          className="bg-bg3"
        >
          <option hidden value="">
            Month
          </option>
          {monthOptions?.map((month, index) => (
            <option key={month} value={String(index + 1).padStart(2, '0')}>
              {month}
            </option>
          ))}
        </select>
        <select
          name="year"
          value={filterYear}
          onChange={(e) => {
            setFilterYear(e.target.value);
          }}
          className="bg-bg3"
        >
          <option hidden value="">
            Year
          </option>
          {yearOptions?.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          name="roomTypeId"
          value={filterRoomType}
          onChange={(e) => {
            setFilterRoomType(e.target.value);
          }}
          className="rounded-md p-1"
        >
          <option hidden value="">
            Room Type
          </option>
          {roomTypes?.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
      </form>
      <form
        onSubmit={(e) => e.preventDefault()}
        className={`text-md bg-bg3 flex flex-col gap-2 px-5 font-bold transition-all duration-1000 ease-in-out ${filterRoomType ? 'border-border2 max-h-200 border-y py-3 opacity-100' : 'max-h-0 overflow-hidden border-y-0 py-0 opacity-0'}`}
      >
        <h4 className="font-black italic">Edit prices</h4>
        <div className={fromToCSS}>
          <label>From: </label>
          <select
            name="from"
            className="bg-bg text-txt border-border2 rounded-md border p-1"
            value={byRangeFromValue}
            onChange={(e) => setByRangeFromValue(e.target.value)}
          >
            <option hidden value="">
              -
            </option>
            {daysThisMonth
              ?.filter((d) => !byRangeToValue || d <= byRangeToValue)
              .map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
          </select>
        </div>
        <div className={fromToCSS}>
          <label>To: </label>
          <select
            name="to"
            className="bg-bg text-txt border-border2 rounded-md border p-1"
            value={byRangeToValue}
            onChange={(e) => setByRangeToValue(e.target.value)}
          >
            <option hidden value="">
              -
            </option>
            {daysThisMonth
              ?.filter((d) => !byRangeFromValue || d >= byRangeFromValue)
              .map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
          </select>
        </div>
        <div className={fromToCSS}>
          <label>Every: </label>
          <div className="flex flex-row gap-3">
            {headerWeekdays.map((day, index) => {
              const isChecked = byRangeWeekdaySelection?.includes(index);
              return (
                <span key={day}>
                  <input
                    name={day}
                    type="checkbox"
                    className={everyCheckboxCSS}
                    checked={isChecked}
                    value={isChecked}
                    onChange={() => handleWeekdayCheckbox(index)}
                  />
                  <label>{day}</label>
                </span>
              );
            })}
            <span className="ml-5">
              <input
                type="checkbox"
                className={everyCheckboxCSS}
                checked={isAllCheckboxesSelected}
                onChange={handleSelectAllWeekdayCheckboxes}
              />
              <label>Select All</label>
            </span>
          </div>
        </div>
        <div className={fromToCSS}>
          <label>New price: </label>
          <input
            type="text"
            className="border-border2 bg-bg rounded-md border p-1 focus:ring-0 focus:outline-none"
            value={formatPrice(newPriceValueCents) || 0}
            onChange={handleNewPrice}
          />
        </div>
        {byRangeFromValue &&
        byRangeToValue &&
        byRangeWeekdaySelection?.length > 0 &&
        newPriceValueCents > 0 ? (
          <div className="mt-1 flex flex-row justify-end">
            <Button
              color="green"
              onClick={handleByRangeData}
              disabled={isPendingPricesUpdate}
            >
              Edit
            </Button>
          </div>
        ) : (
          ''
        )}
      </form>
      <div className="mt-5 flex flex-col gap-4 p-5">
        <div className="border-border2 flex flex-row gap-2 border-b text-center font-bold">
          {headerWeekdays.map((wd) => (
            <div key={wd} className={weekdayColCSS}>
              {wd}
            </div>
          ))}
        </div>
        {isLoadingPrices ? (
          <div className="m-auto p-10">
            <Spinner size="20px" />
          </div>
        ) : (
          calendarGrid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-row gap-2">
              {week.map((item, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`${weekdayColCSS} border-border2 ${averageColor(item?.price_cents)} flex min-h-15 flex-col items-center justify-center rounded-md border p-1 text-center text-xs text-gray-900`}
                >
                  {item ? (
                    <div>
                      <p className="mb-1 font-bold">{formatDate(item.date)}</p>
                      <p className="text-sm italic">
                        {formatPrice(item.price_cents)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-txt">-</span>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
