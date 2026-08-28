export const roomKeys = {
  all: ['rooms'],
  list: () => [...roomKeys.all, 'list'],
  prices: (start, end) => [...roomKeys.all, 'prices', start, end],
  pricesType: (start, end, typeId) => [
    ...roomKeys.all,
    'pricesType',
    start,
    end,
    typeId,
  ],
  blocks: () => [...roomKeys.all, 'blocks'],
  types: () => [...roomKeys.all, 'types'],
  cleaning: () => [...roomKeys.all, 'cleaning'],
};
