export const getObjectWithNullProperty = <T>(example: T) => (
  propToRemove: keyof T,
): T => ({
  ...example,
  [propToRemove]: null,
});
