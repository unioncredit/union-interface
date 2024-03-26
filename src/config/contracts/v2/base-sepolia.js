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
  address: "0x4C52c9E49aa6a5029c0F94753c533DFEBcf8AabA",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0x01Cc03de0742dF77b934C3aFA848AE2BB73576Ed",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0xc124047253c87EF90aF9f4EFC12C281b479c4769",
  abi: unionAbi,
};

export const usdcContract = {
  address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0x84CEE16a05C48268724f11512cb405097f96eDB2",
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0x311B84A6ca1196efd1CEc7E4fa09D8C2C171492A",
  abi: assetManagerAbi,
};

export const unionLensContract = {
  address: "0x4c3E0Fa0284f452619ece13dca72904FA3192cD4",
  abi: unionLensAbi,
};

export const vouchFaucetContract = {
  address: "",
  abi: vouchFaucetAbi,
};

export const registerHelperContract = {
  address: "0xcC78D0B12B93c93Ab459b0f304aF24a8E30797D4",
  abi: registerHelperAbi,
};

export const referralContract = {
  address: "0x1fF6c719a652Bb3dF9EE2740fD0E9524dBdd331c",
  abi: referralAbi,
};
