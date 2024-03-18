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
  address: "0x8E195D65b9932185Fcc76dB5144534e0f3597628",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0xE478b5e7A423d7CDb224692d0a816CA146A744b2",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0xB025ee78b54B5348BD638Fe4a6D77Ec2F813f4f9",
  abi: unionAbi,
};

export const daiContract = {
  address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0x06a31efa04453C5F9C0A711Cdb96075308C9d6E3",
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0xE4ADdfdf5641EB4e15F60a81F63CEd4884B49823",
  abi: assetManagerAbi,
};

export const unionLensContract = {
  address: "0xF440eC63091A5cdaff6f8dE19CFcD2b25DE01232",
  abi: unionLensAbi,
};

export const vouchFaucetContract = {
  address: "",
  abi: vouchFaucetAbi,
};

export const registerHelperContract = {
  address: "0x4869F1d15772062Dc798bC0CB9A0D97c4e317688",
  abi: registerHelperAbi,
};

export const referralContract = {
  address: "0xf883722137ECD83a6DB0407D8c1111F4e9950102",
  abi: referralAbi,
};
