import {
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  Hidden,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { post } from "../../utils/api";
import Loader from "../common/Loader";
import RoundBoxDetail from "./RoundBoxDetail";
import RoundComboDetail from "./RoundComboDetail";
import Title from "./Title";

const CustomContainer = styled(Box)(() => ({
  marginTop: 50,
}));
const CustomCard = styled(Card)(({ theme }) => ({
  height: "100%",
  width: "100%",
  minHeight: "50vh",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  padding: "2rem",
  position: "relative",
  backdropFilter: "blur(20px)",
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
const CustomStep = styled(Stepper)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    marginLeft: "-1rem",
    "& .MuiStepContent-root": {
      position: "relative",
      paddingBottom: "2rem",
    },
  },
  "& .MuiStepConnector-root": {
    height: "100px",
    [theme.breakpoints.down("md")]: {
      width: "150vw",
      marginLeft: "-10vw",
      background: "var(--border-color)",
      height: "10px",
      marginBottom: "20px",
    },
  },
  "& .MuiStepLabel-iconContainer svg": {
    width: "50px",
    height: "50px",
    color: "var(--border-color)",
    position: "relative",
    zIndex: 100,
    border: "3px solid var(--border-color)",
    borderRadius: "100px",
    "& text": {
      fill: "var(--main-color)",
      fontWeight: "bold",
    },
  },
  "& .MuiStepConnector-line": {
    opacity: 0,
  },
  "& .MuiStepLabel-labelContainer": {
    paddingLeft: "1rem",
  },
  "& .MuiStepContent-root": {
    paddingLeft: "6rem",
    borderLeft: "none",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "0px",
    },
  },
  "& .MuiStepLabel-root": {
    [theme.breakpoints.down("md")]: {
      marginLeft: "0px",
    },
  },
  "& .MuiStepLabel-iconContainer": {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
// const COMBO_LIST = [
//   {
//     boxType: "COMBO_1",
//     supply: 1000,
//     unitPrice: 0.01,
//     startTime: 1661241624000,
//     endTime: 1661932824000,
//     items: ["ANGEL", "MINION_PARTS_COMMON", "COSTUME_COMMON"],
//   },
//   {
//     boxType: "COMBO_2",
//     supply: 1000,
//     unitPrice: 0.01,
//     startTime: 1661241624000,
//     endTime: 1661932824000,
//     items: ["ANGEL", "MINION_PARTS_EPIC", "COSTUME_COMMON"],
//   },
//   {
//     boxType: "COMBO_3",
//     supply: 1000,
//     unitPrice: 0.01,
//     startTime: 1661241624000,
//     endTime: 1661932824000,
//     items: ["ANGEL", "MINION_PARTS_COMMON", "COSTUME_EPIC"],
//   },
//   {
//     boxType: "COMBO_4",
//     supply: 1000,
//     unitPrice: 0.01,
//     startTime: 1661241624000,
//     endTime: 1661932824000,
//     items: ["ANGEL", "MINION_PARTS_EPIC", "COSTUME_EPIC"],
//   },
// ];

export default function MintingList() {
  const { setting, minting } = useSelector((state) => state);
  const { library } = setting;
  const { mintingBoxList, mintingComboList } = minting;
  const [selectedList, setSelectedList] = useState(null);
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const param = {
      page: 1,
      pageSize: 200,
      getMeta: false,
    };
    post(
      "/nft/templates",
      param,
      (result) => {
        setTemplate(result.items);
      },
      () => {}
    );
  }, []);

  const _handleSelectRound = (list) => {
    setSelectedList(list);
  };

  const _handleRemoveSelectedRound = () => {
    setSelectedList(null);
  };

  return mintingBoxList && mintingComboList ? (
    <>
      <CustomContainer>
        <CustomCard>
          <CustomStep orientation="vertical">
            {mintingBoxList.map((round, index) => {
              return (
                <Step
                  key={index}
                  active={true}
                  className={index === mintingBoxList.length - 1 ? "end" : ""}
                >
                  <StepLabel sx={{ marginLeft: "2rem" }}>
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
                          Minting NFT Box Round {round.roundNumber}
                        </Title>
                      }
                    />
                  </StepLabel>
                  <StepContent sx={{ width: "100%", mt: 1 }}>
                    <Grid container spacing={5}>
                      <Grid item xs={12} md={6}>
                        <RoundBoxDetail
                          round={round}
                          library={library}
                          _handleSelectRound={_handleSelectRound}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {mintingComboList[index] ? (
                          <RoundComboDetail
                            round={mintingComboList[index]}
                            library={library}
                            _handleSelectRound={_handleSelectRound}
                          />
                        ) : null}
                      </Grid>
                    </Grid>
                  </StepContent>
                </Step>
              );
            })}
          </CustomStep>
        </CustomCard>
      </CustomContainer>
    </>
  ) : (
    <Loader />
  );
}
