import "./FiltersPopover.scss";

import cn from "classnames";
import { Box, Button, Control, FilterIcon, Modal, Popover, Text } from "@unioncredit/ui";

import useScrollLock from "hooks/useScrollLock";
import useResponsive from "hooks/useResponsive";
import { ContactsType, ZERO } from "constants";

// prettier-ignore
export const providingFilterFns = {
  borrowing:  (item) => item.locking > ZERO,
  notMember:  (item) => !item.isMember,
  member:     (item) => item.isMember,
  inactive:   (item) => !item.isOverdue && item.locking <= ZERO && item.isMember,
  overdue:    (item) => item.isOverdue,
};

export const receivingFilterFns = {
  borrowing_from: (item) => item.locking > ZERO,
};

export default function FiltersPopover({ type, filters, setFilters }) {
  const { isMobile } = useResponsive();
  const setScrollLock = useScrollLock();

  const checkboxFilters =
    type === ContactsType.VOUCHEES
      ? [
          { id: "borrowing", label: "Borrowing" },
          { id: "overdue", label: "Overdue" },
          { id: "inactive", label: "Inactive" },
          { id: "member", label: "Member" },
          { id: "notMember", label: "Not a member" },
        ]
      : [{ id: "borrowing_from", label: "Borrowing from" }];

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
          className={cn("FiltersPopover__button", {
            "FiltersPopover__button--active": Array.isArray(filters) && filters.length > 0,
          })}
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
