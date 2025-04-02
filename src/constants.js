import { Versions } from "providers/Version";
import { arbitrum, mainnet, optimism } from "wagmi/chains";
import format from "utils/format";
import { base } from "viem/chains";
import { zeroAddress } from "viem";

export const ZERO = 0n;

export const ZERO_ADDRESS = zeroAddress;

export const rpcChains = [base, mainnet, optimism];

const RPCS = {
  [base.id]: "https://base-mainnet.g.alchemy.com/v2",
  [mainnet.id]: "https://eth-mainnet.g.alchemy.com/v2",
  [optimism.id]: "https://opt-mainnet.g.alchemy.com/v2",
};

// eslint-disable-next-line no-undef
export const RPC_URL = (chainId) => `${RPCS[chainId]}/${process.env.REACT_APP_ALCHEMY_ID}`;

export const TOKENS = {
  DAI: "DAI",
  USDC: "USDC",
  UNION: "UNION",
};

export const WAD = {
  DAI: BigInt("1000000000000000000"),
  UNION: BigInt("1000000000000000000"),
  USDC: BigInt("1000000"),
};

export const UNIT = {
  DAI: 18,
  UNION: 18,
  USDC: 6,
};

export const CACHE_TIME = 60_000 * 30; // 30 minutes

export const STALE_TIME = 60_000 * 2; // 2 minutes

export const DUST_THRESHOLD = {
  DAI: 10000000000000000n,
  UNION: 10000000000000000,
  USDC: 10000n,
};

export const SECONDS_PER_HOUR = 3600;

export const SECONDS_PER_DAY = 86400;

export const SECONDS_PER_YEAR = 31540000;

export const LEADERBOARD_PAGE_SIZE = 15;

export const DataApiNetworks = {
  [mainnet.id]: "mainnet",
  [optimism.id]: "optimism-mainnet",
  [arbitrum.id]: "arbitrum-mainnet",
  [base.id]: "base-mainnet",
};

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
  MIN_STAKE_LIMIT_REQUIRED: (token) => `Deposit size must be at least 1 ${token}`,
  MAX_STAKE_LIMIT_EXCEEDED: "Deposit size exceeds staking limit",
  INVALID_ADDRESS_OR_ENS: "Invalid address or ENS",
  INSUFFICIENT_BALANCE: "Insufficient balance",
  INSUFFICIENT_CREDIT_LIMIT: "Insufficient credit limit",
  INSUFFICIENT_FUNDS: "Insufficient funds in protocol",
  MIN_BORROW: (amount, token) => `Amount less than minimum borrow (${format(amount, token)})`,
  ALREADY_DELEGATING: "You are already delegating to this address",
  TRUST_LT_LOCKING: "Trust cannot be less than the locked stake",
  EXCEEDED_LOCK: "Amount exceeded locked value",
  IS_OVERDUE: "You cannot borrow with an overdue balance",
};

export const ContactsType = {
  VOUCHERS: "vouchers",
  VOUCHEES: "vouchees",
};

export const PaymentUnitSpeed = {
  [mainnet.id]: 12000n, // block
  [arbitrum.id]: 12000n, // block
  [optimism.id]: 1000n, // second
  [base.id]: 1000n, // second
  [84532]: 1000n, // second
};

export const PaymentUnitsPerYear = {
  [mainnet.id]: 2628333n,
  [arbitrum.id]: 2628333n,
  [optimism.id]: 31540000n,
  [base.id]: 31540000n,
  [84532]: 31540000n,
};

export const EIP3770 = {
  [mainnet.id]: "eth",
  [arbitrum.id]: "arb1",
  [optimism.id]: "opt",
  [base.id]: "base",
  [84532]: "basesep",
};

export const EIP3770Map = {
  eth: mainnet.id,
  arb1: arbitrum.id,
  opt: optimism.id,
  base: base.id,
  basesep: 84532,
};

export const TheGraphUrls = {
  [Versions.V1]: {
    [mainnet.id]: "https://api.studio.thegraph.com/query/78581/union-v1-mainnet/version/latest",
    [arbitrum.id]: "https://api.studio.thegraph.com/query/78581/union-v1-arbitrum/version/latest",
  },
  [Versions.V2]: {
    [optimism.id]: "https://api.studio.thegraph.com/query/78581/union-finance/version/latest",
    [base.id]: "https://api.studio.thegraph.com/query/78581/union-v2-base/version/latest",
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
};

export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
};

export const AddressEnsMappings = {
  "0x4c7768794f38096b8977c7a9e64b85dd63031d27": "CreditCub.Club",
  "0x87349040756ed552f3ba7e2fcc3d11ec66475156": "CreditClub",
};

export const AddressAvatarMappings = {
  "0x4c7768794f38096b8977c7a9e64b85dd63031d27": "https://euc.li/creditcub.eth",
  "0x87349040756ed552f3ba7e2fcc3d11ec66475156": "https://creditclub.cc/glasses.png",
};

export const MOGO_NFT_URLS = {
  [optimism.id]:
    "https://zora.co/collect/oeth:0xa73be24fb5df82f45c5848f099451b5bea427474/2?referrer=0x729dF3924822C9a2CA1995c05Eb801A395329F35",
  [base.id]:
    "https://zora.co/collect/base:0x29037e1db01e9ac6607ae2af4e830090276c0b64/3?referrer=0x729df3924822c9a2ca1995c05eb801a395329f35",
};
