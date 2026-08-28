import { formatPrice } from '../lib/numberUtils';
import Badget from './Badget';

export default function PaymentOverview({
  status = '',
  accommodation = 0,
  tax = 0,
  discount = 0,
  extras = 0,
  paid = 0,
  total = 0,
  balance = 0,
}) {
  return (
    <div className="flex min-w-60 flex-col">
      <label className="mb-3 flex flex-row items-center gap-5">
        <h1 className="text-xl font-bold">Payment Overview</h1>
        {/* {status && paid < accommodation ? <Badget status={status} /> : ''} */}
        {status && <Badget status={status} />}
        {extras > 0 && balance > 0 ? (
          <Badget title={'open bill'} status={'red'} />
        ) : (
          ''
        )}
      </label>
      <ul className="w-fit">
        <li className="ml-3 grid grid-cols-[1fr_0.5fr] gap-5">
          <h4 className="italic">Accomodation Costs: </h4>
          <span>{formatPrice(accommodation)}</span>
        </li>

        {extras > 0 && (
          <li className="ml-3 grid grid-cols-[1fr_0.5fr] gap-5">
            <h4 className="italic">Extras Costs: </h4>
            <span>{formatPrice(extras)}</span>
          </li>
        )}

        <li className="ml-3 grid grid-cols-[1fr_0.5fr] gap-5">
          <h4 className="italic">Tax Costs: </h4>
          <span>{formatPrice(tax)}</span>
        </li>
        {paid > 0 || discount > 0 ? (
          <>
            <hr className="mt-1" />
            <li className="mt-2 grid grid-cols-[1fr_0.5fr] gap-5">
              <h4 className="font-bold">Total:</h4>
              <span>{formatPrice(total)}</span>
            </li>
            {paid > 0 && (
              <li className="grid grid-cols-[1fr_0.5fr] gap-5">
                <h4 className="italic">Amount Paid: </h4>
                <div className="-ml-3 space-x-1">
                  <span>{'\u2212'}</span>
                  <span>{formatPrice(paid)}</span>
                </div>
              </li>
            )}
            {discount > 0 && (
              <>
                <li className="grid grid-cols-[1fr_0.5fr] gap-5">
                  <h4 className="italic">Discount: </h4>
                  <div className="-ml-3 space-x-1">
                    <span>{'\u2212'}</span>
                    <span>{formatPrice(discount)}</span>
                  </div>
                </li>
              </>
            )}
          </>
        ) : (
          ''
        )}
        <hr className="mt-1" />
        <li className="mt-2 grid grid-cols-[1fr_0.5fr] gap-5">
          <h4 className="font-bold">Balance Due:</h4>
          <span>{formatPrice(balance)}</span>
        </li>
      </ul>
    </div>
  );
}
