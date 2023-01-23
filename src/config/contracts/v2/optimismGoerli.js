import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";

export const userManagerContract = {
  addressOrName: "0xcF58844990c95070b08afaE75a9CFf7329C562a8",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x17581B1746ADC0aa6296fE93f70173D5328d1826",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0x23B0483E07196c425d771240E81A9c2f1E113D3A",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0x58069C02723B20412CBF166AbDAeadc6839601C7",
  contractInterface: erc20Abi,
};

export const comptrollerContract = {
  addressOrName: "0x6Db16f22F1396fd433C236368c0918FA7cdC8299",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0xa6E0AfC434008dF17E226318fb49B859216b6cbd",
  contractInterface: assetManagerAbi,
};

export const unionLensContract = {
  addressOrName: "0x80B504Dc3308385cc75A34AA34fd1A2D8AD93dec",
  contractInterface: unionLensAbi,
};
