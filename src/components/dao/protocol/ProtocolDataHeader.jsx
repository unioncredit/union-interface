import { Box, Divider, Text } from "@unioncredit/ui";

export function ProtocolDataHeader({ title, subTitle, ...props }) {
  return (
    <Box fluid direction="vertical" {...props}>
      <Divider />

      <Box mt="16px" direction="vertical">
        <Text m={0} grey={800} size="large" weight="medium">
          {title}
        </Text>
        <Text m={0} grey={500}>
          {subTitle}
        </Text>
      </Box>
    </Box>
  );
}
