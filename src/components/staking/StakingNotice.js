import { styled, Typography } from "@mui/material";
import React from "react";

const CustomLI = styled("li")(({ theme }) => ({
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(1),
  },
}));
export default function StakingNotice() {
  return (
    <>
      <Typography variant="h6">NOTICE</Typography>
      <ul
        style={{
          listStyleType: "unset",
        }}
      >
        <CustomLI>
          Unstaking fee - 1% of the staking principal is and unstaking fee will
          be burn.
        </CustomLI>
        <CustomLI>
          Interest is paid daily. At the end of the staking period, the system
          automatically unstakes.
        </CustomLI>
        <CustomLI>
          4 slots open when staking 40,000 ING. To open 6 slots, you need to
          stake 120,000 ING.
        </CustomLI>
        <CustomLI>
          When unstaking, slot number 4 / number 5 / number 6 will be withdrawn
          when the staking balance does not meet the amount of ING specified in
          the slots.
        </CustomLI>
        <CustomLI>
          Staking duration with corresponding benefits is different. After the
          unstake is completed, you will receive the corresponding benefit
          within up to 7 days.
        </CustomLI>
      </ul>
    </>
  );
}
