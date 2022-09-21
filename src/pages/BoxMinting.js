import { Box, Container } from "@mui/material";
import React from "react";
import MintingList from "../components/box-minting/MintingList";
import StaticMintingList from "../components/box-minting/StaticMintingList";
import Title from "../components/box-minting/Title";

export default function BoxMinting() {
  return (
    <div
      style={{
        marginBottom: -40,
        paddingTop: 40,
        fontFamily: "Orbitron!important",
        background: "url(/images/backgrounds/background.png)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        paddingBottom: 100,
      }}
    >
      <Container maxWidth="lg">
        <Box mt={10} />
        <Title variant="h6" sx={{ textAlign: "left" }}>
          MINTING
        </Title>
        <Container maxWidth="sm" sx={{ pl: "0px!important", marginLeft: 0 }}>
          <Title
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: "left",
              color: "#1588d6",
            }}
          >
            Angel, Minion Parts and Costume Box
          </Title>
        </Container>
        <Title variant="body1">The beginning of a great journey</Title>
        <StaticMintingList />
      </Container>
    </div>
  );
}
