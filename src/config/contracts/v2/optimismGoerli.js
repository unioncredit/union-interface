import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";

export const userManagerContract = {
  addressOrName: "0x52A2b6BEE1f7Dd4EE48F27C0cAbb9B4A45b2D82d",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x95b43b1555653C721aE1FA22d8B6fF1348d9eF33",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0x23B0483E07196c425d771240E81A9c2f1E113D3A",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0xD9662ae38fB577a3F6843b6b8EB5af3410889f3A",
  contractInterface: erc20Abi,
};

export const comptrollerContract = {
  addressOrName: "0x6566F38714A75728Daa510EC16571ccD6bCe116b",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0x58806A562589350CEb762F0bfa0BfeFA77f34918",
  contractInterface: assetManagerAbi,
};

export const unionLensContract = {
  addressOrName: "0xE8317d993206d32C2d593AB47c8A920c4863ae4C",
  contractInterface: unionLensAbi,
};
