import { useContractReads, chain, useNetwork } from "wagmi";
import { createContext, useContext } from "react";

import useContract from "hooks/useContract";
import { ZERO } from "constants";

const ProtocolContext = createContext({});

export const useProtocol = () => useContext(ProtocolContext);

const buildContractConfigs = (contract, functionNames) =>
  functionNames.map((functionName) => ({
    ...contract,
    functionName,
  }));

export default function ProtcolData({ children }) {
  const { chain: connectedChain } = useNetwork();

  const uTokenContract = useContract("uToken");
  const userManagerContract = useContract("userManager");
  const comptrollerContract = useContract("comptroller");
  const governorContract = useContract("governor", chain.mainnet.id);
  const unionTokenContract = useContract("union");

  const isMainnet = connectedChain === chain.mainnet.id;

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
    ...buildContractConfigs(userManagerContract, userManagerFunctionNames),
    ...buildContractConfigs(uTokenContract, uTokenFunctionNames),
    ...buildContractConfigs(comptrollerContract, comptrollerFunctionNames),
    ...(isMainnet
      ? buildContractConfigs(governorContract, governorFunctionsNames)
      : []),
    ...buildContractConfigs(unionTokenContract, unionTokenFunctionNames),
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

  const { totalStaked = ZERO, totalFrozen = ZERO } = resp.data;

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
