import { useState } from 'react';
import { capitalize } from '../../../shared/lib/stringUtils';
import Button from '../../../shared/ui/Button';
import Table from '../../../shared/ui/Table';
import { useGetStaffMsgs } from '../hook/useGetStaffMsgs';
import {
  getPastFilterDate,
  getRealTodayDate,
  toISOStringMidnight,
} from '../../../shared/lib/dateUtils';
import { useDeleteMsgs } from '../hook/useDeleteMsgs';
import UserName from '../../user/components/UserName';

export default function MessageHistory() {
  const [activateDelete, setActivateDelete] = useState(false);
  const [deleteSelection, setDeleteSelection] = useState([]);
  const [filterDate, setFilterDate] = useState('1900-01-01');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const realToday = getRealTodayDate();

  const { mutate: deleteMessages, isPending: isPendingDeletion } =
    useDeleteMsgs();
  const { data: messages, isLoading: isLoadingMessages } = useGetStaffMsgs();

  const filteredMessages = messages
    ?.filter(
      (msg) =>
        new Date(msg.createdAt) > new Date(toISOStringMidnight(filterDate)),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const isAllSelected =
    filteredMessages?.length > 0 &&
    deleteSelection?.length === filteredMessages?.length;

  const header = (
    <>
      {activateDelete && (
        <span>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAllToDelete}
          />
        </span>
      )}
      <span>Created On</span>
      <span>Message</span>
      <span>Department</span>
      <span>Completed</span>
    </>
  );

  const colGrid = `${activateDelete ? 'minmax(0, 0.1fr)' : ''} minmax(0, 0.3fr) minmax(0, 0.7fr) minmax(0, 0.3fr) minmax(0, 0.4fr)`;

  function handleFilter(amount) {
    if (amount === selectedFilter) {
      setSelectedFilter(null);
      setFilterDate('1900-01-01');
    } else {
      setFilterDate(getPastFilterDate(amount, realToday));
      setSelectedFilter(amount);
    }
    if (deleteSelection.length > 0) {
      setDeleteSelection([]);
    }
    setActivateDelete(false);
  }

  function handleActivateDeleteButton() {
    setActivateDelete((prev) => {
      const nextState = !prev;

      if (!nextState) {
        setDeleteSelection([]);
      }
      return nextState;
    });
  }

  function handleSelectItemToDelete(id) {
    if (deleteSelection?.includes(id)) {
      setDeleteSelection(deleteSelection?.filter((itemId) => itemId !== id));
    } else {
      setDeleteSelection([...deleteSelection, id]);
    }
  }

  function handleSelectAllToDelete(e) {
    if (e.target.checked) {
      setDeleteSelection(filteredMessages?.map((item) => item.id));
    } else {
      setDeleteSelection([]);
    }
  }

  function handleDelete() {
    if (!deleteSelection) return;
    deleteMessages(deleteSelection, {
      onSuccess: () => {
        setDeleteSelection([]);
      },
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center justify-between">
        <h4 className="ml-2 text-lg font-bold">History</h4>
        <div className="mr-5 flex flex-row gap-10">
          <div className="flex flex-row gap-3">
            <Button
              color={selectedFilter === 0 ? 'blue' : 'normal'}
              onClick={() => handleFilter(0)}
            >
              From today
            </Button>
            <Button
              color={selectedFilter === 7 ? 'blue' : 'normal'}
              onClick={() => handleFilter(7)}
            >
              Last 7 days
            </Button>
            <Button
              color={selectedFilter === 30 ? 'blue' : 'normal'}
              onClick={() => handleFilter(30)}
            >
              Last 30 days
            </Button>
          </div>
          <Button color="yellow" onClick={handleActivateDeleteButton}>
            {activateDelete ? 'Cancel Delete' : 'Delete Messages'}
          </Button>
        </div>
      </div>
      <div className="w-200">
        <Table
          colGrid={colGrid}
          header={header}
          css={'max-h-100'}
          isLoading={isLoadingMessages}
          bodyData={filteredMessages}
          bodyRender={(msg) => {
            const isChecked = deleteSelection?.includes(msg.id);
            return (
              <div key={msg.id}>
                <hr className="text-border-light" />
                <div
                  className={`grid grid-cols-(--col-grid) items-center gap-5 px-4 py-1`}
                  style={{ '--col-grid': colGrid }}
                >
                  {activateDelete && (
                    <div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSelectItemToDelete(msg.id)}
                      />
                    </div>
                  )}
                  <div>{msg.createdAt.split('T')[0]}</div>
                  <div>{msg.message}</div>
                  <div>{capitalize(msg.department)}</div>
                  <div>
                    <span>{msg.completed ? '✅️' : '❌️'}</span>
                    {msg.completedBy && (
                      <span className="ml-2 text-xs">
                        by <UserName id={msg.completedBy} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
      {activateDelete && (
        <div className="mt-3 mr-5 flex justify-end">
          <Button
            color="red"
            disabled={deleteSelection.length === 0 || isPendingDeletion}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
