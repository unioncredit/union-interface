import { BigNumber } from "ethers";

export const ZERO = BigNumber.from(0);

export const WAD = BigNumber.from("1000000000000000000");

export const StakeType = {
  STAKE: "stake",
  UNSTAKE: "unstake",
};

export const Status = {
  SUCCESS: "success",
  FAILED: "error",
  PENDING: "pending",
};

export const Errors = {
  MAX_USER_STAKE: "Max stake exceeded",
  INVALID_ADDRESS_OR_ENS: "Invalid address or ENS",
};
