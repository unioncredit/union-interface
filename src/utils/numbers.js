export const min = (a, b) => {
  return a.gt(b) ? a : b;
};

export const percent = (n) => {
  return `${Math.floor(n * 100)}%`;
};
