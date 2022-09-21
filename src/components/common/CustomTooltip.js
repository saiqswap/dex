import { Tooltip } from "@mui/material";
import React from "react";

export default function CustomTooltip({ children, ...props }) {
  return <Tooltip {...props}>{children}</Tooltip>;
}
