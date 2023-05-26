import { Helmet } from "react-helmet";
import { ArrowRightIcon, Button, Card } from "@unioncredit/ui";
import { LeaderboardTable } from "components/dao/LeaderboardTable";

export default function LeaderboardPage() {
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

        <LeaderboardTable />
      </Card>
    </>
  );
}
