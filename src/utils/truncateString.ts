export const truncateString = (string = '', maxLength = 34) =>
  string.length > maxLength ? `${string.substring(0, maxLength)}…` : string;
