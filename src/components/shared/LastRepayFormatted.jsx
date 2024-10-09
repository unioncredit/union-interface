import { useLastRepayData } from "../../hooks/useLastRepayData";
import { BigNumber } from "ethers";
import { ZERO } from "constants";

export const LastRepayFormatted = ({ lastRepay, defaultValue = "-" }) => {
  const { formatted } = useLastRepayData(lastRepay ? BigNumber.from(lastRepay) : ZERO);

  if (!lastRepay) {
    return defaultValue;
  }

  return formatted;
};
