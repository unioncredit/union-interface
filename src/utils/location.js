export const locationSearch = () => {
  return new URLSearchParams(
    window.location.hash.split("?")[1] || location.search
  );
};
