import "./FiltersPopover.scss";

import { Box, Text, Button, Control, FilterIcon, Modal, Popover } from "@unioncredit/ui";

import { ZERO } from "constants";
import useScrollLock from "hooks/useScrollLock";
import useResponsive from "hooks/useResponsive";

// prettier-ignore
export const filterFunctions = {
  borrowing:  (item) => item.locking.gt(ZERO),
  notMember:  (item) => !item.isMember,
  inactive:   (item) => !item.isOverdue && item.isMember,
  overdue:    (item) => item.isOverdue,
};

export default function FiltersPopover({ filters, setFilters }) {
  const { isMobile } = useResponsive();
  const setScrollLock = useScrollLock();

  const checkboxFilters = [
    { id: "borrowing", label: "Borrowing" },
    { id: "overdue", label: "Overdue" },
    { id: "inactive", label: "Inactive" },
    { id: "notMember", label: "Not a member" },
  ];

  return (
    <Popover
      stickyMobile
      position="left"
      className="FiltersPopover"
      onClose={() => setScrollLock(false)}
      button={(toggleOpen) => (
        <Button
          ml="8px"
          fluid
          icon={FilterIcon}
          color="secondary"
          variant="light"
          onClick={() => {
            toggleOpen();

            if (isMobile) {
              setScrollLock(true);
            }
          }}
        />
      )}
    >
      <Modal>
        <Modal.Header>
          <Text m={0} grey={600} size="medium" weight="medium">
            Filter by account status
          </Text>

          <Button
            ml="16px"
            size="pill"
            label="Reset"
            variant="light"
            color="secondary"
            className="ResetAccountStatusButton"
            onClick={() => setFilters([])}
          />
        </Modal.Header>

        <Modal.Body>
          <Box direction="vertical">
            {checkboxFilters.map(({ id, label }) => {
              const active = filters?.includes(id);

              return (
                <Control
                  id={id}
                  key={id}
                  label={label}
                  type="checkbox"
                  checked={active}
                  className="FiltersPopover__checkbox"
                  onClick={() =>
                    setFilters(active ? filters.filter((f) => f !== id) : [id, ...filters])
                  }
                />
              );
            })}
          </Box>
        </Modal.Body>
      </Modal>
    </Popover>
  );
}
