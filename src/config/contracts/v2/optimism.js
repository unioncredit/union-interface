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
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
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
  address: "0x376F47C5966dcDA5c3d54B8cBF8B918777b8FF13",
  abi: unionLensAbi,
};

export const vouchFaucetContract = {
  address: "",
  abi: vouchFaucetAbi,
};

export const registerHelperContract = {
  address: "0x2683666a3004c553b3a40ed13c32678ed11d9b49",
  abi: registerHelperAbi,
};

export const referralContract = {
  address: "0x799FCdDEa2033aaC93AA744ff8AFefe95BC4E5AE",
  abi: referralAbi,
};
