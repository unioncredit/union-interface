import { Card, Button, Box, Label } from "@unioncredit/ui";

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
