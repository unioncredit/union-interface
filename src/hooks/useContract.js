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
  userManagerContract as GOERLI_V2_userManagerContract,
  uTokenContract as GOERLI_V2_uTokenContract,
  unionContract as GOERLI_V2_unionContract,
  daiContract as GOERLI_V2_daiContract,
  comptrollerContract as GOERLI_V2_comptrollerContract,
  assetManagerContract as GOERLI_V2_assetManagerContract,
  unionLensContract as GOERLI_V2_unionLensContract,
} from "config/contracts/v2/goerli";

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

import { useVersion, Versions } from "providers/Version";

export default function useContract(name, chainId) {
  const { chain: connectedChain } = useNetwork();
  const { version } = useVersion();

  const v1Contracts = {
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
  };

  const v2Contracts = {
    [chain.goerli.id]: {
      userManager: GOERLI_V2_userManagerContract,
      uToken: GOERLI_V2_uTokenContract,
      union: GOERLI_V2_unionContract,
      dai: GOERLI_V2_daiContract,
      comptroller: GOERLI_V2_comptrollerContract,
      assetManager: GOERLI_V2_assetManagerContract,
      unionLens: GOERLI_V2_unionLensContract,
    },
  };

  const contracts = {
    [Versions.V1]: v1Contracts,
    [Versions.V2]: v2Contracts,
  };

  return contracts[version]?.[chainId || connectedChain?.id]?.[name] || {};
}
