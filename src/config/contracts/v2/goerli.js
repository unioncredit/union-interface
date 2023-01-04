import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";

export const userManagerContract = {
  addressOrName: "0x0c9ba300e6cDD6AEbc4ED3Fd853585cE49d980ad",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x3EE494a1819f423b1d0f43d8F287E32c728e341b",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0x23B0483E07196c425d771240E81A9c2f1E113D3A",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464",
  contractInterface: erc20Abi,
};

export const comptrollerContract = {
  addressOrName: "0x3bcCFDE99f71e8FFE6b315148eB4E18825688280",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0xd4B3b203D408484af86A698E91587387E3770892",
  contractInterface: assetManagerAbi,
};

export const unionLens = {
  addressOrName: "",
  contractInterface: unionLensAbi,
};
