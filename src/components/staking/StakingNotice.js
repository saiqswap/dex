import { Typography } from "@mui/material";
import React from "react";

export default function StakingNotice() {
  return (
    <>
      <Typography>We share detailed policies</Typography>
      <ul
        style={{
          listStyleType: "unset",
        }}
      >
        <li>Unstaking fee - 1% of the staking principal is deducted</li>
        <li>Daily interest is paid as a claim method</li>
        <li>
          4 slots open when staking 60,000 ING To open 6 slots, you need to
          stake 100,000 ING plus 40,000 ING after unstaking 60,000 ING.
        </li>
      </ul>
    </>
  );
}
