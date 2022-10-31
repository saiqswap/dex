import {
  Box,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CustomStack, PriceBox } from "../components/box-minting/MintingStyles";
import PolicyCheck from "../components/box-minting/PolicyCheck";
import CustomBlueSmallModal from "../components/common/CustomBlueSmallModal";
import { CustomLoadingButton } from "../components/common/CustomButton";
import CustomNumberInput from "../components/common/CustomNumberInput";
import StakePolicy from "../components/staking/StakePolicy";
import StakingHistory from "../components/staking/StakingHistory";
import { CoinList } from "../settings/constants";
import { EndpointConstant } from "../settings/endpoint";
import { formatNumberWithDecimal, _formatNumber } from "../settings/format";
import { _showAppError } from "../store/actions/settingActions";
import { _getMyStakes, _getPackageList } from "../store/actions/stakingActions";
import { post } from "../utils/api";

const CustomContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  borderRadius: "20px",
  padding: theme.spacing(5),
}));

export default function TokenStaking() {
  const { user, setting, stakingStore } = useSelector((state) => state);
  const { balances, information } = user;
  const { library } = setting;
  const [INGBalance, setINGBalance] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const { packageList } = stakingStore;
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [fAmount, setFAmount] = useState(0);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (packageList && packageList.length > 0) {
      setSelectedItem(packageList[0]);
    }
  }, [packageList]);

  useEffect(() => {
    dispatch(_getPackageList());
  }, [dispatch]);

  useEffect(() => {
    if (balances) {
      const ING = balances.find((item) => item.asset === CoinList.ING);
      setINGBalance(ING.amount);
    }
  }, [balances]);

  const _handleSubmit = (e) => {
    e.preventDefault();
    const fAmount = _formatNumber(e.target.amount.value, 2);
    setFAmount(fAmount);
    if (information) {
      const fFromAmount = parseFloat(_formatNumber(fAmount, 2));
      if (!fFromAmount) {
        toast.error(library.THE_AMOUNT_OF_ING_IS_TOO_SMALL);
      } else if (fFromAmount > INGBalance) {
        toast.error(library.INSUFFICIENT_BALANCE);
      } else {
        setConfirming(true);
      }
    }
  };

  const _handleStake = () => {
    if (checked) {
      setLoading(true);
      setConfirming(false);
      post(
        EndpointConstant.STAKING_STAKE,
        {
          packageId: selectedItem.id,
          amount: fAmount,
        },
        () => {
          setLoading(false);
          toast.success("Success");
          dispatch(_getMyStakes(packageList));
        },
        (error) => {
          dispatch(_showAppError(error));
          setLoading(false);
        }
      );
    } else {
      toast.error(library.PLEASE_READ_AND_ACCEPT_FOR_STAKING);
    }
  };

  return (
    <>
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomContainer>
                <Box component="form" onSubmit={_handleSubmit} noValidate>
                  <CustomStack>
                    <Box mr={3}>
                      <Typography>APY </Typography>
                    </Box>
                    {selectedItem &&
                      packageList?.map((item, index) => (
                        <PriceBox
                          sx={{ minWidth: 70 }}
                          key={index}
                          onClick={() => setSelectedItem(item)}
                          className={
                            selectedItem.id === item.id ? "active" : ""
                          }
                        >
                          {item.annualInterestRate}%
                        </PriceBox>
                      ))}
                  </CustomStack>
                  <Box textAlign="right" mb={1}>
                    <Typography
                      variant="caption"
                      color="#fff"
                      textAlign="right"
                    >
                      {library.BALANCE}:{" "}
                      {formatNumberWithDecimal(INGBalance, 2)} {CoinList.ING}
                    </Typography>
                  </Box>
                  <CustomNumberInput
                    fullWidth
                    label="Amount"
                    placeholder="Please enter ING amount"
                    id="amount"
                    name="amount"
                    disabled={loading}
                    InputProps={{
                      step: "any",
                      type: "number",
                      endAdornment: (
                        <img
                          src={`/images/coins/${CoinList.ING}.png`}
                          width="50px"
                          alt="ing-logo"
                        />
                      ),
                    }}
                  />
                  <Box mt={2}></Box>
                  <CustomLoadingButton loading={loading} type="submit">
                    Stake {CoinList.ING}
                  </CustomLoadingButton>
                </Box>
              </CustomContainer>
            </Grid>
            <Grid item xs={6}>
              <CustomContainer>Top Staking</CustomContainer>
            </Grid>
            <Grid item xs={12}>
              <CustomContainer sx={{ p: 0, borderRadius: 0 }}>
                <StakingHistory />
              </CustomContainer>
            </Grid>
          </Grid>
        </Container>
      </div>
      <CustomBlueSmallModal
        open={confirming}
        _close={() => setConfirming(false)}
        isShowCloseButton={!loading}
      >
        <Box>
          <Typography textAlign="left" className="custom-font" variant="h6">
            Confirming
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Package</Typography>
            <Typography variant="body2">{selectedItem?.packageType}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Amount</Typography>
            <Typography variant="body2">
              {formatNumberWithDecimal(fAmount)} {CoinList.ING}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Interest Rate</Typography>
            <Typography variant="body2">
              {selectedItem?.annualInterestRate}%
            </Typography>
          </Box>
        </Box>
        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
            label={<StakePolicy />}
          />
        </FormGroup>
        <CustomLoadingButton
          loading={loading}
          fullWidth
          onClick={_handleStake}
          sx={{ mt: 3 }}
        >
          Submit
        </CustomLoadingButton>
      </CustomBlueSmallModal>
    </>
  );
}
