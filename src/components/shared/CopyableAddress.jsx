import { Text } from "@unioncredit/ui";

import useCopyToClipboard from "hooks/useCopyToClipboard";
import { truncateAddress } from "utils/truncateAddress";

// Truncated address text that copies the full address on click, with the same
// transient "Copied!" feedback as the wallet & activity modal. Clicks stop
// propagating so copying never triggers a parent row's own click behaviour
// (e.g. opening a contact modal).
export function CopyableAddress({ address, ...props }) {
  const [copied, copy] = useCopyToClipboard();

  return (
    <Text
      m={0}
      size="small"
      grey={500}
      weight="medium"
      title="Copy address"
      style={{ cursor: "pointer" }}
      onClick={(event) => {
        event.stopPropagation();
        copy(address);
      }}
      {...props}
    >
      {copied ? "Copied!" : truncateAddress(address)}
    </Text>
  );
}
