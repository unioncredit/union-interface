import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";

export const userManagerContract = {
  addressOrName: "0x2735f7f27ab27242203665D014FEBD3748CEEDEd",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x146C98A62aAaf96A7051c5828b4c12D9c7B7DDa1",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0x04622FDe6a7C0B19Ff7748eC8882870367530074",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0xD9BB4C7B03C403ece2FeC5B9d188359CE310393D",
  contractInterface: erc20Abi,
};

export const comptrollerContract = {
  addressOrName: "0x628F018Dc633557a4B2e27325041a58CD49c47A8",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0x79f3AD63E9016eD7b0FB7153509C4CaCba4812D9",
  contractInterface: assetManagerAbi,
};

export const unionLensContract = {
  addressOrName: "0x73DEE12FC768Bba7d94906b7e66D31cC206AaaE1",
  contractInterface: unionLensAbi,
};
