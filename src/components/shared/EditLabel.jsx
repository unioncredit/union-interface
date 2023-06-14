import { useCallback, useRef, useState } from "react";
import { Box, Button, Text } from "@unioncredit/ui";

import useLabels from "hooks/useLabels";

function setEndOfContentEditable(contentEditableElement) {
  let range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) {
    //IE 8 and lower
    range = document.body.createTextRange();
    range.moveToElementText(contentEditableElement);
    range.collapse(false);
    range.select();
  }
}

export function EditLabel({ address }) {
  const labelEl = useRef(null);
  const [editting, setEditting] = useState(false);

  const { getLabel, setLabel } = useLabels();

  const label = getLabel(address);

  /**
   * Handle saving new label
   */
  const handleSave = useCallback(() => {
    const label = labelEl.current.innerText;

    setLabel(address, label);
    setEditting(false);

    document.removeEventListener("keydown", ignoreEnterKey);
  }, [setLabel, setEditting]);

  /**
   * Function to ignore enter key press
   */
  const ignoreEnterKey = useCallback(
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  /**
   * Handle starting edit mode
   */
  const handleEdit = () => {
    setEditting(true);
    setTimeout(() => {
      setEndOfContentEditable(labelEl.current);
    }, 0);
    document.addEventListener("keydown", ignoreEnterKey);
  };

  /**
   * Handle cancelling edit mode
   */
  const handleCancel = () => {
    setEditting(false);
    labelEl.current.textContent = label;
  };

  return (
    <Box fluid justify="space-between" align="center" mb="12px">
      <Box direction="vertical">
        <Text size="small" grey={400} as="p" m={0}>
          CONTACT NAME
        </Text>
        <Text
          mb={0}
          size="large"
          contentEditable={editting}
          ref={labelEl}
          className="editable-name"
        >
          {label || (!editting && "-")}
        </Text>
      </Box>
      <Box>
        {editting ? (
          <>
            <Button
              size="pill"
              color="primary"
              variant="light"
              label="Save"
              onClick={handleSave}
            />
            <Button
              ml="4px"
              size="pill"
              color="secondary"
              variant="light"
              label="Cancel"
              onClick={handleCancel}
            />
          </>
        ) : (
          <Button
            size="pill"
            color="secondary"
            variant="light"
            label="Edit alias"
            onClick={handleEdit}
          />
        )}
      </Box>
    </Box>
  );
}
