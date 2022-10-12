import {
  userManagerContract,
  uTokenContract,
  unionContract,
  daiContract,
  comptrollerContract,
} from "config/contracts";

export default function useContract(name) {
  return {
    userManager: userManagerContract,
    uToken: uTokenContract,
    union: unionContract,
    dai: daiContract,
    comptroller: comptrollerContract,
  }[name];
}
