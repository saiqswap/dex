import {
  Box,
  Hidden,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { formatNumberWithDecimal } from "../../settings/format";

const CustomContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  borderRadius: "20px",
  padding: theme.spacing(4),
}));

const CustomStepper = styled(Stepper)(({ theme }) => ({
  color: "red",
  " .MuiStepLabel-label.Mui-active": {
    color: "var(--text-color)",
  },
  " .MuiStepLabel-label.Mui-completed": {
    color: "var(--text-color)",
  },
  " .MuiStepIcon-text": {
    fill: "#000",
  },
  " .MuiSvgIcon-root.Mui-completed": {
    background: "#fff",
    borderRadius: "50%",
    fill: "green",
  },
}));

export default function SlotProcess({ selectedPackage }) {
  const { user, stakingStore } = useSelector((state) => state);
  const { information } = user;
  const { myStakes } = stakingStore;

  return selectedPackage ? (
    <>
      <Hidden mdDown>
        <CustomContainer>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="body2">Staking slot process</Typography>
            <Typography variant="body2" color="primary">
              Your staking balance:{" "}
              {formatNumberWithDecimal(myStakes?.stakingBalance, 2)} ING
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <Box key={index} flex={1} textAlign="center">
                <Typography variant="caption" color="#fff">
                  SLOT {item}
                </Typography>
              </Box>
            ))}
          </Box>
          <CustomStepper activeStep={information.limitRiSlot} alternativeLabel>
            {[
              "Free",
              "Free",
              "Free",
              formatNumberWithDecimal(selectedPackage.amountToOpenSlot4, 0),
              formatNumberWithDecimal(selectedPackage.amountToOpenSlot5, 0),
              formatNumberWithDecimal(selectedPackage.amountToOpenSlot6, 0),
            ].map((label, index) => (
              <Step key={label + index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </CustomStepper>
        </CustomContainer>
      </Hidden>
      <Hidden mdUp>
        <CustomContainer>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="body2">Staking slot process</Typography>
            <Typography variant="body2" color="primary">
              Your staking balance:{" "}
              {formatNumberWithDecimal(myStakes?.stakingBalance, 2)} ING
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            {[4, 5, 6].map((item, index) => (
              <Box key={index} flex={1} textAlign="center">
                <Typography variant="caption" color="#fff">
                  SLOT {item}
                </Typography>
              </Box>
            ))}
          </Box>
          <CustomStepper
            activeStep={information.limitRiSlot - 3}
            alternativeLabel
          >
            {[
              formatNumberWithDecimal(selectedPackage.amountToOpenSlot4, 0),
              formatNumberWithDecimal(selectedPackage.amountToOpenSlot5, 0),
              formatNumberWithDecimal(selectedPackage.amountToOpenSlot6, 0),
            ].map((label, index) => (
              <Step key={label + index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </CustomStepper>
        </CustomContainer>
      </Hidden>
    </>
  ) : null;
}
