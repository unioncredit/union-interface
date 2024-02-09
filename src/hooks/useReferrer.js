import { useEffect, useState } from "react";
import { isAddress } from "ethers/lib/utils";

const REFERRER_STORAGE_KEY = "union:referrer";

export default function useReferrer() {
  const [referrer, setReferrer] = useState(window.localStorage.getItem(REFERRER_STORAGE_KEY));

  useEffect(() => {
    referrer && setStorageReferrer(referrer);
  }, [referrer]);

  const set = (referrerAddress) => {
    if (isAddress(referrerAddress) && referrerAddress !== referrer) {
      setReferrer(referrerAddress);
    }
  };

  const setStorageReferrer = (address) => {
    window.localStorage.setItem(REFERRER_STORAGE_KEY, address);
  };

  return { referrer, set };
}
