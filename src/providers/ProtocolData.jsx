import { useContractReads, chain, useNetwork } from "wagmi";
import { createContext, useContext } from "react";

import useContract from "hooks/useContract";
import { ZERO } from "constants";

const ProtocolContext = createContext({});

export const useProtocol = () => useContext(ProtocolContext);

const buildContractConfigs = (contract, functionNames, chainId) =>
  functionNames.map((functionName) => ({
    ...contract,
    functionName,
    chainId,
  }));

export default function ProtcolData({ children }) {
  const { chain: connectedChain } = useNetwork();

  const chainId = connectedChain?.id || chain.mainnet.id;

  const isMainnet = connectedChain === chain.mainnet.id;

  const uTokenContract = useContract("uToken", chainId);
  const userManagerContract = useContract("userManager", chainId);
  const comptrollerContract = useContract("comptroller", chainId);
  const governorContract = useContract("governor", chain.mainnet.id);
  const unionTokenContract = useContract("union", chainId);

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
    ...buildContractConfigs(
      userManagerContract,
      userManagerFunctionNames,
      chainId
    ),
    ...buildContractConfigs(uTokenContract, uTokenFunctionNames, chainId),
    ...buildContractConfigs(
      comptrollerContract,
      comptrollerFunctionNames,
      chainId
    ),
    ...(isMainnet
      ? buildContractConfigs(governorContract, governorFunctionsNames, chainId)
      : []),
    ...buildContractConfigs(
      unionTokenContract,
      unionTokenFunctionNames,
      chainId
    ),
  ];

  const resp = useContractReads({
    enabled: true,
    select: (data) =>
      [
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
