import { Box, CardHeader, Grid, Hidden, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import RoundBoxDetail from "./RoundBoxDetail";
import RoundComboDetail from "./RoundComboDetail";
import StaticProgress from "./StaticProgress";
import Title from "./Title";

const CustomContainer = styled(Box)(({ theme }) => ({
  marginTop: 50,
  height: "100%",
  width: "100%",
  minHeight: "50vh",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  padding: "2rem",
  position: "relative",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  borderRadius: "20px",
  // zIndex: 99,
  [theme.breakpoints.down("sm")]: {
    padding: "0px 1rem 0px 0px",
  },
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
    padding: "20px",
  },
  "&:before": {
    content: '""',
    width: "2px",
    height: "100%",
    background: "var(--border-color)",
    position: "absolute",
    top: 0,
    left: "5.5rem",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
const CustomBox = styled(Box)(({ theme }) => ({
  paddingLeft: "6rem",
  marginBottom: theme.spacing(20),
  [theme.breakpoints.down("md")]: {
    paddingLeft: 0,
  },
}));

export default function MintingList() {
  const { minting } = useSelector((state) => state);
  const { mintingBoxList, mintingComboList } = minting;

  return mintingBoxList && mintingComboList ? (
    <>
      <CustomContainer>
        {mintingBoxList.map((round, index) => {
          return (
            <CustomBox key={index}>
              <Box mb={3}>
                <Grid container alignItems="center" spacing={5}>
                  <Grid item xs={12} md={6}>
                    <Box position="relative">
                      <Hidden mdDown>
                        <Box
                          width={50}
                          height={50}
                          bgcolor="#fff"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            borderRadius: "50%",
                            position: "absolute",
                            border: "3px solid var(--border-color)",
                            left: "-4rem",
                            top: "-0.5rem",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={900}
                            color="#000"
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                      </Hidden>
                      <CardHeader
                        sx={{ padding: 0 }}
                        title={
                          <Title
                            variant="h5"
                            sx={{
                              textAlign: "left",
                              width: "fit-content",
                              fontWeight: 700,
                            }}
                          >
                            Minting{" "}
                            {round.roundNumber === 0
                              ? "OG sale"
                              : `WL R${round.roundNumber}`}
                          </Title>
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StaticProgress roundNumber={round.roundNumber} />
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={6}>
                    <RoundBoxDetail round={round} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RoundComboDetail
                      roundNumber={index}
                      angelBoxInformation={round}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CustomBox>
          );
        })}
      </CustomContainer>
    </>
  ) : (
    <Loader />
  );
}
