import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Step,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PolicyCheck from "../box-minting/PolicyCheck";
import { CustomButton } from "../common/CustomButton";
import CustomLoader from "../common/CustomLoader";
import CustomModal from "../common/CustomModal";

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
}));

export default function SwapForm({ showSwap, _close }) {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const [fromAmount, setFromAmount] = useState("0");
  const [toAmount, setToAmount] = useState("0");
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [checked, setChecked] = useState(false);
  const { user } = useSelector((state) => state);
  const { balances } = user;
  // const [availableAmount setAvailableAmount] = useSelector(0);

  useEffect(() => {
    if (balances) {
      console.log(balances);
    }
  }, [balances]);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    {
      label: "Information",
      component: (
        <Information
          fromAmount={fromAmount}
          toAmount={toAmount}
          _handleChangeFromAmount={(e) => setFromAmount(e.target.value)}
        />
      ),
    },
    {
      label: "Confirm",
      component: (
        <ConfirmComponent
          fromAmount={fromAmount}
          toAmount={toAmount}
          checked={checked}
          _handleChecked={(e) => setChecked(e.target.checked)}
        />
      ),
    },
    {
      label: "Swap",
      component: (
        <Box pt={5}>
          <Box height={100} position="relative">
            <CustomLoader />
          </Box>
          <Typography variant="h6" textAlign="center" fontWeight={500}>
            Waiting for swap progress
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <CustomModal open={showSwap} _close={_close} isShowCloseButton={true}>
      <Box sx={{ width: "100%" }} py={4} px={2} textAlign="left">
        {/* <Typography variant="h6" mb={3}>
          Swap INC to ING
        </Typography> */}
        <Box component="form" sx={{ textAlign: "left" }}>
          <CustomStepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={step.label} {...stepProps}>
                  <StepLabel {...labelProps}>{step.label}</StepLabel>
                </Step>
              );
            })}
          </CustomStepper>
          {activeStep === steps.length ? (
            <Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <CustomButton onClick={handleReset}>Reset</CustomButton>
              </Box>
            </Fragment>
          ) : (
            <Fragment>
              <Box my={5}>{steps[activeStep].component}</Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <CustomButton
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1, width: "50%" }}
                >
                  Back
                </CustomButton>
                <Box sx={{ flex: "1 1 auto" }} />
                <CustomButton
                  onClick={handleNext}
                  sx={{
                    width: "50%",
                  }}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </CustomButton>
              </Box>
            </Fragment>
          )}
        </Box>
      </Box>
    </CustomModal>
  );
}

const Information = ({ fromAmount, toAmount, _handleChangeFromAmount }) => {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  return (
    <>
      <TextField
        label="INC amount"
        fullWidth
        onChange={_handleChangeFromAmount}
        value={fromAmount}
        InputProps={{
          endAdornment: <img src="/images/coins/INC.png" width="50px" />,
        }}
      />
      {/* <Box textAlign="center" my={2}>
        <SouthIcon />
      </Box>
      <TextField
        label="You will receive"
        fullWidth
        //   onChange={(e) => setFromAmount(e.target.value)}
        value={toAmount}
        InputProps={{
          endAdornment: <img src="/images/coins/ING.png" width="50px" />,
        }}
      />
      <Box textAlign="right" mt={2}>
        <Typography>Fee: 0 INC</Typography>
      </Box> */}
    </>
  );
};

const ConfirmComponent = ({
  fromAmount,
  toAmount,
  checked,
  _handleChecked,
}) => {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={5}
        mb={2}
        py={1}
        px={3}
        sx={{
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "4px",
        }}
      >
        <Box>
          <Box display="flex" alignItems="center">
            <img src="/images/coins/INC.png" width="50px" alt="inc" />
            <Typography>INC</Typography>
          </Box>
        </Box>
        <TrendingFlatIcon fontSize="large" />
        <Box>
          <Box display="flex" alignItems="center">
            <img src="/images/coins/ING.png" width="50px" alt="ing" />
            <Typography>ING</Typography>
          </Box>
        </Box>
      </Box>
      <Box display="fex" justifyContent="space-between">
        <Typography>{library.SEND_AMOUNT}</Typography>
        <Typography>{fromAmount} INC</Typography>
      </Box>
      <Box display="fex" justifyContent="space-between">
        <Typography>{library.FEES}</Typography>
        <Typography>{0} INC</Typography>
      </Box>
      <Box display="fex" justifyContent="space-between">
        <Typography>{library.ESTIMATED_RECEIVED}</Typography>
        <Typography>{fromAmount} INC</Typography>
      </Box>
      <FormGroup sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={_handleChecked} />}
          label={<PolicyCheck />}
        />
      </FormGroup>
    </>
  );
};
