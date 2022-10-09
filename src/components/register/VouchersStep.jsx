import {
  Table,
  TableRow,
  TableHead,
  Card,
  Divider,
  Box,
  ButtonRow,
  Button,
  Text,
  TableCell,
  Avatar,
  Label,
} from "@unioncredit/ui";
import { ReactComponent as Twitter } from "@unioncredit/ui/lib/icons/twitter.svg";
import { ReactComponent as Telegram } from "@unioncredit/ui/lib/icons/telegram.svg";

export default function VouchersStep() {
  return (
    <Card size="fluid" mb="24px">
      <Card.Header
        title="Find vouchers"
        subTitle="Get an existing Union member to vouch for you. They’ll need to trust you, as vouching on Union puts the vouchers funds at risk if you fail to repay."
      />
      <Card.Body>
        <Divider />
        <Box fluid mt="24px" mb="14px" direction="vertical">
          <Text grey={700}>Vouchers</Text>
          <Card size="fluid">
            <Table>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Account</TableHead>
                <TableHead align="right">Trust limit (DAI)</TableHead>
              </TableRow>
              <TableRow>
                <TableCell fixedSize>
                  <Avatar />
                </TableCell>
                <TableCell>
                  <Label as="p" grey={700} m={0}>
                    Primary
                  </Label>
                  <Label as="p" size="small" grey={400} m={0}>
                    0x0000...0000
                  </Label>
                </TableCell>
                <TableCell align="right">123.23</TableCell>
              </TableRow>
            </Table>
          </Card>
          <ButtonRow fluid mt="8px">
            <Button fluid color="blue" label="Get vouch link" />
            <Button variant="secondary" icon={Twitter} />
            <Button variant="secondary" icon={Telegram} />
          </ButtonRow>
        </Box>
      </Card.Body>
    </Card>
  );
}
