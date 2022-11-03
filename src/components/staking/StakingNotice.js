import { Typography } from "@mui/material";
import React from "react";

export default function StakingNotice() {
  return (
    <>
      <Typography>NOTICE</Typography>
      <ul
        style={{
          listStyleType: "unset",
        }}
      >
        <li>
          Unstaking fee - 1% of the staking principal is deducted and unstaking
          fee will be burn.
        </li>
        <li>Daily interest is paid but only CLAIM at the end of staking.</li>
        <li>
          4 slots open when staking 60,000 ING To open 6 slots, you need to
          stake 100,000 ING plus 40,000 ING after unstaking 60,000 ING.
        </li>
        <li>
          Staking duration with corresponding benefits is different. After the
          unstake is completed, you will receive the corresponding benefit
          within up to 7 days.
        </li>
      </ul>
    </>
  );
}
