import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import MintingList from "../components/box-minting/MintingList";
import Title from "../components/box-minting/Title";
import { CustomButton } from "../components/common/CustomButton";

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
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item>
            <Title variant="h6" sx={{ textAlign: "left" }}>
              MINTING
            </Title>
            <Container
              maxWidth="sm"
              sx={{ pl: "0px!important", marginLeft: 0 }}
            >
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
            <Title
              variant="body1"
              sx={{
                textAlign: "left",
              }}
            >
              The beginning of a great journey
            </Title>
          </Grid>
          <Grid item>
            <CustomButton
              sx={{
                backdropFilter: "blur(20px)",
              }}
              component="a"
              href="https://tofunft.com/collection/infinity-angel-box/items"
              target="_blank"
            >
              <img src="/images/logo/tofunft.png" width={25} />
              <Typography ml={1}>Buy on Tofunft</Typography>
            </CustomButton>
          </Grid>
        </Grid>
        <MintingList />
      </Container>
    </div>
  );
}
