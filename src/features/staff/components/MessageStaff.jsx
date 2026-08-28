import { useEffect, useRef, useState } from 'react';
import Button from '../../../shared/ui/Button';
import { useAddStaffMsg } from '../hook/useAddStaffMsg';
import { useUser } from '../../authentication/hooks/useUser';
import { toISOStringMidnight } from '../../../shared/lib/dateUtils';

const selectCSS =
  'border-border2 w-40 rounded-md border px-2 py-1 text-gray-900 ';

export default function MessageStaff() {
  const formRef = useRef();
  const [errorMsg, setErrorMsg] = useState(false);

  const { mutate: sendMessage, isPending: isPendingStaffMessage } =
    useAddStaffMsg();

  const { user } = useUser();

  function handleSubmit() {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());

    const validDepartment = Boolean(formValues.department);
    const validPriority = Boolean(formValues.priority);
    const validAcknowledgement = Boolean(formValues.acknowledgement);
    const validExpiresOn = Boolean(formValues.expiresOn);
    const validMessage = Boolean(formValues.message);

    const isValid =
      validDepartment &&
      validPriority &&
      validAcknowledgement &&
      validExpiresOn &&
      validMessage;

    setErrorMsg(!isValid);

    if (isValid) {
      sendMessage(
        {
          created_by: user.id,
          department: formValues.department,
          priority: formValues.priority,
          message: formValues.message,
          expires_at: toISOStringMidnight(formValues.expiresOn),
          requires_acknowledgement: formValues.acknowledgement === 'true',
        },
        {
          onSuccess: () => {
            formRef.current.reset();
          },
        },
      );
    }
  }

  useEffect(() => {
    if (!errorMsg) return;
    const delay = setTimeout(() => {
      setErrorMsg(false);
    }, 5000);
    return () => clearTimeout(delay);
  }, [errorMsg]);

  return (
    <>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <h4 className="text-lg font-bold">Message</h4>
        <div className="mt-1 flex flex-row gap-3">
          <textarea
            name="message"
            className="border-border2 h-50 w-100 resize-none rounded-md border p-2 focus:ring-0 focus:outline-none"
            spellCheck={false}
          ></textarea>
          <div className="flex flex-col justify-around">
            <select name="department" className={`bg-cyan-200 ${selectCSS}`}>
              <option value="" hidden>
                department
              </option>
              <option value="reception">Reception</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <select name="priority" className={`bg-cyan-300 ${selectCSS}`}>
              <option value="" hidden>
                priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              name="acknowledgement"
              className={`bg-cyan-400 ${selectCSS}`}
            >
              <option value="" hidden>
                acknowledgement
              </option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <div className={`bg-cyan-500 ${selectCSS} flex flex-col gap-1`}>
              <label className="">Expires on...</label>
              <input type="date" name="expiresOn" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Button
            color="green"
            onClick={handleSubmit}
            disabled={isPendingStaffMessage}
          >
            Create
          </Button>
        </div>
      </form>
      {errorMsg && (
        <div className="text-red-500 italic">
          Please select an option for every field.
        </div>
      )}
    </>
  );
}
