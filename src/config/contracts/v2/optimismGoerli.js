import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/v2/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";
import vouchFaucetAbi from "abis/vouchFaucet.json";
import registerHelperAbi from "abis/v2/registerHelper.json";

export const userManagerContract = {
  address: "0xe2732f6E7306908697D111A53806C5883eaf0fc5",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0xDe16E91e6EF17D29F4f5e6DAA5E7827A3CaA6F29",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0xa5DaCCAf7E72Be629fc0F52cD55d500Fd6fa7677",
  abi: unionAbi,
};

export const daiContract = {
  address: "0xD9662ae38fB577a3F6843b6b8EB5af3410889f3A",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0x4A89d70e17F9e765077dfF246c84B47c1181c473",
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0x8E92930536764DF03ee26079e8D8A57a9f3a833b",
  abi: assetManagerAbi,
};

export const unionLensContract = {
  address: "0x680A9943A5EB8371986cd6E6F4E14c61A305A672",
  abi: unionLensAbi,
};

export const vouchFaucetContract = {
  address: "",
  abi: vouchFaucetAbi,
};

export const registerHelperContract = {
  address: "0x5F7c58fB44f7C94c68EF4102780cab913C16b302",
  abi: registerHelperAbi,
};
