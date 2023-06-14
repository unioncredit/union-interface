import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";

export const userManagerContract = {
  addressOrName: "0x250dbBf86B61A967Be8cF12f180252bD79af52F3",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x95bBE7c4Bb22d324DBf333627Caf2F93983295a8",
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
  addressOrName: "0xE29229a88f6Bb6CfD3aec5C4722aEa8A799Be32d",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0xd55021755710A79fAaC76Ca0c72b0dEF95C53b03",
  contractInterface: assetManagerAbi,
};

export const unionLensContract = {
  addressOrName: "0x13B6dd0f167fC7C2302D4E847D43beAea2074Cd3",
  contractInterface: unionLensAbi,
};
