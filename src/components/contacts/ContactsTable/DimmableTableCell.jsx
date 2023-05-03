import "./DimmableTableCell.scss";

import cn from "classnames";
import { TableCell } from "@unioncredit/ui";

export const DimmableTableCell = ({
  dimmed,
  value,
  children,
  className,
  ...props
}) => (
  <TableCell
    align="right"
    weight="medium"
    className={cn("DimmableTableCell", className, {
      "DimmableTableCell--dimmed": dimmed,
    })}
    {...props}
  >
    {value ?? children}
  </TableCell>
);
