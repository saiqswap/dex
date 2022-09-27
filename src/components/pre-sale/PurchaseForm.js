import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { parseUnits } from "ethers/lib/utils";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _checkBeforePurchase, _getReceipt, _purchase } from "../../onchain";
import { provider } from "../../onchain/onchain";
import presaleConfig from "../../onchain/presale-config";
import { PRE_SALE_TOKEN, SUPPORT_TOKENS } from "../../settings/constants";
import {
  deleteText,
  formatAddress,
  formatNumberWithDecimal,
  formatPrice,
} from "../../settings/format";
import { _getPreSaleRoundList } from "../../store/actions/preSaleActions";
import { _getBalance } from "../../store/actions/userActions";
import { CustomButton, CustomLoadingButton } from "../common/CustomButton";
import CustomSmallModal from "../common/CustomSmallModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const USDT_TOKEN = "USDT";

const PurchaseBox = styled(Box)({
  borderRadius: "7px",
  border: "1px solid var(--border-color)",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  backdropFilter: "blur(20px)",
});
const CustomIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  background: "transparent!important",
  border: "none!important",
  "&.Mui-disabled": {
    opacity: 0.6,
  },
}));
const CustomBox = styled(Box)(({ theme }) => ({
  textAlign: "left",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
const SelectAsset = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(0.5),
  cursor: "pointer",
  userSelect: "none",
  "&:hover": {
    opacity: 0.9,
  },
}));
const MaxButton = styled(Button)(({ theme }) => ({
  border: "2px solid var(--primary-color)",
  borderRadius: "7px!important",
  minWidth: "unset!important",
  padding: "2px 16px!important",
  position: "absolute",
  right: 0,
  color: "var(--primary-color)!important",
  fontSize: 10,
  fontWeight: 900,
  "&:hover": {
    backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  },
}));
const CustomTextField = styled(TextField)(() => ({
  borderRadius: "4px!important",
  input: {
    textAlign: "right",
  },
}));
const LinearProgressCustom = styled(LinearProgress)(() => ({
  borderRadius: "10px",
  height: "15px",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  boxShadow: "0 0 10px #F6B323",
  ".MuiLinearProgress-bar": {
    backgroundColor: "#F6B323",
  },
}));
const CustomMainBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const percentValues = [10, 25, 50, 75, 100];

function formatSpecialAmount(string) {
  string = deleteText(string);
  return string.split(".").join(".");
}

