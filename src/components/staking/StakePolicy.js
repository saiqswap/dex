import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function StakePolicy() {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  return (
    <Box textAlign="left">
      <Typography variant="caption">
        {library.PRESALE_CHECKBOX_1}{" "}
        <Link
          target="_blank"
          href="https://doc.infinityangel.io/faqs/privacy-policy"
        >
          Infinity Angel Staking Service Agreement{" "}
        </Link>
      </Typography>
    </Box>
  );
}
