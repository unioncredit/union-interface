import "./BuildInfo.scss";

import { Box, Text } from "@unioncredit/ui";

export function FooterLinks() {
  return (
    <Box className="BuildInfo" direction="vertical" align="center" fluid>
      <Text size="small" grey={300} align="center">
        Union V2 ·{" "}
        <a
          /* eslint-disable-next-line no-undef */
          target="_blank"
          rel="noreferrer"
          href="https://v1.union.finance/"
        >
          Looking for V1 networks? Click here to access our V1 mirror
        </a>
      </Text>

      <Box justify="center">
        <Text size="small" grey={300} align="center">
          Build:{" "}
          <a
            /* eslint-disable-next-line no-undef */
            target="_blank"
            rel="noreferrer"
            href={`https://github.com/unioncredit/union-interface/commit/${process.env.REACT_APP_VERSION}`}
          >
            {/* eslint-disable-next-line no-undef */}
            {process.env.REACT_APP_VERSION}
          </a>
          {" · "}
        </Text>
        <Text size="small" grey={300} align="center">
          <a
            /* eslint-disable-next-line no-undef */
            target="_blank"
            rel="noreferrer"
            href="https://github.com/unioncredit/union-interface/issues/new"
          >
            Report an issue ->
          </a>
        </Text>
      </Box>
    </Box>
  );
}
