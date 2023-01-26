import { Card, Button, Box, Text } from "@unioncredit/ui";

export default function ShareCard({
  content,
  buttonProps = { color: "blue" },
}) {
  return (
    <Card variant="blue" mt="24px" packed>
      <Card.Body>
        <Box align="center">
          {content && <Text m={0}>{content}</Text>}
          <Button fluid ml="4px" {...buttonProps} />
        </Box>
      </Card.Body>
    </Card>
  );
}
