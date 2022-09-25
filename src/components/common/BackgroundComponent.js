import { Box, styled } from "@mui/material";
import React from "react";

const CustomBox = styled(Box)(({ theme }) => ({
  marginBottom: -40,
  paddingTop: 120,
  paddingBottom: 40,
  fontFamily: "Orbitron!important",
  background: "url(/images/landinpage/card/card_03.jpg)",
  backgroundAttachment: "fixed",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  position: "relative",
  minHeight: "100vh",
  // [theme.breakpoints.down("sm")]: {
  //   paddingTop: 120,
  // },
}));

export default function BackgroundComponent({ children }) {
  return (
    <CustomBox>
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
        }}
      />
      {children}
    </CustomBox>
  );
}
