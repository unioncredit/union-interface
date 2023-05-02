import { useNetwork } from "wagmi";
import {
  mainnet,
  arbitrum,
  goerli,
  optimismGoerli,
  optimism,
} from "wagmi/chains";

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
  userManagerContract as OPTIMISM_GOERLI_V2_userManagerContract,
  uTokenContract as OPTIMISM_GOERLI_V2_uTokenContract,
  unionContract as OPTIMISM_GOERLI_V2_unionContract,
  daiContract as OPTIMISM_GOERLI_V2_daiContract,
  comptrollerContract as OPTIMISM_GOERLI_V2_comptrollerContract,
  assetManagerContract as OPTIMISM_GOERLI_V2_assetManagerContract,
  unionLensContract as OPTIMISM_GOERLI_V2_unionLensContract,
  vouchFaucetContract as OPTIMISM_GOERLI_V2_vouchFaucet,
} from "config/contracts/v2/optimismGoerli";

import {
  userManagerContract as MAINNET_userManagerContract,
  uTokenContract as MAINNET_uTokenContract,
  unionContract as MAINNET_unionContract,
  daiContract as MAINNET_daiContract,
  comptrollerContract as MAINNET_comptrollerContract,
  assetManagerContract as MAINNET_assetManagerContract,
  governorContract,
  timelockContract,
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
  userManagerContract as OPTIMISM_V2_userManagerContract,
  uTokenContract as OPTIMISM_V2_uTokenContract,
  unionContract as OPTIMISM_V2_unionContract,
  daiContract as OPTIMISM_V2_daiContract,
  comptrollerContract as OPTIMISM_V2_comptrollerContract,
  assetManagerContract as OPTIMISM_V2_assetManagerContract,
  unionLensContract as OPTIMISM_V2_unionLensContract,
  vouchFaucetContract as OPTIMISM_V2_vouchFaucet,
} from "config/contracts/v2/optimism";

import { getVersion, Versions } from "providers/Version";

export default function useContract(name, chainId, forceVersion) {
  const { chain: connectedChain } = useNetwork();
  const version = getVersion(chainId);

  const v1Contracts = {
    [goerli.id]: {
      userManager: GOERLI_userManagerContract,
      uToken: GOERLI_uTokenContract,
      union: GOERLI_unionContract,
      dai: GOERLI_daiContract,
      comptroller: GOERLI_comptrollerContract,
      assetManager: GOERLI_assetManagerContract,
    },
    [mainnet.id]: {
      governor: governorContract,
      timelock: timelockContract,
      userManager: MAINNET_userManagerContract,
      uToken: MAINNET_uTokenContract,
      union: MAINNET_unionContract,
      dai: MAINNET_daiContract,
      comptroller: MAINNET_comptrollerContract,
      assetManager: MAINNET_assetManagerContract,
    },
    [arbitrum.id]: {
      userManager: ARBITRUM_userManagerContract,
      uToken: ARBITRUM_uTokenContract,
      union: ARBITRUM_unionContract,
      dai: ARBITRUM_daiContract,
      comptroller: ARBITRUM_comptrollerContract,
      assetManager: ARBITRUM_assetManagerContract,
    },
  };

  const v2Contracts = {
    [goerli.id]: {
      userManager: GOERLI_V2_userManagerContract,
      uToken: GOERLI_V2_uTokenContract,
      union: GOERLI_V2_unionContract,
      dai: GOERLI_V2_daiContract,
      comptroller: GOERLI_V2_comptrollerContract,
      assetManager: GOERLI_V2_assetManagerContract,
      unionLens: GOERLI_V2_unionLensContract,
    },
    [optimismGoerli.id]: {
      userManager: OPTIMISM_GOERLI_V2_userManagerContract,
      uToken: OPTIMISM_GOERLI_V2_uTokenContract,
      union: OPTIMISM_GOERLI_V2_unionContract,
      dai: OPTIMISM_GOERLI_V2_daiContract,
      comptroller: OPTIMISM_GOERLI_V2_comptrollerContract,
      assetManager: OPTIMISM_GOERLI_V2_assetManagerContract,
      unionLens: OPTIMISM_GOERLI_V2_unionLensContract,
      vouchFaucet: OPTIMISM_GOERLI_V2_vouchFaucet,
    },
    [optimism.id]: {
      userManager: OPTIMISM_V2_userManagerContract,
      uToken: OPTIMISM_V2_uTokenContract,
      union: OPTIMISM_V2_unionContract,
      dai: OPTIMISM_V2_daiContract,
      comptroller: OPTIMISM_V2_comptrollerContract,
      assetManager: OPTIMISM_V2_assetManagerContract,
      unionLens: OPTIMISM_V2_unionLensContract,
      vouchFaucet: OPTIMISM_V2_vouchFaucet,
    },
  };

  const contracts = {
    [Versions.V1]: v1Contracts,
    [Versions.V2]: v2Contracts,
  };

  return (
    contracts[forceVersion || version]?.[chainId || connectedChain?.id]?.[
      name
    ] || {}
  );
}
