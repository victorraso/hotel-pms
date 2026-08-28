import camelcaseKeys from 'camelcase-keys';

// if data is an array, call camelcase with a arrow function
//  select: (data) => data.map(toCamelCase),
// if data is an object pass camelcase direct to select in react query
//  select: toCamelCase,
export function toCamelCase(data) {
  return camelcaseKeys(data, { deep: true });
}
