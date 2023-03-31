import { Box, Button, Input, SearchIcon, VouchIcon } from "@unioncredit/ui";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";
import FiltersPopover from "components/contacts/FiltersPopover";
import { ContactsType } from "constants";

export const ContactsFilterControls = ({
  type,
  filters,
  setQuery,
  setFilers,
}) => {
  const { open } = useModals();

  return (
    <Box>
      <Input
        maxw="285px"
        prefix={<SearchIcon width="15px" />}
        placeholder="Filter by address or ENS"
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />

      {type === ContactsType.VOUCHEES && (
        <FiltersPopover filters={filters} setFilters={setFilers} />
      )}

      <Button
        fluid
        ml="8px"
        label="New vouch"
        icon={VouchIcon}
        onClick={() => open(VOUCH_MODAL)}
      />
    </Box>
  );
};
