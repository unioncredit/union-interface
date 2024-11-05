import { Dai, Usdc } from "@unioncredit/ui";

import { TOKENS } from "constants";
import { useToken } from "hooks/useToken";

export default function Token(props) {
  const { token } = useToken();
  return token === TOKENS.USDC ? <Usdc {...props} /> : <Dai {...props} />;
}
