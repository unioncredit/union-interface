import {
  Box,
  Button,
  FilterIcon,
  Input,
  SearchIcon,
  VouchIcon,
} from "@unioncredit/ui";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";

export const ContactsFilterControls = ({ setQuery, setShowFilters }) => {
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
      <Button
        ml="8px"
        fluid
        icon={FilterIcon}
        color="secondary"
        variant="light"
        onClick={() => setShowFilters((x) => !x)}
      />
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
