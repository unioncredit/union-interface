import assetManagerAbi from "abis/assetManager.json";
import bridgedTokenAbi from "abis/bridgedToken.json";
import comptrollerAbi from "abis/comptroller.json";
import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import userManagerAbi from "abis/userManager.json";
import uTokenAbi from "abis/uToken.json";

export const userManagerContract = {
  address: "0xb71F3D4342AaE0b8D531E14D2CF2F45d6e458A5F",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0x954F20DF58347b71bbC10c94827bE9EbC8706887",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
  abi: unionAbi,
};

export const daiContract = {
  address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0x641DD6258cb3E948121B10ee51594Dc2A8549fe1",
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0x7Aecd107Cb022e1DFd42cC43E9BA94C38BC83275",
  abi: assetManagerAbi,
};

export const bridgedTokenContract = {
  addressOrName: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
  contractInterface: bridgedTokenAbi,
};
