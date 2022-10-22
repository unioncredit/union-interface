import userManagerAbi from "abis/userManager.json";
import uTokenAbi from "abis/uToken.json";
import unionAbi from "abis/union.json";
import erc20Abi from "abis/erc20.json";
import comptrollerAbi from "abis/comptroller.json";

export const userManagerContract = {
  addressOrName: "0xb71F3D4342AaE0b8D531E14D2CF2F45d6e458A5F",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x954F20DF58347b71bbC10c94827bE9EbC8706887",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
  contractInterface: erc20Abi,
};

export const comptrollerContract = {
  addressOrName: "0x641DD6258cb3E948121B10ee51594Dc2A8549fe1",
  contractInterface: comptrollerAbi,
};
