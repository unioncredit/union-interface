import { useNetwork } from "wagmi";
import { arbitrum, mainnet, optimism } from "wagmi/chains";

import {
  assetManagerContract as MAINNET_assetManagerContract,
  comptrollerContract as MAINNET_comptrollerContract,
  daiContract as MAINNET_daiContract,
  governorContract,
  referralContract as MAINNET_referralContract,
  timelockContract,
  unionContract as MAINNET_unionContract,
  userManagerContract as MAINNET_userManagerContract,
  uTokenContract as MAINNET_uTokenContract,
} from "config/contracts/mainnet";

import {
  assetManagerContract as ARBITRUM_assetManagerContract,
  comptrollerContract as ARBITRUM_comptrollerContract,
  daiContract as ARBITRUM_daiContract,
  unionContract as ARBITRUM_unionContract,
  userManagerContract as ARBITRUM_userManagerContract,
  uTokenContract as ARBITRUM_uTokenContract,
} from "config/contracts/arbitrum";

import {
  assetManagerContract as OPTIMISM_V2_assetManagerContract,
  comptrollerContract as OPTIMISM_V2_comptrollerContract,
  daiContract as OPTIMISM_V2_daiContract,
  referralContract as OPTIMISM_V2_referralContract,
  registerHelperContract as OPTIMISM_V2_registerHelperContract,
  unionContract as OPTIMISM_V2_unionContract,
  unionLensContract as OPTIMISM_V2_unionLensContract,
  userManagerContract as OPTIMISM_V2_userManagerContract,
  uTokenContract as OPTIMISM_V2_uTokenContract,
  vouchFaucetContract as OPTIMISM_V2_vouchFaucet,
} from "config/contracts/v2/optimism";

import {
  assetManagerContract as BASE_V2_assetManagerContract,
  comptrollerContract as BASE_V2_comptrollerContract,
  daiContract as BASE_V2_daiContract,
  referralContract as BASE_V2_referralContract,
  registerHelperContract as BASE_V2_registerHelperContract,
  unionContract as BASE_V2_unionContract,
  unionLensContract as BASE_V2_unionLensContract,
  userManagerContract as BASE_V2_userManagerContract,
  uTokenContract as BASE_V2_uTokenContract,
  vouchFaucetContract as BASE_V2_vouchFaucet,
} from "config/contracts/v2/base";

import { useVersion, Versions } from "providers/Version";

export default function useContract(name, chainId, forceVersion) {
  const { chain: connectedChain } = useNetwork();
  const { version } = useVersion();

  const v1Contracts = {
    [mainnet.id]: {
      governor: governorContract,
      timelock: timelockContract,
      userManager: MAINNET_userManagerContract,
      uToken: MAINNET_uTokenContract,
      union: MAINNET_unionContract,
      dai: MAINNET_daiContract,
      comptroller: MAINNET_comptrollerContract,
      assetManager: MAINNET_assetManagerContract,
      referral: MAINNET_referralContract,
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
    [optimism.id]: {
      userManager: OPTIMISM_V2_userManagerContract,
      uToken: OPTIMISM_V2_uTokenContract,
      union: OPTIMISM_V2_unionContract,
      dai: OPTIMISM_V2_daiContract,
      comptroller: OPTIMISM_V2_comptrollerContract,
      assetManager: OPTIMISM_V2_assetManagerContract,
      unionLens: OPTIMISM_V2_unionLensContract,
      vouchFaucet: OPTIMISM_V2_vouchFaucet,
      registerHelper: OPTIMISM_V2_registerHelperContract,
      referral: OPTIMISM_V2_referralContract,
    },
    [8453]: {
      userManager: BASE_V2_userManagerContract,
      uToken: BASE_V2_uTokenContract,
      union: BASE_V2_unionContract,
      usdc: OPTIMISM_V2_daiContract,
      comptroller: BASE_V2_comptrollerContract,
      assetManager: BASE_V2_assetManagerContract,
      unionLens: BASE_V2_unionLensContract,
      vouchFaucet: BASE_V2_vouchFaucet,
      registerHelper: BASE_V2_registerHelperContract,
      referral: BASE_V2_referralContract,
    },
  };

  const contracts = {
    [Versions.V1]: v1Contracts,
    [Versions.V2]: v2Contracts,
  };

  return contracts[forceVersion || version]?.[chainId || connectedChain?.id]?.[name] || {};
}
