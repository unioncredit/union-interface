import "./ContactsFilterControls.scss";

import { Box, Button, Input, SearchIcon, VouchIcon, LockIcon, Tooltip } from "@unioncredit/ui";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";
import { useMember } from "providers/MemberData";
import FiltersPopover from "components/contacts/FiltersPopover";
import useResponsive from "hooks/useResponsive";

export const ContactsFilterControls = ({ type, filters, setQuery, setFilers }) => {
  const { open } = useModals();
  const { data: member } = useMember();
  const { isMicro, isMobile } = useResponsive();

  const { isOverdue } = member;

  return (
    <Box fluid className="ContactsFilterControls" align="center">
      <Input
        className="ContactsFilterControls__search"
        prefix={<SearchIcon width="15px" />}
        placeholder={isMicro ? "Search" : isMobile ? "Address or ENS" : "Filter by address or ENS"}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />

      <FiltersPopover type={type} filters={filters} setFilters={setFilers} />

      {isOverdue ? (
        <Tooltip content="You cannot vouch for new addresses while in default">
          <Button
            fluid
            ml="8px"
            label="New vouch"
            icon={LockIcon}
            disabled={true}
            onClick={() => open(VOUCH_MODAL)}
          />
        </Tooltip>
      ) : (
        <Button
          fluid
          ml="8px"
          label="New vouch"
          icon={VouchIcon}
          onClick={() => open(VOUCH_MODAL)}
        />
      )}
    </Box>
  );
};
