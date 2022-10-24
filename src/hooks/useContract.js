import { chain, useNetwork } from "wagmi";

import {
  userManagerContract as GOERLI_userManagerContract,
  uTokenContract as GOERLI_uTokenContract,
  unionContract as GOERLI_unionContract,
  daiContract as GOERLI_daiContract,
  comptrollerContract as GOERLI_comptrollerContract,
} from "config/contracts/goerli";

import {
  userManagerContract as MAINNET_userManagerContract,
  uTokenContract as MAINNET_uTokenContract,
  unionContract as MAINNET_unionContract,
  daiContract as MAINNET_daiContract,
  comptrollerContract as MAINNET_comptrollerContract,
  governorContract,
} from "config/contracts/mainnet";

import {
  userManagerContract as ARBITRUM_userManagerContract,
  uTokenContract as ARBITRUM_uTokenContract,
  unionContract as ARBITRUM_unionContract,
  daiContract as ARBITRUM_daiContract,
  comptrollerContract as ARBITRUM_comptrollerContract,
} from "config/contracts/arbitrum";

export default function useContract(name) {
  const { chain: connectedChain } = useNetwork();

  return {
    [chain.goerli.id]: {
      userManager: GOERLI_userManagerContract,
      uToken: GOERLI_uTokenContract,
      union: GOERLI_unionContract,
      dai: GOERLI_daiContract,
      comptroller: GOERLI_comptrollerContract,
    },
    [chain.mainnet.id]: {
      governor: governorContract,
      userManager: MAINNET_userManagerContract,
      uToken: MAINNET_uTokenContract,
      union: MAINNET_unionContract,
      dai: MAINNET_daiContract,
      comptroller: MAINNET_comptrollerContract,
    },
    [chain.arbitrum.id]: {
      userManager: ARBITRUM_userManagerContract,
      uToken: ARBITRUM_uTokenContract,
      union: ARBITRUM_unionContract,
      dai: ARBITRUM_daiContract,
      comptroller: ARBITRUM_comptrollerContract,
    },
  }[connectedChain?.id]?.[name];
}
