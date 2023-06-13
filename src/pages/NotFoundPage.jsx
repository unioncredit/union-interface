import "./Error.scss";
import { Box, Button, Card, Heading, Text } from "@unioncredit/ui";

export default function NotFoundPage() {
  return (
    <Box fluid justify="center" align="center" className="ErrorPage">
      <Card maxw="650px" p="40px">
        <Box className="ErrorPage__emoji" justify="center">
          🤦🏻‍♂️
        </Box>

        <Heading level={1} align="center" size="large" mt="8px" color="black">
          That's a 404
        </Heading>
        <Text align="center" grey={500} size="medium" mt="8px">
          Some how you ended up on a page that doesn't exist.
        </Text>
        <Box justify="center" mt="24px">
          <Button as="a" label="Back to safety" href="/" />
        </Box>
      </Card>
    </Box>
  );
}
