import {
  userManagerContract,
  uTokenContract,
  unionContract,
} from "config/contracts";

export default function useContract(name) {
  return {
    userManager: userManagerContract,
    uToken: uTokenContract,
    unionContract: unionContract,
  }[name];
}

