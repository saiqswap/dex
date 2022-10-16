import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { provider } from "../../onchain/onchain";
import { CoinList } from "../../settings/constants";
import { EndpointConstant } from "../../settings/endpoint";
import { formatNumberWithDecimal, formatUSD } from "../../settings/format";
import { _showAppError } from "../../store/actions/settingActions";
import {
  _getBalance,
  _getOnchainBalance,
} from "../../store/actions/userActions";
import { post } from "../../utils/api";
import { parseNumber } from "../../utils/util";
import CustomBlueSmallModal from "../common/CustomBlueSmallModal";
import { CustomLoadingButton } from "../common/CustomButton";
import CustomNumberInput from "../common/CustomNumberInput";

export default function ClaimForm({ open, _onClose }) {
  const { setting, user } = useSelector((state) => state);
  const { library, config } = setting;
  const { contracts } = config ? config : { contracts: [] };
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const { walletAddress, balances } = user;
  const [tokenInformation, setTokenInformation] = useState(null);

  useEffect(() => {
    if (!open) {
      setAmount(0);
    }
  }, [open]);

  useEffect(() => {
    if (balances) {
      const tempTokenInformation = balances.find(
        (b) => b.asset === CoinList.ING
      );
      setTokenInformation(tempTokenInformation);
    }
  }, [balances]);

  const handleClaim = () => {
    setLoading(true);
    const fAmount = parseFloat(amount).toFixed(2);
    if (fAmount && fAmount > 0) {
      post(
        `${EndpointConstant.FUND_WITHDRAW}?asset=${CoinList.INC}&amount=${fAmount}`,
        null,
        () => {
          toast.success("Claim success...!");
          dispatch(
            _getOnchainBalance(config.contracts, walletAddress, provider)
          );
          dispatch(_getBalance());
          setLoading(false);
          _onClose();
        },
        (error) => {
          dispatch(_showAppError(error));
          setLoading(false);
        }
      );
    } else {
      toast.error(library.PLEASE_ENTER_AMOUNT);
      setLoading(false);
    }
  };

  const Fee = tokenInformation
    ? contracts.find((item) => item.symbol === tokenInformation.asset)
    : { withdrawFee: 0 };
  var f = (Fee.withdrawFee * parseNumber(amount)) / 100;
  const willGet = parseNumber(amount) - f;

  return (
    <CustomBlueSmallModal
      open={open}
      _close={_onClose}
      isShowCloseButton={!loading}
    >
      {tokenInformation ? (
        <div className="listing-popup">
          <Typography variant="h6" className="custom-font">
            {library.CLAIM} {tokenInformation.key} {library.CONFIRMATION}
          </Typography>
          <CustomNumberInput
            className="custom-font txt-right"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-describedby="outlined-weight-helper-text"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ opacity: 0.5 }}>
                  <Typography variant="body1" className="custom-font">
                    {tokenInformation.key}
                  </Typography>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start" style={{ opacity: 0.5 }}>
                  <Typography variant="body1" className="custom-font">
                    {library.AMOUNT}:
                  </Typography>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Box
            display="flex"
            justifyContent={"space-between"}
            mt={2}
            alignItems="center"
          >
            <Typography variant="body2">
              {library.AVAILABLE}:{" "}
              {formatNumberWithDecimal(tokenInformation.amount, 2)}{" "}
              {tokenInformation.asset}
            </Typography>
            <Link
              onClick={() => {
                console.log(
                  formatNumberWithDecimal(tokenInformation.amount, 2)
                );
                setAmount(tokenInformation.amount.toString());
              }}
              sx={{ cursor: "pointer" }}
            >
              {library.MAXIMUM}
            </Link>
          </Box>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Grid container alignItems={"center"}>
            <Grid item xs={12}>
              <Box textAlign="left">
                <Typography variant="body2">
                  {library.FEE}:{" "}
                  {f
                    ? `${formatUSD(f)} ${Fee.symbol}`
                    : `0 ${tokenInformation.asset}`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box textAlign="left">
                <Typography variant="body2">
                  {library.WILL_GET}:{" "}
                  {`${willGet > 0 ? formatUSD(willGet) : 0} ${
                    tokenInformation.asset
                  }`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ mt: 2, mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <CustomLoadingButton
                className="custom-font btn-submit"
                onClick={() => handleClaim()}
                loading={loading}
                fullWidth
              >
                {library.CLAIM}
              </CustomLoadingButton>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div />
      )}
    </CustomBlueSmallModal>
  );
}
