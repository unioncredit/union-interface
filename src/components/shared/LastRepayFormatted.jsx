import { useLastRepayData } from "hooks/useLastRepayData";
import { ZERO } from "constants";

export const LastRepayFormatted = ({ lastRepay, defaultValue = "-" }) => {
  const { formatted } = useLastRepayData(lastRepay ? BigInt(lastRepay) : ZERO);

  if (!lastRepay) {
    return defaultValue;
  }

  return formatted;
};
