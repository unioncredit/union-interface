import { Heading, Box } from "@unioncredit/ui";
import "./Banner.scss";

export default function Banner() {
  return (
    <div className="ConnectBanner">
      <Box maxw="411px" px="8px">
        <Heading m={0} align="center">
          Welcome to Union, the place to create, manage and grow your on-chain
          credit
        </Heading>
      </Box>
    </div>
  );
}
