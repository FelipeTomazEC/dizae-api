export const generateRandomCollection = <T>(
  generateFn: () => T,
  maxSize = 1000,
): T[] => {
  const collectionSize = Math.floor(1 + Math.random() * maxSize);
  return new Array(collectionSize).fill(1).map(() => generateFn());
};
