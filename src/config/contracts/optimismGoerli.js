import userManagerAbi from "abis/userManager.json";
import uTokenAbi from "abis/uToken.json";
import unionAbi from "abis/union.json";
import erc20Abi from "abis/erc20.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "../../abis/assetManager.json";

export const userManagerContract = {
  addressOrName: "0x61a6bFFe25c95F8A83d71092B034C6394809d24E",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0x1D8387571C1ab244620eC4033354062c7ACB48D2",
  contractInterface: uTokenAbi,
};

export const unionContract = {
  addressOrName: "0xc631196327736c7830b05d566F5F8dB5Deb3e286",
  contractInterface: unionAbi,
};

export const daiContract = {
  addressOrName: "0xD9662ae38fB577a3F6843b6b8EB5af3410889f3A",
  contractInterface: erc20Abi,
};

export const comptrollerContract = {
  addressOrName: "0xB53079F13BadF1B587fC2dd6eFF95eD37C4C1F0e",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0x96755fBacDC468Fc339e88B9a411F743007Cc673",
  contractInterface: assetManagerAbi,
};
