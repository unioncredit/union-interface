import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";
import vouchFaucetAbi from "abis/vouchFaucet.json";

export const userManagerContract = {
  address: "0xC3DAd06E1459aB76a29Cc52aA831B0cE68d53B8b",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0xd559c581cbA5Eb2bA463c17C7E6243894eb17719",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0xfa6C3cF088Cc770a05773a5d294aa75b9fdFCEf5",
  abi: unionAbi,
};

export const daiContract = {
  address: "0xD9662ae38fB577a3F6843b6b8EB5af3410889f3A",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0xFBE7b0A8D6788B6293376d6B4d31A4c836fED34B",
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0x380f21267C0c0D62619d0b211191654F7201eD47",
  abi: assetManagerAbi,
};

export const unionLensContract = {
  address: "0x5386c7858a70E75E9f86b330F3DA8FFd64ffA6D1",
  abi: unionLensAbi,
};

export const vouchFaucetContract = {
  address: "0x411149bC2d8B302EE9d1D55AC2Df1c1EC9e6D3fA",
  abi: vouchFaucetAbi,
};
