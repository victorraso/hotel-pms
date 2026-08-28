import { useEffect, useState } from 'react';
import { formatPhoneNumber } from '../../../shared/lib/numberUtils';
import { validateEmail } from '../../../shared/lib/stringUtils';
import { NATIONALITIES } from '../../../shared/constants/nationalities';

const labelCSS = 'font-bold';
const inputCSS = 'focus:ring-0 focus:outline-none italic pl-2 w-full';
const hrCSS = 'text-txt-disabled mb-2';
const rowCSS = 'grid grid-cols-[0.6fr_1fr]';

export default function GuestRegistration({ formData, onChange, onValidStep }) {
  const [errorMsg, setErrorMsg] = useState('');

  const errorName = {
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone Number',
    nationality: 'Nationality',
    nationalId: 'National ID',
  };

  useEffect(() => {
    const isFullNameValid = Boolean(formData.fullName?.trim());
    const isDateOfBirthValid = Boolean(formData.dateOfBirth?.trim());
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = Boolean(formData.phone?.trim());
    const isNationalityValid = Boolean(formData.nationality);
    const isNationalIdValid = Boolean(formData.nationalId?.trim());

    const allValid =
      isFullNameValid &&
      isDateOfBirthValid &&
      isEmailValid &&
      isPhoneValid &&
      isNationalityValid &&
      isNationalIdValid;

    onValidStep(allValid);
  }, [formData, onValidStep]);

  function handlePhoneInput(e) {
    const formattedPhone = formatPhoneNumber(e.target.value);

    const syntheticEvent = {
      target: {
        name: 'phone',
        value: formattedPhone,
      },
    };

    onChange(syntheticEvent);
  }

  const handleValidation = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (!value) {
      setErrorMsg(`${errorName[name]} is required`);
    } else if (name === 'email' && !validateEmail(value)) {
      setErrorMsg(`Email is invalid`);
    } else {
      setErrorMsg('');
    }
  };

  useEffect(() => {
    if (!errorMsg) return;
    const delay = setTimeout(() => {
      setErrorMsg('');
    }, 5000);
    return () => clearTimeout(delay);
  }, [errorMsg]);

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={rowCSS}>
          <label className={labelCSS}>Full name: </label>
          <div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={onChange}
              onBlur={handleValidation}
              className={inputCSS}
            />

            <hr className={hrCSS} />
          </div>
        </div>
        <div className={rowCSS}>
          <label className={labelCSS}>Date of birth: </label>
          <div>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={onChange}
              onBlur={handleValidation}
              className={inputCSS}
            />

            <hr className={hrCSS} />
          </div>
        </div>
        <div className={rowCSS}>
          <label className={labelCSS}>Email: </label>
          <div>
            <input
              type="text"
              name="email"
              value={formData.email || ''}
              onChange={onChange}
              onBlur={handleValidation}
              className={inputCSS}
            />

            <hr className={hrCSS} />
          </div>
        </div>
        <div className={rowCSS}>
          <label className={labelCSS}>Phone: </label>
          <div>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handlePhoneInput}
              onBlur={handleValidation}
              className={inputCSS}
            />

            <hr className={hrCSS} />
          </div>
        </div>
        <div className={rowCSS}>
          <label className={labelCSS}>Nationality: </label>
          <div>
            <select
              name="nationality"
              value={formData.nationality || ''}
              onChange={onChange}
              onBlur={handleValidation}

              className={`${inputCSS} bg-bg2`}
            >
              <option value="">Select nationality...</option>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <hr className={hrCSS} />
          </div>
        </div>
        <div className={rowCSS}>
          <label className={labelCSS}>National ID: </label>
          <div>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId || ''}
              onChange={onChange}
              onBlur={handleValidation}
              className={inputCSS}
            />
            <hr className={hrCSS} />
          </div>
        </div>
      </form>
      <div className="flex h-7 flex-row justify-center">
        {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
      </div>
    </>
  );
}
