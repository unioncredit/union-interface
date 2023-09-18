import erc20Abi from "abis/erc20.json";
import unionAbi from "abis/union.json";
import comptrollerAbi from "abis/v2/comptroller.json";
import assetManagerAbi from "abis/assetManager.json";
import uTokenAbi from "abis/v2/uToken.json";
import userManagerAbi from "abis/v2/userManager.json";
import unionLensAbi from "abis/v2/unionLens.json";
import vouchFaucetAbi from "abis/vouchFaucet.json";
import vouchNoteAbi from "abis/v2/vouchNote.json";

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

export const vouchNoteContract = {
  address: "0xE7d93b94eAC2d3E49bFcc222d07a39e44EbBe934",
  abi: vouchNoteAbi,
};
