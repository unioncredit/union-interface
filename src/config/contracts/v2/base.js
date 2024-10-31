import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/v2/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";
import vouchFaucetAbi from "abis/vouchFaucet.json";
import registerHelperAbi from "abis/v2/registerHelper.json";
import referralAbi from "abis/v2/referral.json";

export const userManagerContract = {
  address: "0xfd745A1e2A220C6aC327EC55d2Cb404CD939f56b",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0xc2447f36FfdA08E278D25D08Ea91D942f0C2d6ea",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0x946A2C918F3D928B918C01D813644f27Bcd29D96",
  abi: unionAbi,
};

export const usdcContract = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0x37C092D275E48e3c9001059D9B7d55802CbDbE04",
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0x393d7299c2caA940b777b014a094C3B2ea45ee2B",
  abi: assetManagerAbi,
};

export const unionLensContract = {
  address: "0x97F8903177300aDDF7b92431DE104ce610768B19",
  abi: unionLensAbi,
};

export const vouchFaucetContract = {
  address: "",
  abi: vouchFaucetAbi,
};

export const registerHelperContract = {
  address: "",
  abi: registerHelperAbi,
};

export const referralContract = {
  address: "",
  abi: referralAbi,
};
