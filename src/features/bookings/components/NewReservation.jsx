import { useRef, useState } from 'react';
import GuestRegistration from '../../guests/components/GuestRegistration';
import CreateBooking from './CreateBooking';
import Button from '../../../shared/ui/Button';
import NewPayment from '../../../shared/ui/NewPayment';
import ComponentBox from '../../../shared/ui/ComponentBox';
import { useCreateGuest } from '../../guests/hooks/useCreateGuest';
import { useCreateNewBooking } from '../hooks/useCreateNewBooking';
import { useCreatePayment } from '../hooks/useCreatePayment';
import { useUser } from '../../authentication/hooks/useUser';

export default function NewReservation({ date = null, roomId = null }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState(() => {
    let initialStartDate = '2026-07-01';
    let initialEndDate = '2026-07-02';

    if (date) {
      const [y, m, d] = date.split('-').map(Number);
      initialStartDate = date;
      initialEndDate = new Date(y, m - 1, d + 1).toLocaleDateString('sv-SE');
    }

    return {
      startDate: initialStartDate,
      endDate: initialEndDate,
      cellRoomId: roomId || null,
    };
  });

  const [isValidStep, setIsValidStep] = useState(false);
  const guestRef = useRef();
  const newBookingRef = useRef();

  const { user } = useUser();

  function handleNext(e) {
    e.stopPropagation();
    setCurrentSlide((prev) => Math.min(prev + 1, 2));
    setIsValidStep(false);
  }

  function handleBack(e) {
    e.stopPropagation();
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
    setIsValidStep(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalCost = formData.accomodationCost + formData.taxCost;

  const { mutateAsync: createNewGuestAsync, isCreating: isCreatingNewGuest } =
    useCreateGuest();
  const { mutateAsync: createNewBookingAsync, isCreating: isCreatingBooking } =
    useCreateNewBooking();
  const { mutateAsync: createNewPaymentAsync, isCreating: isCreatingPayment } =
    useCreatePayment();

  const isPending =
    isCreatingNewGuest || isCreatingBooking || isCreatingPayment;

  async function handleCompleteReservation(formValues) {
    if (isPending) return;

    try {
      const newGuest = {
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        national_id: formData.nationalId,
      };

      let currentGuestId = formData.guestId;

      if (guestRef.current !== newGuest) {
        guestRef.current = newGuest;
        const guestData = await createNewGuestAsync(newGuest);
        currentGuestId = guestData[0].id;

        handleChange({
          target: {
            name: 'guestId',
            value: currentGuestId,
          },
        });
      }

      const newBooking = {
        guest_id: currentGuestId,
        room_id: formData.room.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        adults: 1,
        accommodation_total_cents: formData.accomodationCost,
        tax_total_cents: formData.taxCost,
        status: 'confirmed',
        payment_status: 'pending',
      };

      let currentBookingId = formData.bookingId;

      if (newBookingRef.current !== newBooking) {
        newBookingRef.current = newBooking;
        const bookingData = await createNewBookingAsync(newBooking);
        currentBookingId = bookingData[0].id;

        handleChange({
          target: {
            name: 'bookingId',
            value: currentBookingId,
          },
        });
      }

      const newPayment = {
        bookingId: currentBookingId,
        userId: user.id,
        extras: [],
        newPayment: formValues,
        notes: 'paid at desk',
        accommodationTotalCents: formData.accomodationCost,
        taxTotalCents: formData.taxCost,
        paidAmountCents: 0,
        paymentStatus: 'pending',
      };

      let paymentId = null;

      if (currentBookingId && currentBookingId) {
        paymentId = await createNewPaymentAsync(newPayment);
      }

      if (paymentId) {
        setFormData({
          startDate: '2026-07-01',
          endDate: '2026-07-02',
        });
        guestRef.current = null;
        newBookingRef.current = null;
        setCurrentSlide(3);
      }
    } catch (error) {
      console.error(`Error while creating reservation`, error);
    }
  }

  const slides = [
    <ComponentBox
      css="w-130"
      label="Create Booking"
      content={
        <CreateBooking
          formData={formData}
          onChange={handleChange}
          onValidStep={setIsValidStep}
        />
      }
    />,
    <ComponentBox
      css="w-130"
      label="Guest Registration"
      content={
        <GuestRegistration
          formData={formData}
          onChange={handleChange}
          onValidStep={setIsValidStep}
        />
      }
    />,
    <ComponentBox
      css="w-100 h-80"
      label="Create New Payment"
      content={
        <NewPayment
          maxValue={totalCost}
          onSubmit={handleCompleteReservation}
          isPending={isPending}
        />
      }
    />,
    <ComponentBox
      css="w-130"
      label="Success!"
      content={
        <div>
          <Button color="blue" onClick={() => setCurrentSlide(0)}>
            Create another reservation
          </Button>
        </div>
      }
    />,
  ];

  return (
    <div
      className="text-txt flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-bg2 border-border3 box-border flex flex-col justify-between rounded-xl border">
        {slides[currentSlide]}
        <div className="flex flex-row justify-end gap-2 p-5">
          {currentSlide > 0 && currentSlide < 3 && (
            <Button color="blue" onClick={handleBack} disabled={isPending}>
              back
            </Button>
          )}
          {isValidStep && (
            <Button color="blue" onClick={handleNext}>
              next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