export default function PurchaseForm({ data }) {
  const { setting, user } = useSelector((state) => state);
  const { library } = setting;
  const { walletAddress, balances, partnerRef } = user;
  const [from, setFrom] = useState("BNB");
  const [progress, setProgress] = useState(0);
  const [toBalance, setToBalance] = useState("");
  const [fromBalance, setFromBalance] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const now = moment().utc().unix() * 1000;
  const [price, setPrice] = useState(0);
  const [minimum, setMinimum] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const dispatch = useDispatch();
  const [available, setAvailable] = useState(0);
  const [isDisableSync, setIsDisableSync] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [staticSold, setStaticSold] = useState(0);
  const [staticSold_0, setStaticSold_0] = useState(0);

  const staticTimer = (endTime, total) => {
    const now = moment().utc().unix() * 1000;
    // const now = 1664190000000;
    let usedTime = endTime - now;
    usedTime = usedTime / 1000 / 60;
    usedTime = 240 - usedTime;
    const amountPerMinute = total / 240;
    const tempStaticSold = usedTime * amountPerMinute;
    console.log(tempStaticSold);
    if (tempStaticSold > 0) {
      setStaticSold(tempStaticSold);
    }
  };

  useEffect(() => {
    if (data.roundId === "0x1000000000000000000000000000000000000001") {
      setStaticSold_0(7000000);
    }
    if (data.roundId === "0x1000000000000000000000000000000000000002") {
      setStaticSold_0(14000000 + 24000000);
    }
  }, [data]);

  useEffect(() => {
    if (data.roundId === "0x1000000000000000000000000000000000000001") {
      const now = moment().utc().unix() * 1000;
      const total = data.totalSupply - (data.currentSold + staticSold_0);
      const endTime = 1663767900000;
      if (now > endTime) {
        setStaticSold(total);
      } else {
        staticTimer(endTime, total);
      }
    }
    if (data.roundId === "0x1000000000000000000000000000000000000002") {
      //1st: 14,000,000
      //2nd: 24,000,000 9:30 -> 19:30
      //3nd: 14,000,000 14:00 -> 16:00
      const now = moment().utc().unix() * 1000;
      const total = 14000000;
      const endTime = 1664190000000;
      if (now > endTime) {
        setStaticSold(total);
      } else {
        staticTimer(endTime, total);
      }
    }
  }, [data, staticSold_0]);

  // useEffect(() => {
  //   console.log({ staticSold, currentSold: data.currentSold });
  // }, [data.currentSold, staticSold]);

  useEffect(() => {
    if (balances) {
      const tempToBalance = balances.find(
        (b) => b.asset === PRE_SALE_TOKEN
      )?.vestingBalance;
      let tempFromBalance = balances.find(
        (b) => b.asset === from
      )?.onChainBalance;
      setToBalance(tempToBalance);
      setFromBalance(tempFromBalance);
    }
  }, [balances, from]);

  //set price
  useEffect(() => {
    let price = 0;
    if (data) {
      if (from === USDT_TOKEN) {
        price = data.USDPrice;
      } else {
        price = data.nativeTokenPrice;
      }
      setPrice(price);
    }
  }, [data, from]);

  const _handleSync = () => {
    dispatch(_getPreSaleRoundList());
    dispatch(_getBalance(walletAddress, provider));
    setIsDisableSync(true);
    setTimeout(() => {
      setIsDisableSync(false);
    }, 10000);
  };

  const _changeToAmount = (value) => {
    value = formatSpecialAmount(value);
    setToAmount(value);
    value = Number(value).toFixed(8);
    let tempTotal = parseFloat(value) * price;
    tempTotal = tempTotal ? tempTotal : "";
    setFromAmount(tempTotal);
  };

  const _changeFromAmount = (value) => {
    value = formatSpecialAmount(value);
    setFromAmount(value);
    value = Number(value).toFixed(8);
    let tempAmount = price ? parseFloat(value) / price : 0;
    tempAmount = tempAmount ? tempAmount : "";
    setToAmount(tempAmount);
  };

  const _handleErrorCallback = () => {
    setPurchasing(false);
  };

  const _handleSubmit = (e) => {
    e.preventDefault();
    if (!walletAddress) {
      toast.error(library.PLEASE_CONNECT_WALLET);
    } else if (!partnerRef || partnerRef.trim().length === 0) {
      toast.error(library.YOU_MUST_HAS_A_REF_TO_BUY_ING_PRE_SALE);
    } else if (parseFloat(fromAmount) < parseFloat(minimum) || !toAmount) {
      toast.error(library.THE_AMOUNT_OF_ING_IS_TOO_SMALL);
    } else if (parseFloat(toAmount) > available) {
      toast.error(library.INSUFFICIENT_AMOUNT_OUT_ING_PRESALE);
    } else if (fromAmount > fromBalance) {
      toast.error(library.INSUFFICIENT_BALANCE);
    } else if (!checked) {
      toast.error(library.PLEASE_READ_AND_ACCEPT);
    } else {
      setShowConfirm(true);
    }
  };

  const _handlePurchase = () => {
    const boxScPrice = parseUnits(formatPrice(fromAmount, 8), 18);
    const contractAddress = SUPPORT_TOKENS.find(
      (t) => t.asset === from
    ).contractAddress;
    if (contractAddress) {
      setPurchasing(true);
      _checkBeforePurchase(
        presaleConfig.ESCROW_VESTING_CONTRACT_ADDRESS,
        contractAddress,
        boxScPrice,
        walletAddress,
        _handleErrorCallback
      ).then((success) => {
        if (success) {
          setIsApproved(true);
          _purchase(
            data.roundId,
            partnerRef,
            contractAddress,
            boxScPrice,
            _handleErrorCallback
          ).then((txHash) => {
            _getReceipt(txHash).then((success) => {
              if (success) {
                setIsConfirmed(true);
                setTimeout(() => {
                  setShowConfirm(false);
                  setPurchasing(false);
                  _handleSync();
                  toast.success(
                    `Congratulations. Buy ${formatNumberWithDecimal(
                      toAmount,
                      2
                    )} ${PRE_SALE_TOKEN} success.`
                  );
                }, 3000);
              }
            });
          });
        }
      });
    } else {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const _handleChangeAsset = () => {
    setFromAmount("");
    setToAmount("");
    if (from === "BNB") {
      setFrom(USDT_TOKEN);
    } else {
      setFrom("BNB");
    }
  };

  useEffect(() => {
    if (data) {
      setAvailable(
        data.totalSupply - (data.currentSold + staticSold + staticSold_0)
      );
      let tempMinimum = (1 / parseFloat(data.USDPrice)) * data.minUSD * price;
      tempMinimum = tempMinimum.toFixed(4);
      setMinimum(parseFloat(tempMinimum));
      const availablePercent = parseInt(
        ((data.currentSold + staticSold + staticSold_0) / data.totalSupply) *
          100
      );
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < availablePercent) {
            return prevProgress + 10;
          } else {
            clearInterval(timer);
            return prevProgress;
          }
        });
      }, 200);
      return () => {
        clearInterval(timer);
      };
    }
  }, [data, price, staticSold, staticSold_0]);

  const _getStatusProduct = (product) => {
    const { startAt, endAt, currentSold, totalSupply } = product;
    const start = startAt * 1000;
    const end = endAt * 1000;
    let status = "BUY_NOW";
    if (now - end > 0) {
      status = "END_TIME";
    }
    if (start - now > 0) {
      status = "COMING_SOON";
    }
    let tempMinimum = (1 / parseFloat(data.USDPrice)) * data.minUSD;
    if (
      totalSupply - (currentSold + staticSold + staticSold_0) <= tempMinimum ||
      product.isStaticEnd
    ) {
      status = "SOLD_OUT";
    }
    return status;
  };

  const status = _getStatusProduct(data);

  return (
    <>
      <Grid
        item
        xs={12}
        md={6}
        lg={5}
        sx={{
          zIndex: 999,
        }}
      >
        <PurchaseBox component="form" onSubmit={_handleSubmit}>
          <CustomMainBox>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={2}
            >
              <Box>
                <Typography fontWeight={600}>
                  {library.BUY} {data.name}
                </Typography>
                <Typography
                  variant="caption"
                  textAlign="right"
                  color="#1976d2"
                  fontWeight={900}
                >
                  Ref: {formatAddress(partnerRef)}
                </Typography>
              </Box>
              <Box>
                {/* <CustomIconButton size="small">
                <RestoreIcon />
              </CustomIconButton> */}
                <CustomIconButton
                  size="small"
                  onClick={_handleSync}
                  disabled={isDisableSync}
                >
                  <RefreshIcon />
                </CustomIconButton>
              </Box>
            </Box>
            <LinearProgressCustom variant="determinate" value={progress} />
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              px={1}
              mt={0.5}
            >
              <Typography variant="caption" color="#fff">
                {formatNumberWithDecimal(
                  data.currentSold + staticSold + staticSold_0,
                  2
                )}{" "}
                {PRE_SALE_TOKEN}
              </Typography>
              <Typography variant="caption" color="#fff">
                {formatNumberWithDecimal(data.totalSupply, 2)} {PRE_SALE_TOKEN}
              </Typography>
            </Box>
          </CustomMainBox>
          <Divider />
          <CustomMainBox>
            <CustomBox>
              <SelectAsset onClick={_handleChangeAsset} width="fit-content">
                <img src={`/images/coins/${from}.png`} width={20} alt={from} />
                <Typography variant="body2" fontWeight={900} ml={0.5} mr={0.2}>
                  {from}
                </Typography>
                <KeyboardArrowDownIcon />
              </SelectAsset>
              {walletAddress && (
                <Typography variant="caption" color="#fff">
                  {library.BALANCE}: {formatNumberWithDecimal(fromBalance, 8)}{" "}
                  {from}
                </Typography>
              )}
            </CustomBox>
            <CustomTextField
              fullWidth
              value={fromAmount}
              onChange={(e) => _changeFromAmount(e.target.value)}
              focused
              placeholder="0.0"
              size="small"
            />
            <Box mt={1} mb={1} textAlign="center" position="relative">
              <IconButton
                sx={{
                  background: "transparent!important",
                }}
                disabled
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <MaxButton onClick={() => _changeFromAmount(fromBalance)}>
                MAX
              </MaxButton>
            </Box>
            <CustomBox>
              <Box display="flex" alignItems="center" mb={0.5}>
                <img
                  src="/images/coins/ING.png"
                  width={20}
                  style={{ transform: "scale(1.2)" }}
                  alt="ing-logo"
                />
                <Typography variant="body2" fontWeight={900} ml={0.5} mr={0.2}>
                  {PRE_SALE_TOKEN}
                </Typography>
              </Box>
              {walletAddress && (
                <Typography variant="caption" color="#fff">
                  {library.BALANCE}: {formatNumberWithDecimal(toBalance, 2)}{" "}
                  {PRE_SALE_TOKEN}
                </Typography>
              )}
            </CustomBox>
            <CustomTextField
              fullWidth
              value={toAmount}
              onChange={(e) => _changeToAmount(e.target.value)}
              focused
              placeholder="0.0"
              size="small"
            />
            <CustomBox mt={0.5} mb={2}>
              {percentValues.map((item, index) => (
                <CustomButton
                  sx={{
                    minWidth: "unset!important",
                    width: "15%!important",
                    minHeight: "24px!important",
                    padding: "0px!important",
                    fontSize: 10,
                  }}
                  key={index}
                  onClick={() => _changeToAmount((available * item) / 100)}
                >
                  {item}%
                </CustomButton>
              ))}
            </CustomBox>
            <Typography variant="body2">
              {library.MINIMUM}: {formatNumberWithDecimal(minimum, 4, "xxxx")}{" "}
              {from}
            </Typography>
            <Typography variant="body2">
              {library.PRICE}: {formatNumberWithDecimal(price, 8)} {from} per{" "}
              {PRE_SALE_TOKEN}
            </Typography>
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="caption" textAlign="left">
                    {library.PRESALE_CHECKBOX_1}{" "}
                    <Link
                      target="_blank"
                      href="https://doc.infinityangel.io/infinity-angel-docs/overview/whitepaper"
                    >
                      {library.WHITEPAPER}
                    </Link>
                    ,{" "}
                    <Link
                      target="_blank"
                      href="https://doc.infinityangel.io/faqs/privacy-policy"
                    >
                      {library.POLICY_AND_CONDITIONS}
                    </Link>{" "}
                    {library.AND}{" "}
                    <Link
                      target="_blank"
                      href="https://doc.infinityangel.io/faqs/disclaimer"
                    >
                      {library.DISCLAIMER}
                    </Link>{" "}
                    {library.PRESALE_CHECKBOX_2}
                  </Typography>
                }
              />
            </FormGroup>
            <CustomLoadingButton
              className="submit custom-font"
              fullWidth
              disabled={status !== "BUY_NOW" || purchasing}
              type="submit"
              loading={purchasing}
              sx={{ mt: 2 }}
            >
              {library[status]}
            </CustomLoadingButton>
          </CustomMainBox>
          <Divider />

          <CustomMainBox textAlign="left">
            <Typography variant="body2">
              {library.MINIMUM_RECEIVED}: {formatNumberWithDecimal(toAmount, 2)}{" "}
              {PRE_SALE_TOKEN}
            </Typography>
            <Typography variant="body2">
              {library.FEE}: 0 {from}
            </Typography>
          </CustomMainBox>
        </PurchaseBox>
      </Grid>
      <CustomSmallModal
        open={showConfirm}
        isShowCloseButton={true}
        _close={() => setShowConfirm(false)}
      >
        <Box textAlign={"left"}>
          <Typography mb={1} variant="h5">
            {library.CONFIRM_TRANSACTION}
          </Typography>
          <Divider />
          <CustomBox mt={3} mb={0.5}>
            <Box display="flex" alignItems="center">
              <img src={`/images/coins/${from}.png`} width={40} alt={from} />
              <Typography variant="h6" ml={1}>
                {formatNumberWithDecimal(fromAmount, 8)}
              </Typography>
            </Box>
            <Typography variant="h6">{from}</Typography>
          </CustomBox>
          <Box pl={1}>
            <ArrowDownwardIcon />
          </Box>
          <CustomBox mt={0.5} mb={3}>
            <Box display="flex" alignItems="center">
              <img
                src={`/images/coins/${PRE_SALE_TOKEN}.png`}
                width={40}
                alt={from}
              />
              <Typography variant="h6" ml={1}>
                {formatNumberWithDecimal(toAmount, 2)}
              </Typography>
            </Box>
            <Typography variant="h6">{PRE_SALE_TOKEN}</Typography>
          </CustomBox>
          <CustomBox>
            <Typography>{library.PRICE}</Typography>
            <Typography>
              1 {PRE_SALE_TOKEN} = {formatNumberWithDecimal(price, 8)} {from}
            </Typography>
          </CustomBox>
          <CustomBox mb={3}>
            <Typography>{library.FEE}</Typography>
            <Typography>0 {from}</Typography>
          </CustomBox>
          <Divider />
          <CustomBox mt={3}>
            <CustomBox
              sx={{
                justifyContent: "flex-start",
                opacity: isApproved ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon />
              <Typography ml={1} variant="body2">
                {library.APPROVED}
              </Typography>
            </CustomBox>
            <CustomBox
              sx={{
                justifyContent: "flex-start",
                opacity: isConfirmed ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon />
              <Typography ml={1} variant="body2">
                {library.CONFIRMED}
              </Typography>
            </CustomBox>
          </CustomBox>

          <CustomLoadingButton
            loading={purchasing}
            onClick={_handlePurchase}
            fullWidth
            sx={{ mt: 3 }}
          >
            {library.CONFIRM}
          </CustomLoadingButton>
        </Box>
      </CustomSmallModal>
    </>
  );
}
