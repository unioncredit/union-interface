import { useContractReads, useNetwork } from "wagmi";
import { createContext, useContext } from "react";
import { mainnet } from "wagmi/chains";

import useContract from "hooks/useContract";
import { ZERO } from "constants";
import { Versions } from "./Version";

const ProtocolContext = createContext({});

export const useProtocol = () => useContext(ProtocolContext);

const buildContractConfigs = (contract, calls, chainId) =>
  calls.map((call) => ({
    ...contract,
    ...call,
    chainId,
  }));

export default function ProtcolData({ children }) {
  const { chain: connectedChain } = useNetwork();

  const chainId = connectedChain?.id || mainnet.id;

  const isMainnet = connectedChain === mainnet.id;

  const daiContract = useContract("dai", chainId);
  const uTokenContract = useContract("uToken", chainId);
  const userManagerContract = useContract("userManager", chainId);
  const comptrollerContract = useContract("comptroller", chainId);
  const governorContract = useContract("governor", mainnet.id, Versions.V1);
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
    "accrualTimestamp",
    "borrowIndex",
    "totalBorrows",
    "totalReserves",
    "totalRedeemable",
    "overdueTime",
    "originationFee",
    "debtCeiling",
    "maxBorrow",
    "minBorrow",
    "getRemainingDebtCeiling",
    "borrowRatePerSecond",
    "supplyRatePerSecond",
    "exchangeRateStored",
  ];

  const comptrollerFunctionNames = [
    "halfDecayPoint",
    "gInflationIndex",
    "gLastUpdated",
  ];

  const governorFunctionsNames = ["quorumVotes"];

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
          chainId
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
    }),
    contracts: [
      {
        ...comptrollerContract,
        functionName: "inflationPerSecond",
        args: [totalStaked.sub(totalFrozen)],
      },
    ],
  });

  const data = { ...resp.data, ...resp0.data };

  return (
    <ProtocolContext.Provider value={{ ...resp, data }}>
      {children}
    </ProtocolContext.Provider>
  );
}
