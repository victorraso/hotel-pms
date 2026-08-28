export function getRealTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(date) {
  const [y, m, d] = date.split('-').map(Number);
  const formattedDate = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return formattedDate;
}

export function formatMonthYear(date) {
  const [y, m, d] = date.split('-').map(Number);
  const formattedDate = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  return formattedDate;
}

export function formatDateWithTime(timestamptz) {
  const formatted = new Date(timestamptz).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const [monthDay, year, time] = formatted.split(',');

  return `${monthDay.trim()}, ${year.trim()} - ${time.trim()}`;
}

export function getNumberOfNights(startDate, endDate) {
  const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
  const [eYear, eMonth, eDay] = endDate.split('-').map(Number);

  // force to utc midnight
  const startUTC = Date.UTC(sYear, sMonth - 1, sDay);
  const endUTC = Date.UTC(eYear, eMonth - 1, eDay);

  const differenceInMs = endUTC - startUTC;

  const msInDay = 1000 * 60 * 60 * 24;
  const nights = Math.round(differenceInMs / msInDay);

  return nights > 0 ? nights : 0;
}

export function calculateAge(birthDate) {
  if (!birthDate) return;
  const [year, month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDifference = today.getMonth() - month;

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < day)) {
    age -= 1;
  }

  return age;
}

export function hasBirthdayToday(birthDate) {
  if (!birthDate) return false;
  const [, bMonth, bDay] = birthDate.split('-').map(Number);
  const today = new Date();
  if (today.getDate() === bDay && today.getMonth() + 1 === bMonth) {
    return true;
  }

  return false;
}

export function dateIsSmaller(xDate, yDate) {
  const [xY, xM, xD] = xDate.split('-').map(Number);
  const [yY, yM, yD] = yDate.split('-').map(Number);

  const x = Date.UTC(xY, xM - 1, xD);
  const y = Date.UTC(yY, yM - 1, yD);

  return x <= y;
}

export function toISOStringMidnight(date) {
  const [y, m, d] = date.split('-').map(Number);

  return new Date(y, m - 1, d).toISOString();
}

export function getPastFilterDate(amount, date) {
  const [y, m, d] = date.split('-').map(Number);

  return new Date(y, m - 1, d - amount).toLocaleDateString('sv-SE');
}

export function getWeekday(date) {
  const [y, m, d] = date.split('-').map(Number);
  const weekDay = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
  });
  return weekDay;
}

export function getLastDayOfTheMonth(year, month) {
  // Date month is expected as index... but here we pass the actual month integer
  // getDate returns the last day of this month when you ask for day 0 of next month
  return new Date(Number(year), Number(month), 0).getDate();
}

export function getDateObj(date) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}
