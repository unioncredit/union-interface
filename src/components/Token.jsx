import { Dai, Usdc } from "@unioncredit/ui";
import { useSettings } from "providers/Settings";

export default function Token(props) {
  const {
    settings: { useToken },
  } = useSettings();
  return useToken == "USDC" ? <Usdc {...props} /> : <Dai {...props} />;
}
