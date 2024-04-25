import "./TextSeparator.scss";
import { Box, Text } from "@unioncredit/ui";

export function TextSeparator({ children, ...props }) {
  return (
    <Box className="TextSeparator" justify="center" {...props}>
      <Text color="grey400">{children}</Text>
    </Box>
  );
}
