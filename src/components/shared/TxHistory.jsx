import "./TxHistory.scss";

import {
  Text,
  Table,
  TableCell,
  TableRow,
  Label,
  Box,
  Skeleton,
  Pagination,
  EmptyState,
  TableHead,
  Card,
} from "@unioncredit/ui";
import { useAccount } from "wagmi";

import { ReactComponent as Borrow } from "@unioncredit/ui/lib/icons/borrow.svg";
import { ReactComponent as Repayment } from "@unioncredit/ui/lib/icons/repayment.svg";
import { ReactComponent as NewMember } from "@unioncredit/ui/lib/icons/newMember.svg";
import { ReactComponent as NewVouch } from "@unioncredit/ui/lib/icons/newVouch.svg";
import { ReactComponent as NewVouchRecieved } from "@unioncredit/ui/lib/icons/newVouchRecieved.svg";
import { ReactComponent as CancelledVouch } from "@unioncredit/ui/lib/icons/cancelVouch.svg";
import { ReactComponent as InlineExternal } from "@unioncredit/ui/lib/icons/externalinline.svg";

import format from "utils/format";
import { ZERO_ADDRESS } from "constants";
import { TransactionTypes } from "constants";
import useTxHistory from "hooks/useTxHistory";
import PrimaryLabel from "components/shared/PrimaryLabel";
import usePagination from "hooks/usePagination";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { RelativeTime } from "./BlockRelativeTime";
import { compareAddresses } from "utils/compare";

const icons = {
  [TransactionTypes.CANCEL]: CancelledVouch,
  [TransactionTypes.BORROW]: Borrow,
  [TransactionTypes.REPAY]: Repayment,
  [TransactionTypes.TRUST]: NewVouch,
  [TransactionTypes.TRUSTED]: NewVouchRecieved,
  [TransactionTypes.REGISTER]: NewMember,
};

const Address = ({ address }) => {
  const { address: connectedAddress } = useAccount();
  return (
    <Label as="span" grey={400} m={0}>
      <Link to={`/profile/${address}`}>
        {compareAddresses(connectedAddress, address) ? (
          "You"
        ) : (
          <PrimaryLabel address={address} />
        )}
      </Link>
    </Label>
  );
};

// prettier-ignore
const texts = {
  [TransactionTypes.CANCEL]:    (x) => <>Cancelled Vouch for <Address address={x.borrower} /></>,
  [TransactionTypes.BORROW]:    (x) => <>Borrow {format(x.amount)}</>,
  [TransactionTypes.REPAY]:     (x) => <>Repayment {format(x.amount)}</>,
  [TransactionTypes.TRUST]:     (x) => <>Trusted <Address address={x.borrower} /></>,
  [TransactionTypes.TRUSTED]:   (x) => <>Trusted by <Address address={x.staker} /></>,
  [TransactionTypes.REGISTER]:  (_) => <>Became a member</>,
};

function TransactionHistoryRow({
  amount,
  type,
  address,
  staker,
  borrower,
  timestamp,
}) {
  const Icon = icons[type];
  const text = texts[type]({ amount, staker, borrower });

  if (!Icon || !text) return null;

  return (
    <TableRow>
      <TableCell fixedSize>
        {address ? (
          <div className="avatarIcon">
            <Avatar address={address} size={24} />
            <Icon width="16px" />
          </div>
        ) : (
          <Icon width="24px" />
        )}
      </TableCell>
      <TableCell>
        <Box direction="vertical">
          <Label as="p" grey={700} m={0}>
            {text}
          </Label>
          <Label as="p" size="small" grey={400} m={0}>
            <a href="#" target="_blank">
              <RelativeTime timestamp={timestamp} />{" "}
              <InlineExternal width="12px" />
            </a>
          </Label>
        </Box>
      </TableCell>
      <TableCell align="right">
        {amount && <Text grey={700}>{format(amount)}</Text>}
      </TableCell>
    </TableRow>
  );
}

export function TransactionHistory({
  staker = ZERO_ADDRESS,
  borrower = ZERO_ADDRESS,
}) {
  const { data = [] } = useTxHistory({ staker, borrower });

  const {
    data: transactionPage,
    maxPages,
    activePage,
    onChange,
  } = usePagination(data);

  if (data.length <= 0) {
    return (
      <Card.Body>
        <EmptyState label="No transactions" />
      </Card.Body>
    );
  }

  return (
    <div className="TransactionHistory">
      <Table>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Event</TableHead>
          <TableHead align="right">Value (DAI)</TableHead>
        </TableRow>

        {transactionPage.map((tx, i) => (
          <TransactionHistoryRow key={i} {...tx} />
        ))}

        {!data &&
          Array(3)
            .fill(null)
            .map((_, i) => (
              <TableRow key={i}>
                <TableCell fixedSize>
                  <Skeleton shimmer variant="circle" size={24} grey={200} />
                </TableCell>
                <TableCell>
                  <Skeleton shimmer width={60} height={10} grey={200} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton shimmer width={30} height={10} grey={200} />
                </TableCell>
              </TableRow>
            ))}
      </Table>

      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </div>
  );
}
