import { useMemo, useState } from 'react';
import { DEMO_TODAY } from '../../../shared/config/today';
import Button from '../../../shared/ui/Button';
import { useDepartmentMsgs } from '../hook/useDepartmentMsgs';
import Spinner from '../../../shared/ui/Spinner';
import { useUpdateMsg } from '../hook/useUpdateMsg';
import Skeleton from '../../../shared/ui/Skeleton';

const today = DEMO_TODAY;

const priorityColor = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600',
};

export default function MessageViewer({ userId }) {
  const { data, isLoading: isLoadingMessages } = useDepartmentMsgs('reception');
  const {
    mutate: updateMessage,
    variables: pendingVariables,
    isPending: isPendingMsgsUpdate,
  } = useUpdateMsg();

  const messages = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (item) =>
        !item.completed &&
        new Date(`${today}T23:59:59.999Z`).toISOString() <= item.expiresAt,
    );
  }, [data]);

  const [checkedIds, setCheckedIds] = useState(new Set());

  function toggleCheck(id) {
    setCheckedIds((prev) => {
      const current = new Set(prev);
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }

      return current;
    });
  }

  function handleDone(id) {
    const fields = {
      completed: true,
      completed_by: userId,
    };

    updateMessage({ id, fields });
  }

  return (
    <div className="flex flex-col gap-1">
      <h4 className="ml-1 text-lg font-bold">Messages</h4>
      {isLoadingMessages ? (
        <div className="w-200">
          <Skeleton />
        </div>
      ) : messages.length > 0 ? (
        <div className="border-border2 flex min-h-30 w-fit flex-col justify-center rounded-md border p-5">
          {messages.map((m) => {
            const isChecked = checkedIds.has(m.id);
            const isThisPending =
              isPendingMsgsUpdate && pendingVariables?.id === m.id;

            return (
              <div
                key={m.id}
                className="mb-2 grid grid-cols-[1fr_0.3fr_0.1fr_0.2fr] items-center gap-5"
              >
                <span className="pr-10">
                  {m.message} <hr className="text-border2" />
                </span>
                <div>
                  <span>Priority: </span>
                  <span className={`${priorityColor[m.priority]} ml-1`}>
                    {m.priority}
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(m.id)}
                  />
                  <label>confirm</label>
                </div>
                <Button
                  color="yellow"
                  disabled={!isChecked || isThisPending}
                  onClick={() => handleDone(m.id)}
                >
                  {isThisPending ? <Spinner size="10px" /> : 'Done'}
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <span>No messages yet</span>
      )}
    </div>
  );
}
