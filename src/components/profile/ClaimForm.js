import { LoadingButton } from "@mui/lab";
import {
  Button,
  Divider,
  Grid,
  InputAdornment,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { provider } from "../../onchain/onchain";
import { CoinList } from "../../settings/constants";
import { EndpointConstant } from "../../settings/endpoint";
import { formatUSD } from "../../settings/format";
import {
  _getBalance,
  _getOnchainBalance,
} from "../../store/actions/userActions";
import { post } from "../../utils/api";
import { parseNumber } from "../../utils/util";

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
    if (balances) {
      const tempTokenInformation = balances.find(
        (b) => b.asset === CoinList.ING
      );
      setTokenInformation(tempTokenInformation);
    }
  }, [balances]);

  const handleClaim = () => {
    setLoading(true);
    post(
      `${EndpointConstant.FUND_WITHDRAW}?asset=${
        CoinList.INC
      }&amount=${parseNumber(amount)}`,
      null,
      () => {
        toast.success("Claim success...!");
        dispatch(_getOnchainBalance(config.contracts, walletAddress, provider));
        dispatch(_getBalance());
        setLoading(false);
        _onClose();
      },
      (error) => {
        toast.error(library.SOMETHING_WRONG);
        toast.error(library[error.code]);
        setLoading(false);
      }
    );
  };

  const handleCancelConfirm = () => {
    _onClose();
    setAmount(0);
  };

  const Fee = tokenInformation
    ? contracts.find((item) => item.symbol === tokenInformation.asset)
    : { withdrawFee: 0 };
  var f = (Fee.withdrawFee * parseNumber(amount)) / 100;
  const willGet = parseNumber(amount) - f;

  return (
    <Modal
      open={open}
      onClose={_onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="custom-modal-vk claim-confirm"
    >
      {tokenInformation ? (
        <div className="listing-popup">
          <Typography variant="h6" className="custom-font">
            {library.CLAIM} {tokenInformation.key} {library.CONFIRMATION}
          </Typography>
          <OutlinedInput
            className="custom-font input txt-right"
            value={amount ? amount.replace(/[^\d.]/g, "") : ""}
            onChange={(e) => setAmount(e.target.value)}
            endAdornment={
              <InputAdornment position="end" style={{ opacity: 0.5 }}>
                <Typography variant="body1" className="custom-font">
                  {tokenInformation.key}
                </Typography>
              </InputAdornment>
            }
            startAdornment={
              <InputAdornment position="start" style={{ opacity: 0.5 }}>
                <Typography variant="body1" className="custom-font">
                  {library.AMOUNT}:
                </Typography>
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
          />
          <div className="mt-20 available">
            <span>{library.AVAILABLE}:</span>
            <span className="value">
              {formatUSD(tokenInformation.amount)} {tokenInformation.asset}
            </span>
            <span
              className="link"
              onClick={() => setAmount(formatUSD(tokenInformation.amount))}
            >
              {library.MAXIMUM}
            </span>
          </div>
          <Divider className="mt-20" />
          <Grid container alignItems={"center"} className="mt-20">
            <Grid item xs={12}>
              <Typography variant="caption" className="mt-20">
                <span>{library.FEE}:</span>
                <span className="value">
                  {f
                    ? `${formatUSD(f)} ${Fee.symbol}`
                    : `0 ${tokenInformation.asset}`}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">
                <span>{library.WILL_GET}:</span>
                <span className="value">{`${
                  willGet > 0 ? formatUSD(willGet) : 0
                } ${tokenInformation.asset}`}</span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div className="submit-form">
                <Button
                  className="custom-font btn-cancel"
                  onClick={() => handleCancelConfirm(null)}
                >
                  {library.CANCEL}
                </Button>
                <LoadingButton
                  className="custom-font btn-submit"
                  onClick={() => handleClaim()}
                  loading={loading}
                >
                  {library.CLAIM}
                </LoadingButton>
              </div>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div />
      )}
    </Modal>
  );
}
