import "./Error.scss";
import { Box, Button, Card, Heading, Text } from "@unioncredit/ui";

export default function ErrorPage() {
  return (
    <Box fluid justify="center" align="center" className="ErrorPage">
      <Card maxw="650px" p="40px">
        <Box className="ErrorPage__emoji" justify="center">
          🤦🏻‍♂️
        </Box>

        <Heading level={1} align="center" size="large" mt="8px" color="black">
          Oh no, something broke
        </Heading>
        <Text align="center" grey={500} size="medium" mt="8px">
          We’re sorry but something broke while you were using the app. If this problem persists,
          please let us know.
        </Text>
        <Box justify="center" mt="24px">
          <Button as="a" label="Back to safety" href="/" />
        </Box>
      </Card>
    </Box>
  );
}
