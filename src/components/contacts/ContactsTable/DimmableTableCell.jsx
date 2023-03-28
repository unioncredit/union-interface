import "./DimmableTableCell.scss";

import cn from "classnames";
import { TableCell } from "@unioncredit/ui";

export const DimmableTableCell = ({ dimmed, value, children, className }) => (
  <TableCell
    align="right"
    weight="medium"
    className={cn("DimmableTableCell", className, {
      "DimmableTableCell--dimmed": dimmed,
    })}
  >
    {value ?? children}
  </TableCell>
);
