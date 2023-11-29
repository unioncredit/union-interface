import { BigNumber, ethers } from "ethers";
import { Versions } from "providers/Version";
import { mainnet, arbitrum, goerli, optimismGoerli, optimism } from "wagmi/chains";
import format from "./utils/format";

export const ZERO = BigNumber.from(0);

export const ZERO_ADDRESS = ethers.constants.AddressZero;

export const WAD = BigNumber.from("1000000000000000000");

export const CACHE_TIME = 60_000 * 5; // 5 minutes

export const STALE_TIME = 30_000; // 30 seconds

export const DUST_THRESHOLD = "10000000000000000";

export const SECONDS_PER_HOUR = 3600;

export const SECONDS_PER_DAY = 86400;

export const SECONDS_PER_YEAR = 31540000;

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
  MAX_USER_BALANCE_EXCEEDED: "Amount entered exceeds available balance",
  MIN_STAKE_LIMIT_REQUIRED: "Deposit size must be at least 1 DAI",
  MAX_STAKE_LIMIT_EXCEEDED: "Deposit size exceeds staking limit",
  INVALID_ADDRESS_OR_ENS: "Invalid address or ENS",
  INSUFFICIENT_BALANCE: "Insufficient balance",
  INSUFFICIENT_CREDIT_LIMIT: "Insufficient credit limit",
  INSUFFICIENT_FUNDS: "Insufficient funds in protocol",
  MIN_BORROW: (amount) => `Amount less than minimum borrow (${format(amount)})`,
  ALREADY_DELEGATING: "You are already delegating to this address",
  TRUST_LT_LOCKING: "Trust cannot be less than the locked stake",
  EXCEEDED_LOCK: "Amount exceeded locked value",
  IS_OVERDUE: "You cannot borrow with an overdue balance",
};

export const ContactsType = {
  VOUCHERS: "vouchers",
  VOUCHEES: "vouchees",
};

export const BlockSpeed = {
  [mainnet.id]: 12e3,
  [arbitrum.id]: 12e3,
  [goerli.id]: 12e3,
  [optimismGoerli.id]: 1e3,
  [optimism.id]: 1e3,
};

export const BlocksPerYear = {
  [mainnet.id]: 2628333,
  [arbitrum.id]: 2628333,
  [goerli.id]: 2407328,
  [optimismGoerli.id]: 31540000,
  [optimism.id]: 31540000,
};

export const EIP3770 = {
  [mainnet.id]: "eth",
  [arbitrum.id]: "arb1",
  [goerli.id]: "goe",
  [optimismGoerli.id]: "optgoe",
  [optimism.id]: "opt",
};

export const EIP3770Map = {
  eth: mainnet.id,
  arb1: arbitrum.id,
  goe: goerli.id,
  optgoe: optimismGoerli.id,
};

export const TheGraphUrls = {
  [Versions.V1]: {
    [mainnet.id]: "https://api.thegraph.com/subgraphs/name/geraldhost/union",
    [arbitrum.id]: "https://api.thegraph.com/subgraphs/name/geraldhost/union-arbitrum",
    [goerli.id]: "https://api.thegraph.com/subgraphs/name/geraldhost/union-goerli",
  },
  [Versions.V2]: {
    [optimismGoerli.id]: "https://api.thegraph.com/subgraphs/name/geraldhost/union-v2-goerli",
    [optimism.id]: "https://api.thegraph.com/subgraphs/name/geraldhost/union-optimism",
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
  active: "blue",
  canceled: "purple",
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

export const MultiStep = {
  SELECTED: "selected",
  PENDING: "pending",
  COMPLETE: "complete",
};

export const Links = {
  CREDIT: "/",
  STAKE: "/stake",
  CONTACTS: "/contacts/providing",
  GOVERNANCE: "/governance",
  PROTOCOL: "/protocol",
  LEADERBOARD: "/leaderboard",
};

export const SortOrder = {
  ASC: "ascending",
  DESC: "descending",
};
