import { useState } from 'react';
import {
  calculateAge,
  formatDate,
  formatDateWithTime,
  hasBirthdayToday,
} from '../../../shared/lib/dateUtils';
import { calculateBalance, formatPrice } from '../../../shared/lib/numberUtils';
import { numberToOrdinalWord } from '../../../shared/lib/stringUtils';
import Badget from '../../../shared/ui/Badget';
import Button from '../../../shared/ui/Button';
import InfoBox from '../../../shared/ui/InfoBox';
import PaymentOverview from '../../../shared/ui/PaymentOverview';
import SkeletonMini from '../../../shared/ui/SkeletonMini';
import { useBookingDetails } from '../hooks/useBookingDetails';
import ExtrasPickerList from './ExtrasPickerList';
import Skeleton from '../../../shared/ui/Skeleton';
import NewPayment from '../../../shared/ui/NewPayment';
import { useCreatePayment } from '../hooks/useCreatePayment';
import { useCheckIn } from '../hooks/useCheckIn';
import { DEMO_TODAY } from '../../../shared/config/today';
import { useCheckOut } from '../hooks/useCheckOut';

const today = DEMO_TODAY;
const validRoomStatuses = ['available', 'inspected'];

export default function BookingDetails({
  bookingData,
  userId,
  setSelectedBooking,
}) {
  const { isFetchingDetails, bookingDetails } = useBookingDetails(
    bookingData?.booking || bookingData,
  );

  const [extrasTotalCents, setExtrasTotalCents] = useState(0);
  const [extrasList, setExtrasList] = useState([]);

  const {
    adults = 0,
    children = 0,
    startDate,
    endDate,
    status,
    reservationNumber = '-',
    guestObservations = '-',
    paymentStatus = '-',
    accommodationTotalCents = 0,
    discountTotalCents = 0,
    taxTotalCents = 0,
    guests: {
      fullName,
      dateOfBirth = '-',
      email,
      nationality,
      nationalId = '-',
    } = {},
    rooms: {
      roomNumber = '-',
      status: roomStatus,
      floor = '-',
      roomTypes: { name: roomType = '-' } = {},
    } = {},
  } = bookingDetails;

  let paymentHistory = {};
  let paidAccomodationCents = 0;
  let paidDiscountCents = 0;
  let paidExtrasCents = 0;

  if (bookingDetails.payments) {
    paymentHistory = Object.fromEntries(
      bookingDetails.payments.map((p) => [
        `${formatDateWithTime(p.paidAt)}`,
        `${formatPrice(p.amountCents + p.discountAmountCents)} - ${p.method} - ${p.reference}`,
      ]),
    );

    paidAccomodationCents = bookingDetails.payments.reduce(
      (sum, payment) => sum + payment.amountCents,
      0,
    );

    paidDiscountCents = bookingDetails.payments.reduce(
      (sum, payment) => sum + payment.discountAmountCents,
      0,
    );

    if (paidAccomodationCents > accommodationTotalCents) {
      paidExtrasCents =
        paidAccomodationCents - accommodationTotalCents - taxTotalCents;
    }
  }

  const paidAmountCents = paidAccomodationCents + paidDiscountCents;
  const extrasSumCents = extrasTotalCents + paidExtrasCents;

  const { totalCents, balanceDueCents } = calculateBalance({
    accomodation: accommodationTotalCents,
    tax: taxTotalCents,
    extras: extrasSumCents,
    paid: paidAmountCents,
    discount: discountTotalCents,
  });

  const { mutate: submitPayment, isPending: isPendingPayment } =
    useCreatePayment();

  function handlePayment(formValues) {
    // mutate submitpayment is a function
    submitPayment(
      {
        bookingId: bookingData.booking.id,
        userId: userId,
        extras: extrasList,
        newPayment: formValues,
        notes: 'paid at desk',
        accommodationTotalCents: accommodationTotalCents,
        taxTotalCents: taxTotalCents,
        paidAmountCents: paidAmountCents,
        paymentStatus: paymentStatus,
      },
      {
        onSuccess: () => {
          setExtrasList([]);
        },
      },
    );
  }

  const { mutate: checkIn, isPending: isPendingCheckIn } = useCheckIn();
  const { mutate: checkOut, isPending: isPendingCheckOut } = useCheckOut();

  function handleCheckIn() {
    checkIn(bookingData.booking.id);
    setSelectedBooking(null);
  }

  function handleCheckOut() {
    checkOut({
      bookingId: bookingData.booking.id,
      roomId: bookingData.booking.rooms.id,
    });

    setSelectedBooking(null);
  }

  return (
    <div
      className="bg-bg text-txt border-txt-expired min-w-200 rounded-xl border p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="bg-bg3 text-txt flex flex-row rounded-lg">
        <div className="flex flex-1 flex-col p-3">
          <span className="flex items-baseline gap-2 text-2xl font-bold">
            <img src={bookingData.flag} alt="" className="w-5" />
            <h1>{fullName}</h1>
          </span>
          <span className="text-lg font-light">
            {isFetchingDetails ? <SkeletonMini /> : reservationNumber}
          </span>
        </div>
        <div className="bg-bg-today flex flex-col rounded-tr-lg rounded-br-lg p-3">
          <span className="font-bold">Room</span>
          <span className="-mt-1 text-xs italic">{roomType}</span>
          <div className="flex flex-row items-baseline gap-5">
            <span>{roomNumber}</span>
            <span className="text-xs">{numberToOrdinalWord(floor)} Floor</span>
          </div>
        </div>
      </header>
      {!status ? (
        <div className="my-3">
          <Skeleton />
        </div>
      ) : (
        <>
          <main className="bg-bg text-txt my-3">
            <div className="flex flex-row flex-wrap-reverse gap-5">
              {(status === 'checked_in' || status === 'confirmed') && (
                <div className="border-border3 flex flex-1 flex-row flex-wrap-reverse gap-3 rounded-md border">
                  {/* PAYMENT OVERVIEW */}
                  <div className="flex-1 p-5">
                    {isFetchingDetails ? (
                      <div className="w-70">
                        <Skeleton />
                      </div>
                    ) : (
                      <PaymentOverview
                        status={paymentStatus}
                        accommodation={accommodationTotalCents}
                        extras={extrasSumCents}
                        tax={taxTotalCents}
                        discount={discountTotalCents}
                        paid={paidAmountCents}
                        total={totalCents}
                        balance={balanceDueCents}
                      />
                    )}
                    {/* NEW PAYMENT */}
                    {isFetchingDetails ? (
                      <div className="w-40">
                        <Skeleton />
                      </div>
                    ) : (
                      balanceDueCents > 0 && (
                        <div className="mt-20">
                          <h1 className="text-xl font-bold">
                            Create New Payment
                          </h1>

                          <NewPayment
                            key={balanceDueCents}
                            maxValue={balanceDueCents}
                            minValue={extrasTotalCents}
                            onSubmit={handlePayment}
                            isPending={isPendingPayment}
                          />
                        </div>
                      )
                    )}
                  </div>
                  {/* EXTRAS AND DISCOUNT */}
                  <div className="flex flex-1 flex-col justify-between rounded-lg p-5">
                    <ExtrasPickerList
                      setExtrasTotalCents={setExtrasTotalCents}
                      extrasList={extrasList}
                      setExtrasList={setExtrasList}
                    />
                  </div>
                </div>
              )}
              {/* INFO BOXES */}
              <ul className="grid grid-cols-[auto_1fr] gap-2">
                <li className="col-start-1 col-end-1 row-start-1">
                  <InfoBox
                    title="Reservation Details"
                    data={{
                      nights: `${bookingData.nights} night${bookingData.nights === 1 ? '' : 's'}`,
                      'check-in': formatDate(startDate),
                      'check-out': formatDate(endDate),
                      ...(adults > 0 && {
                        adults: `${adults} adult${adults === 1 ? '' : 's'}`,
                      }),
                      ...(children > 0 && {
                        children: `${children} child${children === 1 ? '' : 'ren'}`,
                      }),
                    }}
                  />
                </li>
                <li className="col-start-2 col-end-2 row-start-1">
                  <InfoBox title="Observations" data={guestObservations} />
                </li>
                <li className="col-start-1 col-end-3 row-start-2">
                  <InfoBox
                    title="Guest"
                    data={{
                      name: fullName,
                      age: calculateAge(dateOfBirth),
                      birthday: (
                        <>
                          {formatDate(dateOfBirth)}
                          {hasBirthdayToday(dateOfBirth) && (
                            <Badget title="Happy Birthday" status="green" />
                          )}
                        </>
                      ),
                      nationality: nationality,
                      ID: nationalId,
                      email: email,
                    }}
                  />
                </li>
                <li className="col-start-1 col-end-3 row-start-3">
                  <InfoBox title="Payment History" data={paymentHistory} />
                </li>
              </ul>
            </div>
          </main>
          <footer className="mt-8">
            <div className="flex flex-row">
              {status === 'confirmed' && startDate === today && (
                <div className="flex flex-row items-center">
                  <Button
                    color="blue"
                    disabled={
                      isPendingCheckIn ||
                      balanceDueCents !== 0 ||
                      !validRoomStatuses.includes(roomStatus)
                    }
                    onClick={handleCheckIn}
                  >
                    Check in
                  </Button>
                  <span className="ml-10">
                    {validRoomStatuses.includes(roomStatus) ? (
                      <p className="text-green-600">Room is clean</p>
                    ) : roomStatus === 'cleaning' ? (
                      <p className="text-yellow-600">Room is being cleaned</p>
                    ) : roomStatus === 'out_of_order' ? (
                      <p className="text-rose-600">Room is out of order</p>
                    ) : (
                      ''
                    )}
                  </span>
                </div>
              )}
              {status === 'checked_in' && endDate === today && (
                <Button
                  color="blue"
                  disabled={isPendingCheckOut || balanceDueCents !== 0}
                  onClick={handleCheckOut}
                >
                  Check out
                </Button>
              )}
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
