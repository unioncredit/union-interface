import { useContractReads, chain, useNetwork } from "wagmi";
import { createContext, useContext } from "react";

import useContract from "hooks/useContract";
import { ZERO } from "constants";

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

  const chainId = connectedChain?.id || chain.mainnet.id;

  const isMainnet = connectedChain === chain.mainnet.id;

  const daiContract = useContract("dai", chainId);
  const uTokenContract = useContract("uToken", chainId);
  const userManagerContract = useContract("userManager", chainId);
  const comptrollerContract = useContract("comptroller", chainId);
  const governorContract = useContract("governor", chain.mainnet.id);
  const unionTokenContract = useContract("union", chainId);
  const assetManagerContract = useContract("assetManager", chainId);

  const assetManagerCalls = [
    {
      functionName: "getLoanableAmount",
      args: [daiContract.addressOrName],
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
    "accrualBlockNumber",
    "borrowIndex",
    "totalBorrows",
    "totalReserves",
    "totalRedeemable",
    "overdueBlocks",
    "originationFee",
    "debtCeiling",
    "maxBorrow",
    "minBorrow",
    "getRemainingDebtCeiling",
    "borrowRatePerBlock",
    "supplyRatePerBlock",
    "exchangeRateStored",
  ];

  const comptrollerFunctionNames = [
    "halfDecayPoint",
    "gInflationIndex",
    "gLastUpdatedBlock",
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
      inflationPerBlock: data[0],
    }),
    contracts: [
      {
        ...comptrollerContract,
        functionName: "inflationPerBlock",
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
