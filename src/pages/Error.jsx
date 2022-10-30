import { Link } from "react-router-dom";
import { Box, Button, ButtonRow, Heading, Text } from "@unioncredit/ui";

import Header from "components/connect/Header";
import links from "config/links";

export default function ErrorPage({
  title,
  body,
  buttons = [
    { label: "Back to app", href: "/", variant: "primary" },
    { label: "Read the docs", href: links.docs, variant: "secondary" },
  ],
}) {
  return (
    <>
      <Header />
      <Box fluid justify="center">
        <Box align="center" direction="vertical" maxw="440px">
          <Heading align="center" size="xxlarge" mb="12px" mt="48px">
            {title}
          </Heading>
          <Text align="center">{body}</Text>
          <ButtonRow mt="24px">
            {buttons.map(({ label, href, variant }) => (
              <Link to={href} key={href}>
                <Button label={label} variant={variant} mx="4px" />
              </Link>
            ))}
          </ButtonRow>
        </Box>
      </Box>
    </>
  );
}
