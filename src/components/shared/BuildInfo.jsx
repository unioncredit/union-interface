import "./BuildInfo.scss";

import { Box, Text } from "@unioncredit/ui";

export function BuildInfo() {
  return (
    <Box className="BuildInfo" justify="center" fluid>
      <Text size="small" grey={300} align="center">
        Build:{" "}
        <a
          /* eslint-disable-next-line no-undef */
          target="_blank"
          rel="noreferrer"
          href={`https://github.com/unioncredit/union-interface/commit/${import.meta.env.REACT_APP_VERSION}`}
        >
          {/* eslint-disable-next-line no-undef */}
          {import.meta.env.REACT_APP_VERSION}
        </a>
        {" · "}
      </Text>
      <Text size="small" grey={300} align="center">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/unioncredit/union-interface/issues/new"
        >
          Report an issue -&gt;
        </a>
      </Text>
    </Box>
  );
}
