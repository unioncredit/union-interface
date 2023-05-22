import { Helmet } from "react-helmet";
import {
  ArrowRightIcon,
  Button,
  Card,
  InfoBanner,
  SwitchIcon,
  WarningIcon,
} from "@unioncredit/ui";
import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { mainnet } from "wagmi/chains";

export default function LeaderboardPage() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <>
      <Helmet>
        <title>Leaderboard | Union Credit Protocol</title>
      </Helmet>

      <Card>
        <Card.Header
          pb="24px"
          title="Leaderboard"
          action={
            <Button
              as="a"
              href="https://www.tally.xyz/gov/union"
              target="_blank"
              rel="noopener"
              size="pill"
              variant="light"
              color="secondary"
              label={
                <>
                  View delegates on Tally
                  <ArrowRightIcon
                    width="16px"
                    height="16px"
                    style={{
                      marginLeft: "4px",
                    }}
                  />
                </>
              }
            />
          }
        />

        {chain.id === mainnet.id ? (
          <LeaderboardTable />
        ) : (
          <Card.Body>
            <InfoBanner
              justify="space-between"
              align="left"
              icon={WarningIcon}
              iconPosition="right"
              variant="warning"
              label="Switch to Ethereum Mainnet to view the leaderboard"
            />

            <Button
              fluid
              mt="8px"
              size="large"
              icon={SwitchIcon}
              label="Switch to Ethereum"
              onClick={() => switchNetwork(mainnet.id)}
            />
          </Card.Body>
        )}
      </Card>
    </>
  );
}
