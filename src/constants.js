import { BigNumber } from "ethers";
import { chain } from "wagmi";

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

export const ContactsType = {
  VOUCHERS: "vouchers",
  VOUCHEES: "vouchees",
};

export const BlockSpeed = {
  [chain.mainnet.id]: 12e3,
  [chain.goerli.id]: 12e3,
};
