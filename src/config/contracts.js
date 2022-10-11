import userManagerAbi from "abis/userManager.json";
import uTokenAbi from "abis/uToken.json";
import unionAbi from "abis/union.json";
import erc20Abi from "abis/erc20.json";

export const userManagerContract = {
  addressOrName: "0x49c910Ba694789B58F53BFF80633f90B8631c195",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x954F20DF58347b71bbC10c94827bE9EbC8706887",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0x6b175474e89094c44da98b954eedeac495271d0f",
  contractInterface: erc20Abi,
};
