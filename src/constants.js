import { BigNumber, ethers } from "ethers";
import { chain } from "wagmi";

export const ZERO = BigNumber.from(0);

export const ZERO_ADDRESS = ethers.constants.AddressZero;

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
  INSUFFICIENT_BALANCE: "Insufficient balance",
  INSUFFICIENT_CREDIT_LIMIT: "Insufficient credit limit",
  MIN_BORROW: "Amount less than minimum borrow",
  ALREADY_DELEGATING: "You are already delegating to this address",
  TRUST_LT_LOCKING: "Trust cannot be less than locking",
};

export const ContactsType = {
  VOUCHERS: "vouchers",
  VOUCHEES: "vouchees",
};

export const BlockSpeed = {
  [chain.mainnet.id]: 12e3,
  [chain.arbitrum.id]: 12e3,
  [chain.goerli.id]: 12e3,
};

export const BlocksPerYear = {
  [chain.mainnet.id]: 2407328,
  [chain.arbitrum.id]: 2407328,
  [chain.goerli.id]: 2407328,
};

export const EIP3770 = {
  [chain.mainnet.id]: "eth",
  [chain.arbitrum.id]: "arb1",
  [chain.goerli.id]: "goe",
};

export const TheGraphUrls = {
  [chain.mainnet.id]:
    "https://api.thegraph.com/subgraphs/name/geraldhost/union",
  [chain.arbitrum.id]:
    "https://api.thegraph.com/subgraphs/name/geraldhost/union-arbitrum",
  [chain.goerli.id]:
    "https://api.thegraph.com/subgraphs/name/geraldhost/union-goerli",
};

export const ProposalState = [
  "pending",
  "active",
  "canceled",
  "defeated",
  "succeeded",
  "queued",
  "expired",
  "executed",
];

export const StatusColorMap = {
  executed: "green",
  active: "purple",
  canceled: "blue",
  defeated: "red",
};

export const TransactionTypes = {
  BORROW: "borrow",
  REPAY: "repay",
  REGISTER: "register",
  CANCEL: "cancel",
  TRUST: "trust",
  TRUSTED: "trusted",
};
