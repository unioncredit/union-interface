import { Box, Card, Select } from "@unioncredit/ui";

import { ContactsType } from "constants";
import { useState } from "react";
import { sortAlphabetical } from "utils/sort";

// prettier-ignore
const statusOptions = [
  { id: "all",              label: "All statuses" },
  { id: "member",           label: "Member" },
  { id: "notAMember",       label: "Not a member" },
  { id: "defaulted",        label: "Defaulted" },
  { id: "healthy",          label: "Healthy" },
];

// prettier-ignore
const oderByOptions = [
  { id: "all",              label: "Order by" },
  { id: "trust-ascending",  label: <>Trust amount &middot; Ascending</> },
  { id: "trust-descending", label: <>Trust amount &middot; Descending</> },
  { id: "label-a-z",        label: <>Label &middot; A {"->"} Z</> },
  { id: "label-z-a",        label: <>Label &middot; Z {"->"} A</> },
];

// prettier-ignore
export const filterFns = {
  member:     (item) => item.isMember,
  notAMember: (item) => !item.isMember,
  healthy:    (item) => !item.isOverdue && item.isMember,
  defaulted:  (item) => item.isOverdue,
  all:        (item) => item,
};

const labelOrEns = (items) => items.map((item) => item.ens || item.label || "");

// prettier-ignore
export const sortFns = {
  "all":              () => {},
  "trust-ascending":  (a, b) => a.trust.sub(b.trust),
  "trust-descending": (a, b) => b.trust.sub(a.trust),
  "label-a-z":        (a, b) => sortAlphabetical(...labelOrEns([b, a])),
  "label-z-a":        (a, b) => sortAlphabetical(...labelOrEns([a, b])),
};

export default function Filters({ type, onChange }) {
  const [status, setStatus] = useState(null);
  const [sort, setSort] = useState(null);

  const handleChange = (_status, _sort) => {
    !!_sort?.id && setSort(_sort.id);
    !!_status?.id && setStatus(_status.id);

    onChange({
      sort: _sort?.id || sort,
      status: _status?.id || status,
    });
  };

  return (
    <Box pl="12px" pb="12px" pr="12px">
      <Card packed overflow>
        <Card.Body>
          {type === ContactsType.VOUCHEES && (
            <Box mt="8px">
              <Select
                options={statusOptions}
                defaultValue={statusOptions[0]}
                onChange={(option) => handleChange(option, null)}
              />
            </Box>
          )}
          <Box mt="8px">
            <Select
              options={oderByOptions}
              defaultValue={oderByOptions[0]}
              onChange={(option) => handleChange(null, option)}
            />
          </Box>
        </Card.Body>
      </Card>
    </Box>
  );
}
