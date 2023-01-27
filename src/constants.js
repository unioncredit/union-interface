import { BigNumber, ethers } from "ethers";
import { Versions } from "providers/Version";
import { chain } from "wagmi";
import format from "./utils/format";

export const ZERO = BigNumber.from(0);

export const ZERO_ADDRESS = ethers.constants.AddressZero;

export const WAD = BigNumber.from("1000000000000000000");

export const CACHE_TIME = 60_000 * 5; // 5 minutes

export const STALE_TIME = 30_000; // 30 seconds

export const DUST_THRESHOLD = "10000000000000000";

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
  MAX_USER_UNSTAKE: "Max withdrawable exceeded",
  INVALID_ADDRESS_OR_ENS: "Invalid address or ENS",
  INSUFFICIENT_BALANCE: "Insufficient balance",
  INSUFFICIENT_CREDIT_LIMIT: "Insufficient credit limit",
  MIN_BORROW: (amount) => `Amount less than minimum borrow (${format(amount)})`,
  ALREADY_DELEGATING: "You are already delegating to this address",
  TRUST_LT_LOCKING: "Trust cannot be less than locking",
  EXCEEDED_LOCK: "Amount exceeded locked value",
  IS_OVERDUE: "You cannot borrow with an overdue balance",
};

export const ContactsType = {
  VOUCHERS: "vouchers",
  VOUCHEES: "vouchees",
};

export const BlockSpeed = {
  [chain.mainnet.id]: 12e3,
  [chain.arbitrum.id]: 12e3,
  [chain.goerli.id]: 12e3,
  [chain.optimismGoerli.id]: 12e3,
};

export const BlocksPerYear = {
  [chain.mainnet.id]: 2407328,
  [chain.arbitrum.id]: 2407328,
  [chain.goerli.id]: 2407328,
  [chain.optimismGoerli.id]: 2407328,
};

export const EIP3770 = {
  [chain.mainnet.id]: "eth",
  [chain.arbitrum.id]: "arb1",
  [chain.goerli.id]: "goe",
  [chain.optimismGoerli.id]: "optgoe",
};

export const EIP3770Map = {
  eth: chain.mainnet.id,
  arb1: chain.arbitrum.id,
  goe: chain.goerli.id,
  optgoe: chain.optimismGoerli.id,
};

export const TheGraphUrls = {
  [Versions.V1]: {
    [chain.mainnet.id]:
      "https://api.thegraph.com/subgraphs/name/geraldhost/union",
    [chain.arbitrum.id]:
      "https://api.thegraph.com/subgraphs/name/geraldhost/union-arbitrum",
    [chain.goerli.id]:
      "https://api.thegraph.com/subgraphs/name/geraldhost/union-goerli",
  },
  [Versions.V2]: {
    [chain.optimismGoerli.id]:
      "https://api.thegraph.com/subgraphs/name/geraldhost/union-v2-goerli",
  },
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
