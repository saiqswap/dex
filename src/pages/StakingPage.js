import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Hidden,
  styled,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CustomStack, PriceBox } from "../components/box-minting/MintingStyles";
import { CustomLoadingButton } from "../components/common/CustomButton";
import CustomNumberInput from "../components/common/CustomNumberInput";
import RIMintingCheck from "../components/common/RIMintingCheck";
import SlotProcess from "../components/staking/SlotProcess";
import StakePolicy from "../components/staking/StakePolicy";
import StakingHistory from "../components/staking/StakingHistory";
import StakingNotice from "../components/staking/StakingNotice";
import { CoinList } from "../settings/constants";
import { EndpointConstant } from "../settings/endpoint";
import { formatNumberWithDecimal } from "../settings/format";
import { _showAppError } from "../store/actions/settingActions";
import { _getMyStakes, _getPackageList } from "../store/actions/stakingActions";
import { _getBalance, _getNewProfile } from "../store/actions/userActions";
import { post } from "../utils/api";

const CustomContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  borderRadius: "20px",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

export default function StakingPage() {
  return (
    <RIMintingCheck isText={true}>
      <UserStaking />
    </RIMintingCheck>
  );
}

function UserStaking() {
  const { user, setting, stakingStore } = useSelector((state) => state);
  const { balances, information } = user;
  const { library } = setting;
  const [INGBalance, setINGBalance] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const { packageList } = stakingStore;
  const [loading, setLoading] = useState(false);
  const [fAmount, setFAmount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [verifyData, setVerifyData] = useState(null);
  const refInput = useRef(null);
  const [oldFAmount, setOldFAmount] = useState(0);

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
    if (information) {
      if (!fAmount) {
        toast.error(library.THE_AMOUNT_OF_ING_IS_TOO_SMALL);
      } else if (fAmount > INGBalance) {
        toast.error(library.INSUFFICIENT_BALANCE);
      } else {
        _handleStake();
      }
    } else {
      toast.error(library.PLEASE_LOGIN);
    }
  };

  const _handleStake = () => {
    if (information) {
      if (checked) {
        setLoading(true);
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
            dispatch(_getBalance());
            dispatch(_getNewProfile());
          },
          (error) => {
            dispatch(_showAppError(error));
            setLoading(false);
          }
        );
      } else {
        toast.error(library.PLEASE_READ_AND_ACCEPT_FOR_STAKING);
      }
    } else {
      toast.error(library.PLEASE_LOGIN);
    }
  };

  useEffect(() => {
    const _handleVerifyStake = () => {
      setOldFAmount(fAmount);
      if (!fAmount) {
        setVerifyData(null);
      } else {
        setLoading(true);
        post(
          EndpointConstant.STAKING_VERIFY_STAKE,
          {
            packageId: selectedItem.id,
            amount: fAmount,
          },
          (data) => {
            setVerifyData(data);
            setLoading(false);
          },
          (error) => {
            dispatch(_showAppError(error));
            setLoading(false);
          }
        );
      }
    };
    if (!loading && oldFAmount !== fAmount) {
      _handleVerifyStake(fAmount);
    }
  }, [dispatch, fAmount, loading, oldFAmount, selectedItem]);

  useEffect(() => {
    const _handleVerifyStake = () => {
      setOldFAmount(fAmount);
      if (!fAmount) {
        setVerifyData(null);
      } else {
        setLoading(true);
        post(
          EndpointConstant.STAKING_VERIFY_STAKE,
          {
            packageId: selectedItem.id,
            amount: fAmount,
          },
          (data) => {
            setVerifyData(data);
            setLoading(false);
          },
          (error) => {
            dispatch(_showAppError(error));
            setLoading(false);
          }
        );
      }
    };
    if (selectedItem) {
      _handleVerifyStake();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedItem]);

  const _onChangeAmount = (e) => {
    const fAmount = parseFloat(e.target.value);
    setFAmount(fAmount);
  };

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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomContainer>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Hidden smDown>
                  <Box display="flex" alignItems="center">
                    <img src="/images/coins/ING.png" height={60} alt="ING" />
                    <Typography
                      variant="h6"
                      fontWeight={900}
                      className="custom-font"
                    >
                      {CoinList.ING}
                    </Typography>
                  </Box>
                </Hidden>
                <Box>
                  <Typography>Reference APR</Typography>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    className="custom-font"
                  >
                    {selectedItem?.annualInterestRate}%
                  </Typography>
                </Box>
                <Box>
                  <Typography>Tenor</Typography>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    className="custom-font"
                  >
                    Flexible
                  </Typography>
                </Box>
              </Box>
            </CustomContainer>
          </Grid>
          <Grid item xs={12}>
            <SlotProcess selectedPackage={selectedItem} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomContainer>
              <Box component="form" onSubmit={_handleSubmit} noValidate>
                <CustomStack>
                  {selectedItem &&
                    packageList?.map((item, index) => (
                      <PriceBox
                        sx={{ minWidth: 70 }}
                        key={index}
                        onClick={() => setSelectedItem(item)}
                        className={selectedItem.id === item.id ? "active" : ""}
                      >
                        {item.days} days
                      </PriceBox>
                    ))}
                </CustomStack>
                <Box textAlign="right" mb={1}>
                  <Typography variant="caption" color="#fff" textAlign="right">
                    {library.BALANCE}: {formatNumberWithDecimal(INGBalance, 4)}{" "}
                    {CoinList.ING}
                  </Typography>
                </Box>
                <CustomNumberInput
                  fullWidth
                  label="Amount"
                  placeholder="Please enter ING amount"
                  id="amount"
                  name="amount"
                  inputProps={{
                    autoFocus: true,
                    step: "any",
                    type: "number",
                    min: "0",
                    ref: refInput,
                    onWheel: (e) => e.target.blur(),
                    endAdornment: (
                      <img
                        src={`/images/coins/${CoinList.ING}.png`}
                        width="50px"
                        alt="ing-logo"
                      />
                    ),
                  }}
                  onChange={_onChangeAmount}
                />
                <Box mt={2}></Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Projected Profit: </Typography>
                  <Typography variant="body2">
                    {verifyData
                      ? `${formatNumberWithDecimal(
                          verifyData.profitPerAnnualInterestRate,
                          4
                        )} ${CoinList.ING} / day`
                      : `--/-- ${CoinList.ING} / day`}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Available Slots:</Typography>
                  <Typography variant="body2">
                    {verifyData ? (
                      <>
                        {`active ${verifyData.slotCanOpen}`}
                        <sup>th</sup> slot
                      </>
                    ) : (
                      "--/--"
                    )}
                  </Typography>
                </Box>
                <Box mt={2}></Box>
                <CustomContainer mt={2} sx={{ px: 2, py: 1 }}>
                  <Typography>Rule:</Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Subscription Date:</Typography>
                    <Typography variant="body2">
                      {verifyData
                        ? moment(verifyData.subscriptionTime).format(
                            "YYYY-MM-DD"
                          )
                        : "--/--"}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Redemption Period:</Typography>
                    <Typography variant="body2">
                      {verifyData ? verifyData.redemptionPeriod : "--/--"}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">
                      Profit Distribution Date:
                    </Typography>
                    <Typography variant="body2">
                      {verifyData
                        ? moment(verifyData.profitDistributionTime).format(
                            "YYYY-MM-DD"
                          )
                        : "--/--"}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">
                      Unstake fee (before unstake date):
                    </Typography>
                    <Typography variant="body2">
                      {verifyData ? "1%" : "--/--"}
                    </Typography>
                  </Box>
                </CustomContainer>
                <Box mt={2} mb={3}>
                  <Typography variant="caption">
                    * APR does not mean the actual or predicted returns in fiat
                    currency
                  </Typography>
                  <FormGroup>
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
                </Box>
                <Box display="flex">
                  <CustomLoadingButton loading={loading} type="submit">
                    Subscribe
                  </CustomLoadingButton>
                </Box>
              </Box>
            </CustomContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomContainer>
              <StakingNotice />
            </CustomContainer>
          </Grid>
          <Grid item xs={12}>
            <StakingHistory />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
