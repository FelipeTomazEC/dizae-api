export const removeAdditionalSpaces = (str: string): string =>
  str.trim().replace(/\s+/g, ' ');
