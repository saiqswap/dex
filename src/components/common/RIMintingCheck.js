import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RI_USER_TYPE } from "../../settings/constants";

const CustomFixedBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  width: "100vw",
  height: "100vh",
  background: "url('/images/backgrounds/background.png')",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  top: theme.spacing(5),
  left: 0,
  flexDirection: "column",
  padding: theme.spacing(1),
}));

const warningText =
  "This is the account belongs to the mining workshop, so it cannot perform this function.";

export default function RIMintingCheck({ children, isText }) {
  const { user } = useSelector((state) => state);
  const { riUserType, information } = user;

  if (!information || riUserType === RI_USER_TYPE.NORMAL) {
    return children;
  } else {
    if (isText) {
      return <Typography>{warningText}</Typography>;
    } else {
      return (
        <CustomFixedBox>
          <Typography variant="h6">{warningText}</Typography>
        </CustomFixedBox>
      );
    }
  }
}
