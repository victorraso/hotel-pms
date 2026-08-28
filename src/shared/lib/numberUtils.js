export function formatPrice(amount) {
  const numericCents =
    typeof amount === 'number' ? amount : Number(amount) || 0;
  const formatted = (numericCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatted;
}

export function calculateBalance({
  accomodation,
  tax,
  extras,
  paid,
  discount,
}) {
  const totalCents = accomodation + tax + extras;
  const balanceDueCents = totalCents - paid - discount;
  return { totalCents, balanceDueCents };
}

export function formatPhoneNumber(number) {
  const digitsOnly = number.replace(/\D/g, '').slice(0, 15);

  if (digitsOnly.length === 0) return '';

  let formattedPhone = '+';

  if (digitsOnly.length > 0) {
    const countryCode = digitsOnly.slice(0, 2);
    const restOfNumber = digitsOnly.slice(2);

    formattedPhone += countryCode + ' ';

    if (restOfNumber.length > 0) {
      formattedPhone += restOfNumber;
    }
  }

  return formattedPhone;
}

/* export function formatCashInput(input) {
  if (!input) return '$0.00';

  const digitsOnly = input.replace(/\D/g, '');
  const cleanZeros = digitsOnly.replace(/^0+/, '');

  if (!cleanZeros) return '$0.00';

  const cents = parseInt(cleanZeros, 10) / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents);
} */
