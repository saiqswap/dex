import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { useDispatch, useSelector } from "react-redux";
import { formatNumberWithDecimal, _formatNumber } from "../settings/format";
import { toast } from "react-toastify";
import { post } from "../utils/api";
import { EndpointConstant } from "../settings/endpoint";
import { _showAppError } from "../store/actions/settingActions";
import { _getBalance } from "../store/actions/userActions";
import CustomLoader from "../components/common/CustomLoader";
import {
  CustomButton,
  CustomLoadingButton,
} from "../components/common/CustomButton";
import { CoinList } from "../settings/constants";
import CustomNumberInput from "../components/common/CustomNumberInput";
import PolicyCheck from "../components/box-minting/PolicyCheck";
import Title from "../components/box-minting/Title";

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

const CustomFixedBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  width: "100vw",
  height: "100vh",
  background: "url('/images/backgrounds/background.png')",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  top: 0,
  left: 0,
  flexDirection: "column",
}));

const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  borderRadius: "20px",
  width: "100%",
  maxWidth: 500,
  padding: theme.spacing(5),
}));

export default function SwapPage() {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const [fromAmount, setFromAmount] = useState("0");
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [checked, setChecked] = useState(false);
  const { user } = useSelector((state) => state);
  const { balances } = user;
  const [availableAmount, setAvailableAmount] = useState(0);
  const [verifySwap, setVerifySwap] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const _onChangeAmount = (value) => {
    setFromAmount(value);
  };

  useEffect(() => {
    if (balances) {
      const INCBalance = balances.find((b) => b.asset === "INC").amount;
      setAvailableAmount(INCBalance);
    }
  }, [balances]);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const _handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const _checkVerifySwap = (_callback) => {
    const fFromAmount = parseFloat(_formatNumber(fromAmount, 2));
    if (!fFromAmount) {
      toast.error(library.THE_AMOUNT_OF_ING_IS_TOO_SMALL);
    } else if (fFromAmount > availableAmount) {
      toast.error(library.INSUFFICIENT_BALANCE);
    } else {
      setLoading(true);
      post(
        EndpointConstant.FUND_VERIFY_SWAP,
        {
          asset: "INC",
          quoteAsset: "ING",
          amount: fFromAmount,
        },
        (data) => {
          setVerifySwap(data);
          _callback();
          setLoading(false);
        },
        (error) => {
          dispatch(_showAppError(error));
          setLoading(false);
        }
      );
    }
  };

  const _handleSwap = (_callback) => {
    if (checked) {
      setLoading(true);
      _handleNext();
      const fFromAmount = parseFloat(_formatNumber(fromAmount, 2));
      post(
        EndpointConstant.FUND_SWAP,
        {
          asset: "INC",
          quoteAsset: "ING",
          amount: fFromAmount,
        },
        (data) => {
          toast.success("Success");
          // setTimeout(() => {
          setLoading(false);
          // setTimeout(() => {
          setFromAmount("0");
          setActiveStep(0);
          setChecked(false);
          // }, 500);
          // }, 3000);
          // setVerifySwap(data);
          dispatch(_getBalance());
        },
        (error) => {
          dispatch(_showAppError(error));
        }
      );
    } else {
      toast.error(library.PLEASE_READ_AND_ACCEPT_FOR_SWAP);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 0) {
      _checkVerifySwap(_handleNext);
    } else if (activeStep === 1) {
      _handleSwap(_handleNext);
    } else {
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: "Information",
      component: (
        <Information
          fromAmount={fromAmount}
          availableAmount={availableAmount}
          _handleChangeFromAmount={_onChangeAmount}
        />
      ),
    },
    {
      label: "Confirm",
      component: (
        <ConfirmComponent
          verifySwap={verifySwap}
          fromAmount={fromAmount}
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
    <CustomFixedBox>
      <CustomBox>
        <Box
          component="form"
          sx={{ textAlign: "left" }}
          onSubmit={handleNext}
          noValidate
        >
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
          <Fragment>
            <Box my={5}>{steps[activeStep].component}</Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <CustomButton
                color="inherit"
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ mr: 1, width: "50%" }}
              >
                Back
              </CustomButton>
              <Box sx={{ flex: "1 1 auto" }} />
              <CustomLoadingButton
                onClick={handleNext}
                sx={{
                  width: "50%",
                }}
                loading={loading}
                type="submit"
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </CustomLoadingButton>
            </Box>
          </Fragment>
        </Box>
      </CustomBox>
    </CustomFixedBox>
  );
}

const Information = ({
  fromAmount,
  availableAmount,
  _handleChangeFromAmount,
}) => {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  return (
    <>
      <Box textAlign="right">
        <Typography
          variant="caption"
          onClick={() => _handleChangeFromAmount(availableAmount.toString())}
          sx={{
            cursor: "pointer",
          }}
        >
          {library.BALANCE}: {formatNumberWithDecimal(availableAmount, 2)}{" "}
          {CoinList.INC}
        </Typography>
      </Box>
      <CustomNumberInput
        InputProps={{
          endAdornment: (
            <img src="/images/coins/INC.png" width="50px" alt="ing-logo" />
          ),
          step: "any",
        }}
        fullWidth
        label="INC amount"
        onChange={(e) => _handleChangeFromAmount(e.target.value)}
        value={fromAmount}
      />
    </>
  );
};

const ConfirmComponent = ({
  fromAmount,
  toAmount,
  checked,
  _handleChecked,
  verifySwap,
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
        <Typography>{formatNumberWithDecimal(fromAmount, 2)} INC</Typography>
      </Box>
      <Box display="fex" justifyContent="space-between">
        <Typography>{library.FEES}</Typography>
        <Typography>
          {verifySwap.fee} {verifySwap.asset}
        </Typography>
      </Box>
      <Box display="fex" justifyContent="space-between">
        <Typography>{library.ESTIMATED_RECEIVED}</Typography>
        <Typography>
          {formatNumberWithDecimal(verifySwap.amount, 2)}{" "}
          {verifySwap.quoteAsset}
        </Typography>
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
