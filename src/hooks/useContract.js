import {
  userManagerContract,
  uTokenContract,
  unionContract,
  daiContract,
} from "config/contracts";

export default function useContract(name) {
  return {
    userManager: userManagerContract,
    uToken: uTokenContract,
    union: unionContract,
    dai: daiContract,
  }[name];
}
