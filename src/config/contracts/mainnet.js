import userManagerAbi from "abis/userManager.json";
import uTokenAbi from "abis/uToken.json";
import unionAbi from "abis/union.json";
import erc20Abi from "abis/erc20.json";
import comptrollerAbi from "abis/comptroller.json";
import governorAbi from "abis/governor.json";
import assetManagerAbi from "abis/assetManager.json";
import timelockAbi from "abis/timelock.json";

export const userManagerContract = {
  address: "0x49c910Ba694789B58F53BFF80633f90B8631c195",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0x954F20DF58347b71bbC10c94827bE9EbC8706887",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
  abi: unionAbi,
};

export const daiContract = {
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d",
  abi: comptrollerAbi,
};

export const governorContract = {
  address: "0xe1b3F07a9032F0d3deDf3E96c395A4Da74130f6e",
  abi: governorAbi,
};

export const assetManagerContract = {
  address: "0xb91a874D9AA8fF7E478bA61286ECc77c1A3E384d",
  abi: assetManagerAbi,
};

export const timelockContract = {
  addressOrName: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
  contractInterface: timelockAbi,
};
