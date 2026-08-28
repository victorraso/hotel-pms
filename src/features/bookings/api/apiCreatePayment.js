import { supabase } from '../../../shared/api/supabase';
import { updateBookingPaymentStatus } from './apiBookings';

export async function createPayment({
  userId,
  bookingId,
  extras,
  newPayment,
  notes,
  accommodationTotalCents,
  taxTotalCents,
  paidAmountCents,
  paymentStatus,
}) {
  const {
    method,
    desk_discount_percent: deskDiscountPercent,
    desk_discount_cents: deskDiscountCents,
    total_due_cents: totalDueCents,
  } = newPayment;

  let successExtraIds = [];

  if (extras.length > 0) {
    const { data: extraRows, error: extrasError } = await supabase
      .from('extra_purchases')
      .insert(
        extras.map((e) => ({
          booking_id: bookingId,
          extra_id: e.id,
          quantity: Number(e.quantity),
          unit_price_cents: Number(e.unitPriceCents),
          created_by: userId,
        })),
      )
      .select('id');

    if (extrasError) throw extrasError;

    successExtraIds = extraRows.map((row) => row.id);
  }

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      booking_id: bookingId,
      amount_cents: Number(totalDueCents),
      method: method,
      reference: generatePaymentReference(),
      notes: notes,
      discount_percent: Number(deskDiscountPercent),
      discount_amount_cents: Number(deskDiscountCents),
      created_by: userId,
    })
    .select('id')
    .single();

  if (paymentError) {
    if (successExtraIds.length > 0) {
      await supabase.from('extra_purchases').delete().in('id', successExtraIds);
    }
    throw paymentError;
  }

  if (paymentStatus != 'paid') {
    const newPaymentStatus =
      paidAmountCents + Number(totalDueCents) + Number(deskDiscountCents) >=
      accommodationTotalCents + taxTotalCents
        ? 'paid'
        : 'partially_paid';

    try {
      await updateBookingPaymentStatus(bookingId, newPaymentStatus);
    } catch (error) {
      const rollbackErrors = [];

      const { error: paymentDeleteError } = await supabase
        .from('payments')
        .delete()
        .eq('id', payment.id);

      if (paymentDeleteError) rollbackErrors.push(paymentDeleteError);

      if (successExtraIds.length > 0) {
        const { error: extrasDeleteError } = await supabase
          .from('extra_purchases')
          .delete()
          .in('id', successExtraIds);
        if (extrasDeleteError) rollbackErrors.push(extrasDeleteError);
      }

      if (rollbackErrors.length > 0) {
        console.log(
          'Rollback failed after payment status update error:',
          rollbackErrors,
        );
      }

      throw new Error(`Failed to update booking status: ${error.message}`, {
        cause: error,
      });
    }
  }

  return payment.id;
}

function generatePaymentReference() {
  const random = crypto
    .randomUUID()
    .replace(/-/g, '')
    .slice(0, 10)
    .toUpperCase();
  return `PAY-${random}`;
}
