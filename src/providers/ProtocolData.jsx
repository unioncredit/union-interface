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

  const comptrollerFunctioNames = [
    "halfDecayPoint",
    "gInflationIndex",
    "gLastUpdatedBlock",
  ];

  const contracts = [
    ...buildContractConfigs(userManagerContract, userManagerFunctionNames),
    ...buildContractConfigs(uTokenContract, uTokenFunctionNames),
    ...buildContractConfigs(comptrollerContract, comptrollerFunctioNames),
  ];

  const selectData = (data) =>
    [
      ...userManagerFunctionNames,
      ...uTokenFunctionNames,
      ...comptrollerFunctioNames,
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
