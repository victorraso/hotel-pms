import { formatDate, getNumberOfNights } from '../../../shared/lib/dateUtils';
import Badget from '../../../shared/ui/Badget';

export default function DetailsRow({
  booking,
  flagSVG,
  setSelectedBooking,
  flowKind,
}) {
  const {
    startDate,
    endDate,
    adults,
    children,
    paymentStatus,
    guests: { fullName, email },
    rooms: { roomNumber },
  } = booking;

  const numNights = getNumberOfNights(startDate, endDate);

  function handleClick() {
    const details = {
      booking: booking,
      flag: flagSVG,
      nights: numNights,
    };
    setSelectedBooking(details);
  }

  return (
    <div className="border-border3 grid grid-cols-(--col-grid) gap-5 border-t px-4 py-1">
      <div className="flex flex-col justify-center font-bold">{roomNumber}</div>
      <div className="flex min-w-0 flex-col justify-center text-wrap wrap-break-word">
        <div className="flex flex-row items-center gap-2">
          {flagSVG && <img src={flagSVG} alt="" className="inline-block w-6" />}
          <span className="min-w-0 font-bold text-wrap wrap-break-word">
            {fullName}
          </span>
        </div>
        <span className="text-xs font-light">{email}</span>
      </div>
      {(flowKind === 'checkIns' || flowKind === 'staying') && (
        <div className="flex min-w-0 flex-col justify-center text-wrap wrap-break-word">
          <span className="font-bold">
            {numNights} {numNights > 1 ? 'nights' : 'night'}
          </span>
          <span className="text-xs">
            {formatDate(startDate)} {'\u2014'} {formatDate(endDate)}
          </span>
        </div>
      )}
      {flowKind === 'checkIns' && (
        <div className="flex flex-col justify-center">
          <Badget status={paymentStatus} />
        </div>
      )}
      <div className="flex flex-col items-start justify-center text-xs">
        <span>
          {adults === 1
            ? `${adults} adult`
            : adults > 0
              ? `${adults} adults`
              : ''}
        </span>
        <span>
          {children === 1
            ? `${children} child`
            : children > 0
              ? `${children} children`
              : ''}
        </span>
      </div>
      <div className="flex flex-col justify-center">
        <button
          onClick={() => handleClick()}
          className="bg-bg4 flex h-10 w-13 cursor-pointer items-center rounded-md pl-2 text-xl text-stone-900 duration-300 hover:bg-stone-200 hover:pl-4"
        >
          {'->'}
        </button>
      </div>
    </div>
  );
}
