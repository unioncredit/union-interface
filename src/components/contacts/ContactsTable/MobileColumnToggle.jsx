import "./MobileColumnToggle.scss";

import { Text, Button, Modal, Popover, ControlGroup } from "@unioncredit/ui";
import { useState } from "react";

export default function MobileColumnToggle({
  active,
  columns,
  setSelectedColumn,
}) {
  const [open, setOpen] = useState(false);

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
          label={active.label}
          onClick={() => setOpen(!open)}
          className="MobileColumnToggle__toggle"
        />
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
