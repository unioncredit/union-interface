import userManagerAbi from "abis/userManager.json";
import uTokenAbi from "abis/uToken.json";
import unionAbi from "abis/union.json";
import erc20Abi from "abis/erc20.json";
import comptrollerAbi from "abis/comptroller.json";
import assetManagerAbi from "../../abis/assetManager.json";

export const userManagerContract = {
  address: "0xba25eb32f42B1A4c31711B3d4967e4D74561C37B",
  abi: userManagerAbi,
};

export const uTokenContract = {
  address: "0xe3686Dad4E4bd2203051D605C160c9a3f5D3dA04",
  abi: uTokenAbi,
};

export const unionContract = {
  address: "0x23B0483E07196c425d771240E81A9c2f1E113D3A",
  abi: unionAbi,
};

export const daiContract = {
  address: "0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464",
  abi: erc20Abi,
};

export const comptrollerContract = {
  address: "0x68c44b8f51F199a02094f5a04dB3A6B8CfCd0722",
  abi: comptrollerAbi,
};

export const assetManagerContract = {
  address: "0x8B6559057C5206F6c7B19c348834Fc41067a52EB",
  abi: assetManagerAbi,
};
