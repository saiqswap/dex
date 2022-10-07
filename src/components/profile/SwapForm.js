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
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CoinList } from "../../settings/constants";
import { EndpointConstant } from "../../settings/endpoint";
import { formatNumberWithDecimal } from "../../settings/format";
import { _getBalance } from "../../store/actions/userActions";
import { post } from "../../utils/api";
import PolicyCheck from "../box-minting/PolicyCheck";
import { CustomButton, CustomLoadingButton } from "../common/CustomButton";
import CustomLoader from "../common/CustomLoader";
import CustomModal from "../common/CustomModal";
import CustomNumberInput from "../common/CustomNumberInput";

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

  const _handleShowError = (error) => {
    console.log(error);
    toast.error(
      library[error.code]
        ? library[error.code]
        : `${library.SOMETHING_WRONG} Error code: ${error.code} [${error.msg}]`
    );
  };

  const _checkVerifySwap = (_callback) => {
    const fFromAmount = parseFloat(formatNumberWithDecimal(fromAmount, 2));
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
          amount: fromAmount,
        },
        (data) => {
          setVerifySwap(data);
          _callback();
          setLoading(false);
        },
        (error) => {
          _handleShowError(error);
          setLoading(false);
        }
      );
    }
  };

  const _handleSwap = (_callback) => {
    if (checked) {
      setLoading(true);
      _handleNext();
      const fFromAmount = parseFloat(formatNumberWithDecimal(fromAmount, 2));
      post(
        EndpointConstant.FUND_SWAP,
        {
          asset: "INC",
          quoteAsset: "ING",
          amount: fFromAmount,
        },
        (data) => {
          setTimeout(() => {
            _close();
            setLoading(false);
            setTimeout(() => {
              setFromAmount("0");
              setActiveStep(0);
            }, 500);
          }, 3000);
          setVerifySwap(data);
          dispatch(_getBalance());
        },
        (error) => {
          _handleShowError(error);
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
          // toAmount={verifySwap.amount}
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
    <CustomModal open={showSwap} _close={_close} isShowCloseButton={!loading}>
      <Box sx={{ width: "100%" }} py={4} px={2} textAlign="left">
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
      </Box>
    </CustomModal>
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
          onClick={() => _handleChangeFromAmount(availableAmount)}
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
