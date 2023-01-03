import userManagerAbi from "abis/userManager.json";
import uTokenAbi from "abis/uToken.json";
import unionAbi from "abis/union.json";
import erc20Abi from "abis/erc20.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "../../abis/assetManager.json";

export const userManagerContract = {
  addressOrName: "0xba25eb32f42B1A4c31711B3d4967e4D74561C37B",
  contractInterface: userManagerAbi,
};

export const uTokenContract = {
  addressOrName: "0xe3686Dad4E4bd2203051D605C160c9a3f5D3dA04",
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
  addressOrName: "0x68c44b8f51F199a02094f5a04dB3A6B8CfCd0722",
  contractInterface: comptrollerAbi,
};

export const assetManagerContract = {
  addressOrName: "0x8B6559057C5206F6c7B19c348834Fc41067a52EB",
  contractInterface: assetManagerAbi,
};
