export function numberToOrdinalWord(int) {
  const ordinals = {
    1: 'First',
    2: 'Second',
    3: 'Third',
    4: 'Fourth',
    5: 'Fifth',
    6: 'Sixth',
    7: 'Seventh',
    8: 'Eighth',
    9: 'Ninth',
    10: 'Tenth',
  };

  return ordinals[int];
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function capitalize(word) {
  const firstLetter = word.slice(0, 1).toUpperCase();
  const rest = word.slice(1);

  return firstLetter + rest;
}
