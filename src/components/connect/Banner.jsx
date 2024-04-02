import { Heading, Box } from "@unioncredit/ui";
import "./Banner.scss";

export default function Banner() {
  return (
    <div className="ConnectBanner">
      <Box maxw="411px" w="90%" px="8px">
        <Heading m={0} align="center">
          <span className="ConnectBanner__bold">Welcome to Union</span>, the place to create, manage
          and grow your on-chain credit
        </Heading>
      </Box>
    </div>
  );
}
