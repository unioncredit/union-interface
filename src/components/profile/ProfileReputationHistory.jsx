import "./ProfileReputationHistory.scss";

import { ArrowLeftIcon, ArrowRightIcon, Box, Button, Modal, Text } from "@unioncredit/ui";
import cn from "classnames";
import { useState } from "react";

export function ProfileReputationHistory({ history }) {
  const [year, setYear] = useState(new Date().getFullYear());

  const calculateStatus = (month) => {
    if (!(year in history && month in history[year])) {
      return;
    }

    const data = history[year][month];

    if (data.isOverdue) {
      return { "defaulted": true };
    }

    if (data["repays"].length > 0) {
      return { "repaid": true };
    }

    if (data["borrows"].length > 0) {
      return { "borrowed": true };
    }

    return { "inactive": true };
  }

  return (
    <Modal.Container className="ProfileReputationHistory" p="8px" direction="vertical">
      <Box mb="16px" justify="space-between" fluid>
        <Text m={0} size="medium" weight="medium">
          Activity
        </Text>

        <Box align="center">
          <Text m={0} size="medium" weight="medium">
            {year}
          </Text>

          <Button
            variant="light"
            color="secondary"
            icon={ArrowLeftIcon}
            className="ProfileReputationHistory__Button"
            disabled={!(year-1 in history)}
            onClick={() => setYear(year => year - 1)}
          />
          <Button
            variant="light"
            color="secondary"
            icon={ArrowRightIcon}
            className="ProfileReputationHistory__Button"
            disabled={!(year+1 in history)}
            onClick={() => setYear(year => year + 1)}
          />
        </Box>
      </Box>

      <Box justify="space-between" fluid>
        {Array(12).fill(null).map((_, month) => (
          <Box key={month} align="center" direction="vertical" fluid>
            <div className={cn("ProfileReputationHistory__MonthIndicator", calculateStatus(month + 1))}/>

            <Text m="4px 0 0" grey={400} size="small" weight="medium">
              {(month+1).toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
              })}
            </Text>
          </Box>
        ))}
      </Box>
    </Modal.Container>
  )
}