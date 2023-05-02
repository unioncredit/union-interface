import { useContractReads, useNetwork } from "wagmi";
import { createContext, useContext } from "react";
import { mainnet } from "wagmi/chains";

import useContract from "hooks/useContract";
import { ZERO } from "constants";
import { getVersion, Versions } from "./Version";

const ProtocolContext = createContext({});

export const useProtocol = () => useContext(ProtocolContext);

const buildContractConfigs = (contract, calls, chainId) =>
  calls.map((call) => ({
    ...contract,
    ...call,
    chainId,
  }));

export const useProtocolData = (chainId) => {
  const version = getVersion(chainId);
  const versioned = (v1, v2) => (version === Versions.V1 ? v1 : v2);

  const isMainnet = chainId === mainnet.id;
  const daiContract = useContract("dai", chainId);
  const uTokenContract = useContract("uToken", chainId);
  const userManagerContract = useContract("userManager", chainId);
  const comptrollerContract = useContract("comptroller", chainId);
  const governorContract = useContract("governor", mainnet.id);
  const timelockContract = useContract("timelock", mainnet.id);
  const unionTokenContract = useContract("union", chainId);
  const assetManagerContract = useContract("assetManager", chainId);

  const assetManagerCalls = [
    {
      functionName: "getLoanableAmount",
      args: [daiContract.address],
    },
  ];

  const userManagerFunctionNames = [
    "maxStakeAmount",
    "newMemberFee",
    "totalStaked",
    "totalFrozen",
  ];

  const uTokenFunctionNames = [
    "reserveFactorMantissa",
    versioned("accrualBlockNumber", "accrualTimestamp"),
    "borrowIndex",
    "totalBorrows",
    "totalReserves",
    "totalRedeemable",
    versioned("overdueBlocks", "overdueTime"),
    "originationFee",
    "debtCeiling",
    "maxBorrow",
    "minBorrow",
    "getRemainingDebtCeiling",
    versioned("borrowRatePerBlock", "borrowRatePerSecond"),
    versioned("supplyRatePerBlock", "supplyRatePerSecond"),
    "exchangeRateStored",
  ];

  const comptrollerFunctionNames = [
    "halfDecayPoint",
    "gInflationIndex",
    versioned("gLastUpdatedBlock", "gLastUpdated"),
  ];

  const governorFunctionsNames = [
    "quorumVotes",
    "proposalThreshold",
    "votingDelay",
    "votingPeriod",
  ];

  const timelockFunctionNames = ["getMinDelay"];

  const unionTokenFunctionNames = ["totalSupply"];

  const contracts = [
    ...buildContractConfigs(assetManagerContract, assetManagerCalls, chainId),
    ...buildContractConfigs(
      userManagerContract,
      userManagerFunctionNames.map((n) => ({ functionName: n })),
      chainId
    ),
    ...buildContractConfigs(
      uTokenContract,
      uTokenFunctionNames.map((n) => ({ functionName: n })),
      chainId
    ),
    ...buildContractConfigs(
      comptrollerContract,
      comptrollerFunctionNames.map((n) => ({ functionName: n })),
      chainId
    ),
    ...(isMainnet
      ? buildContractConfigs(
          governorContract,
          governorFunctionsNames.map((n) => ({ functionName: n })),
          mainnet.id
        )
      : []),
    ...(isMainnet
      ? buildContractConfigs(
          timelockContract,
          timelockFunctionNames.map((n) => ({ functionName: n })),
          mainnet.id
        )
      : []),
    ...buildContractConfigs(
      unionTokenContract,
      unionTokenFunctionNames.map((n) => ({ functionName: n })),
      chainId
    ),
  ];

  const resp = useContractReads({
    enabled: true,
    select: (data) =>
      [
        ...assetManagerCalls.map((c) => c.functionName),
        ...userManagerFunctionNames,
        ...uTokenFunctionNames,
        ...comptrollerFunctionNames,
        ...(isMainnet ? governorFunctionsNames : []),
        ...(isMainnet ? timelockFunctionNames : []),
        ...unionTokenFunctionNames,
      ].reduce(
        (acc, functionName, i) => ({ ...acc, [functionName]: data[i] }),
        {}
      ),
    contracts: contracts,
  });

  const { totalStaked = ZERO, totalFrozen = ZERO } = resp.data || {};

  const resp0 = useContractReads({
    enabled: totalStaked.gt(ZERO),
    select: (data) => ({
      inflationPerSecond: data[0],
      inflationPerBlock: data[0],
    }),
    contracts: [
      {
        ...comptrollerContract,
        functionName: versioned("inflationPerBlock", "inflationPerSecond"),
        args: [totalStaked.sub(totalFrozen)],
      },
    ],
  });

  const data = { ...resp.data, ...resp0.data };

  return { data };
};

export default function ProtocolData({ children }) {
  const { chain: connectedChain } = useNetwork();
  const chainId = connectedChain?.id || mainnet.id;

  const { data } = useProtocolData(chainId);

  return (
    <ProtocolContext.Provider value={{ data }}>
      {children}
    </ProtocolContext.Provider>
  );
}
