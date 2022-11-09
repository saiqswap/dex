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
          Unstaking fee - 1% of the staking principal is and unstaking fee will
          be burn.
        </li>
        <li>
          Interest is paid daily. At the end of the staking period, the system
          automatically unstakes.
        </li>
        <li>
          4 slots open when staking 40,000 ING. To open 6 slots, you need to
          stake 120,000 ING.
        </li>
        <li>
          When unstaking, slot number 4 / number 5 / number 6 will be withdrawn
          when the staking balance does not meet the amount of ING specified in
          the slots.
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
