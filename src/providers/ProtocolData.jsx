import { useContractReads } from "wagmi";
import { createContext, useContext } from "react";

import useContract from "hooks/useContract";

const ProtocolContext = createContext({});

export const useProtocol = () => useContext(ProtocolContext);

const buildContractConfigs = (contract, functionNames) =>
  functionNames.map((functionName) => ({
    ...contract,
    functionName,
  }));

export default function ProtcolData({ children }) {
  const uTokenContract = useContract("uToken");
  const userManagerContract = useContract("userManager");
  const comptrollerContract = useContract("comptroller");
  const governorContract = useContract("governor");
  const unionTokenContract = useContract("union");

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
    ...buildContractConfigs(governorContract, governorFunctionsNames),
    ...buildContractConfigs(unionTokenContract, unionTokenFunctionNames),
  ];

  const selectData = (data) =>
    [
      ...userManagerFunctionNames,
      ...uTokenFunctionNames,
      ...comptrollerFunctionNames,
      ...governorFunctionsNames,
      ...unionTokenFunctionNames,
    ].reduce(
      (acc, functionName, i) => ({ ...acc, [functionName]: data[i] }),
      {}
    );

  const resp = useContractReads({
    enabled: true,
    select: selectData,
    contracts: contracts,
  });

  return (
    <ProtocolContext.Provider value={resp}>{children}</ProtocolContext.Provider>
  );
}
