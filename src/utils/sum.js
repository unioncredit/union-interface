export const sumField = (data, field) => {
  return data.reduce((acc, curr) => acc + curr[field], 0);
};
