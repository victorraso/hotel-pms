import { useEffect, useState } from 'react';
import { useExtras } from '../../../shared/hooks/useExtras';
import { formatPrice } from '../../../shared/lib/numberUtils';
import Button from '../../../shared/ui/Button';
import Skeleton from '../../../shared/ui/Skeleton';

export default function ExtrasPickerList({
  setExtrasTotalCents,
  extrasList,
  setExtrasList,
}) {
  const { isLoading: isLoadingExtras, extras = [] } = useExtras();

  const [selectedExtraId, setSelectedExtraId] = useState('');
  const [extraQuantity, setExtraQuantity] = useState(1);
  // const [extrasList, setExtrasList] = useState([]);

  const extrasTotal = extrasList.reduce(
    (sum, item) => sum + item.totalPriceCents,
    0,
  );

  const currentItem = extras.find(
    (e) => e.id === Number(selectedExtraId || extras[0]?.id),
  );
  const currentPreviewPrice = currentItem
    ? currentItem.unitPriceCents * extraQuantity
    : 0;

  useEffect(() => {
    if (setExtrasTotalCents) {
      setExtrasTotalCents(extrasTotal);
    }
  }, [extrasTotal, setExtrasTotalCents]);

  function handleAddItem() {
    if (!currentItem || extraQuantity <= 0) return;

    const newItem = {
      id: currentItem.id,
      newId: crypto.randomUUID(),
      quantity: Number(extraQuantity),
      name: currentItem.name,
      unitPriceCents: currentItem.unitPriceCents,
      totalPriceCents: currentItem.unitPriceCents * Number(extraQuantity),
    };

    setExtrasList((prev) => [...prev, newItem]);
    setExtraQuantity(1);
  }

  function handleRemoveItem(id) {
    setExtrasList((prev) => prev.filter((item) => item.newId !== id));
  }

  function handleClear() {
    setExtrasList([]);
  }

  return (
    <div className="min-w-60">
      <h1 className="mb-3 text-xl font-bold">Extras</h1>
      <div className="ml-1 flex flex-row items-end gap-2">
        {isLoadingExtras ? (
          <div className="w-70">
            <Skeleton />
          </div>
        ) : (
          <>
            <div>
              {/* Selector */}
              <div className="grid grid-cols-[0.2fr_0.5fr] gap-5">
                <label htmlFor="extra-options" className="w-25 italic">
                  Item:
                </label>
                <select
                  id="extra-options"
                  name="extraOptions"
                  className="w-fit"
                  value={selectedExtraId || extras[0]?.id || ''}
                  onChange={(e) => setSelectedExtraId(e.target.value)}
                  disabled={isLoadingExtras}
                >
                  {isLoadingExtras ? (
                    <option>Loading...</option>
                  ) : (
                    extras?.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              {/* Quantity input */}
              <div className="grid grid-cols-[0.2fr_0.5fr] gap-5">
                <label htmlFor="extra-amount" className="w-25 italic">
                  Quantity:
                </label>
                <input
                  id="extra-amount"
                  type="number"
                  min="1"
                  className="w-12 rounded-sm pl-1"
                  value={extraQuantity}
                  onChange={(e) =>
                    setExtraQuantity(Math.max(1, Number(e.target.value)))
                  }
                />
              </div>
              {/* Price */}
              <div className="grid grid-cols-[0.2fr_0.5fr] gap-5">
                <label className="w-25 italic">Extra Cost:</label>
                <span>{formatPrice(currentPreviewPrice)}</span>
              </div>
            </div>
            {/* Action Btns */}
            <div className="flex flex-row gap-2">
              <Button
                onClick={() => handleAddItem(selectedExtraId)}
                color="green"
                disabled={isLoadingExtras || !currentItem}
              >
                Add item
              </Button>
              {extrasList.length > 0 && (
                <Button onClick={() => handleClear()}>Clear</Button>
              )}
            </div>
          </>
        )}
      </div>
      {/* List */}
      <div className="mt-5 ml-3">
        <ul className="border-border2 rounded-md text-sm">
          {extrasList?.map((extra) => {
            return (
              <div key={extra.newId}>
                <li className="my-1 grid w-fit grid-cols-[0.5fr_1.7fr_1fr_1fr]">
                  <span>{extra.quantity}x</span>
                  <span className="italic">{extra.name}</span>
                  <span>{formatPrice(extra.totalPriceCents)}</span>
                  <button
                    className="border-border2 bg-bg3 hover:bg-bg4 rounded-sm border px-1 text-xs duration-300 hover:text-gray-900"
                    onClick={() => handleRemoveItem(extra.newId)}
                  >
                    remove item
                  </button>
                </li>
                <hr className="text-border3" />
              </div>
            );
          })}
        </ul>
        {extrasTotal > 0 && (
          <>
            <span className="mt-2 flex flex-row justify-start gap-2">
              <strong>Sum:</strong> {formatPrice(extrasTotal)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
