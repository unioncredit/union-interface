import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";

export const userManagerContract = {
  addressOrName: "0x72a4E84255322C8852E0424fD2137EA1B4Cda305",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0xc49a11229804ad944F432362802f7959E5d1E590",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0xe8281FdF8945E06C608b1C95D8f6dCEDbf2AC323",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0xD9662ae38fB577a3F6843b6b8EB5af3410889f3A",
  contractInterface: erc20Abi,
};

export const comptrollerContract = {
  addressOrName: "0xab986c3Fd541D80C64B883FC84f82faB20C6D3cd",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0x54fF159764A7B02c1Bff84A1BB889FEDcdBf5aEA",
  contractInterface: assetManagerAbi,
};

export const unionLensContract = {
  addressOrName: "0xD8630Ed4D8cAd86433B291B96A6ff0D1C061E5c3",
  contractInterface: unionLensAbi,
};
