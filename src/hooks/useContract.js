import { chain, useNetwork } from "wagmi";

import {
  userManagerContract as GOERLI_userManagerContract,
  uTokenContract as GOERLI_uTokenContract,
  unionContract as GOERLI_unionContract,
  daiContract as GOERLI_daiContract,
  comptrollerContract as GOERLI_comptrollerContract,
  assetManagerContract as GOERLI_assetManagerContract,
} from "config/contracts/goerli";

import {
  userManagerContract as MAINNET_userManagerContract,
  uTokenContract as MAINNET_uTokenContract,
  unionContract as MAINNET_unionContract,
  daiContract as MAINNET_daiContract,
  comptrollerContract as MAINNET_comptrollerContract,
  assetManagerContract as MAINNET_assetManagerContract,
  governorContract,
} from "config/contracts/mainnet";

import {
  userManagerContract as ARBITRUM_userManagerContract,
  uTokenContract as ARBITRUM_uTokenContract,
  unionContract as ARBITRUM_unionContract,
  daiContract as ARBITRUM_daiContract,
  comptrollerContract as ARBITRUM_comptrollerContract,
  assetManagerContract as ARBITRUM_assetManagerContract,
} from "config/contracts/arbitrum";

import {
  userManagerContract as OPTIMISM_GOERLI_userManagerContract,
  uTokenContract as OPTIMISM_GOERLI_uTokenContract,
  unionContract as OPTIMISM_GOERLI_unionContract,
  daiContract as OPTIMISM_GOERLI_daiContract,
  comptrollerContract as OPTIMISM_GOERLI_comptrollerContract,
  assetManagerContract as OPTIMISM_GOERLI_assetManagerContract,
} from "config/contracts/optimismGoerli";

export default function useContract(name, chainId) {
  const { chain: connectedChain } = useNetwork();

  return {
    [chain.goerli.id]: {
      userManager: GOERLI_userManagerContract,
      uToken: GOERLI_uTokenContract,
      union: GOERLI_unionContract,
      dai: GOERLI_daiContract,
      comptroller: GOERLI_comptrollerContract,
      assetManager: GOERLI_assetManagerContract,
    },
    [chain.mainnet.id]: {
      governor: governorContract,
      userManager: MAINNET_userManagerContract,
      uToken: MAINNET_uTokenContract,
      union: MAINNET_unionContract,
      dai: MAINNET_daiContract,
      comptroller: MAINNET_comptrollerContract,
      assetManager: MAINNET_assetManagerContract,
    },
    [chain.arbitrum.id]: {
      userManager: ARBITRUM_userManagerContract,
      uToken: ARBITRUM_uTokenContract,
      union: ARBITRUM_unionContract,
      dai: ARBITRUM_daiContract,
      comptroller: ARBITRUM_comptrollerContract,
      assetManager: ARBITRUM_assetManagerContract,
    },
    [chain.optimismGoerli.id]: {
      userManager: OPTIMISM_GOERLI_userManagerContract,
      uToken: OPTIMISM_GOERLI_uTokenContract,
      union: OPTIMISM_GOERLI_unionContract,
      dai: OPTIMISM_GOERLI_daiContract,
      comptroller: OPTIMISM_GOERLI_comptrollerContract,
      assetManager: OPTIMISM_GOERLI_assetManagerContract,
    },
  }[chainId || connectedChain?.id]?.[name];
}
