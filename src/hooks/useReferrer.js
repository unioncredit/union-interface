const REFERRER_STORAGE_KEY = "union:referrer";

export default function useReferrer() {
  const setReferrer = (address) => {
    window.localStorage.setItem(REFERRER_STORAGE_KEY, address);
  };

  const getReferrer = () => {
    return window.localStorage.getItem(REFERRER_STORAGE_KEY);
  };

  return { getReferrer, setReferrer };
}
