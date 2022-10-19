import { Card, Button, Text, Box, Label } from "@unioncredit/ui";
import { ReactComponent as Link } from "@unioncredit/ui/lib/icons/link.svg";

export default function ShareCard({
  content,
  buttonProps = { color: "blue" },
}) {
  return (
    <Card variant="blue" mt="24px" packed>
      <Card.Body>
        <Box align="center">
          {content && <Label m={0}>{content}</Label>}
          <Button fluid ml="4px" {...buttonProps} />
        </Box>
      </Card.Body>
    </Card>
  );
}
