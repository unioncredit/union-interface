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
  address: "0x0e9052bD9a960E8239c9F447334e7Ff5bbbA9c6b",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0xc7709cE40eed5820916855695706Fc3b5e595573",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0x23719ECefD0c3610f7445c0b3a35C2aA15aFF8dB",
  abi: unionAbi,
};

export const usdcContract = {
  address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0xb5eF84A14cbB6a57c8F614A9EFc75DB7855e3ed1",
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0x7fD10B50d620D3D60e125cFcA30EaFc2a565183f",
  abi: assetManagerAbi,
};

export const unionLensContract = {
  address: "0x0204b04bC002399bDCD430F64b569c1FE425321A",
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
