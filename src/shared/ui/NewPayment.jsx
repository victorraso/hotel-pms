import { useEffect, useRef, useState } from 'react';
import { PAYMENT_METHODS } from '../constants/paymentMethods';
import Button from './Button';
import { formatPrice } from '../lib/numberUtils';
import Spinner from './Spinner';

export default function NewPayment({
  maxValue = 9999999,
  minValue = 0,
  onSubmit,
  isPending,
}) {
  const [amount, setAmount] = useState(formatPrice(maxValue));
  const [deskDiscountPercent, setDeskDiscountPercent] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [payError, setPayError] = useState(false);

  const formRef = useRef(null);

  const rawAmountCents = Math.round(
    parseFloat(amount.replace(/[^0-9.]/g, '') || '0') * 100,
  );

  const deskDiscountCents = Math.round(
    (deskDiscountPercent / 100) * rawAmountCents,
  );
  const totalDueCents = rawAmountCents - deskDiscountCents;

  function handleSubmit() {
    if (!formRef.current) return;
    if (rawAmountCents < minValue) {
      setPayError(true);
      return;
    }
    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());

    onSubmit(formValues);
  }

  function handleAmount(e) {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    const cents = parseInt(digitsOnly || '0', 10);

    if (cents > maxValue) {
      return setAmount(formatPrice(maxValue));
    }

    setAmount(formatPrice(cents));
  }

  useEffect(() => {
    if (!payError) return;
    const errorDelay = setTimeout(() => {
      setPayError(false);
    }, 5000);
    return () => clearTimeout(errorDelay);
  }, [payError]);

  return (
    <div className="min-w-60">
      {isPending ? (
        <div className="ml-13">
          <Spinner />
        </div>
      ) : (
        <>
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <div className="mt-3 ml-1 flex w-80 flex-col gap-1">
              <div className="ml-3 grid grid-cols-2 gap-4">
                <label className="italic">Base Amount: </label>
                <input
                  className="w-30 rounded-md"
                  type="text"
                  value={amount ? amount : '$0.00'}
                  onChange={handleAmount}
                />
              </div>
              <div className="ml-3 grid grid-cols-2 gap-4">
                <label className="italic">Method: </label>
                <div>
                  <select
                    name="method"
                    value={
                      deskDiscountPercent === 100 ? 'none' : selectedMethod
                    }
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="bg-bg2"
                  >
                    {PAYMENT_METHODS.filter((i) => i.active === true).map(
                      (method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
              <div className="ml-3 grid grid-cols-2 gap-4">
                <label className="italic">Discount %:</label>
                <div className="flex flex-row gap-2">
                  <input
                    className="w-13 rounded-md"
                    name="desk_discount_percent"
                    type="number"
                    min="0"
                    max="100"
                    value={deskDiscountPercent}
                    onChange={(e) => {
                      const val = Math.min(
                        100,
                        Math.max(0, Number(e.target.value)),
                      );
                      setDeskDiscountPercent(val);
                    }}
                  />
                  <span>%</span>
                </div>
              </div>
              {deskDiscountCents > 0 && (
                <div className="ml-3 grid grid-cols-2 gap-3">
                  <label className="italic">Discount Applied:</label>
                  <div className="-ml-3 not-first:space-x-1">
                    <span>{'\u2212'}</span>
                    <span>{formatPrice(deskDiscountCents)}</span>
                  </div>
                </div>
              )}
              <input
                type="hidden"
                name="desk_discount_cents"
                value={deskDiscountCents}
              />
              <hr className="mb-2 w-64" />
              <div className="grid grid-cols-2 gap-4">
                {payError ? (
                  <span className="h-6 text-xs text-nowrap text-red-500">
                    Minimum amount must cover extra costs.
                  </span>
                ) : (
                  <>
                    <label className="font-bold">Total Due:</label>
                    <span>{formatPrice(totalDueCents)}</span>
                  </>
                )}
              </div>
              <input
                type="hidden"
                name="total_due_cents"
                value={totalDueCents}
              />
            </div>
            <div className="mt-5">
              <Button color="green" onClick={handleSubmit}>
                Create
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
