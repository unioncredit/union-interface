import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";

export const userManagerContract = {
  addressOrName: "0x55a095033FFECcF4E8f712ebda0850c7f3dF2E25",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x10f35722588571BB109820Be6F515634336512Ec",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0x457E066FC7D6c7567f21Fc96E7a713d02cE58D61",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0xD9662ae38fB577a3F6843b6b8EB5af3410889f3A",
  contractInterface: erc20Abi,
};

export const comptrollerContract = {
  addressOrName: "0x1c970FAC1D3BDcB9Bc984A2f39Df769760AeE0ac",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0x099a2B3f5A62053D6Aa032A9AeC410f7d51713e3",
  contractInterface: assetManagerAbi,
};

export const unionLensContract = {
  addressOrName: "0xE8317d993206d32C2d593AB47c8A920c4863ae4C",
  contractInterface: unionLensAbi,
};
