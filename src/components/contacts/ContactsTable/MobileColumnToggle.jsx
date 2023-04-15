import "./MobileColumnToggle.scss";

import {
  Text,
  Button,
  Modal,
  Popover,
  ControlGroup,
  SortAscending,
  SortDescending,
  Sort,
  Divider,
} from "@unioncredit/ui";
import { useState } from "react";
import { SortOrder } from "constants";

export default function MobileColumnToggle({
  active,
  columns,
  setSelectedColumn,
  sort,
  setSort,
}) {
  const [open, setOpen] = useState(false);

  const Icon = sort.order
    ? sort.order === SortOrder.ASC
      ? SortAscending
      : SortDescending
    : Sort;

  return (
    <Popover
      open={open}
      stickyMobile
      position="left"
      className="MobileColumnToggle"
      onClose={() => setOpen(false)}
      button={() => (
        <Button
          size="small"
          color="secondary"
          variant="light"
          onClick={() => setOpen(!open)}
          className="MobileColumnToggle__toggle"
        >
          <>
            <Icon
              style={{
                width: "12px",
                height: "12px",
                verticalAlign: "bottom",
                marginRight: "3px",
              }}
            />
            {active.label}
          </>
        </Button>
      )}
    >
      <Modal>
        <Modal.Header>
          <Text m={0} grey={600} size="medium" weight="medium">
            Column Data
          </Text>
        </Modal.Header>

        <Modal.Body>
          <ControlGroup
            initialSelected={active.id}
            items={columns.map((column) => ({
              ...column,
              type: "radio",
              checked: column.id === active.id,
            }))}
            onChange={(selectedId) => {
              setSelectedColumn(
                columns.find((column) => column.id === selectedId)
              );
              setSort({ ...sort, type: selectedId });
              setOpen(false);
            }}
          />

          <Divider m="8px 0" />

          <ControlGroup
            items={[
              {
                type: "checkbox",
                id: SortOrder.ASC,
                label: "Sort ascending",
                checked: sort.order === SortOrder.ASC,
              },
              {
                type: "checkbox",
                id: SortOrder.DESC,
                label: "Sort descending",
                checked: sort.order === SortOrder.DESC,
              },
            ]}
            onChange={(selectedId) => {
              setSort({
                ...sort,
                order: sort.order === selectedId ? null : selectedId,
              });

              setOpen(false);
            }}
          />

          <Button
            mt="16px"
            fluid
            color="secondary"
            variant="light"
            label="Cancel"
            onClick={() => setOpen(false)}
          />
        </Modal.Body>
      </Modal>
    </Popover>
  );
}
