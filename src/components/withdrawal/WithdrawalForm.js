import {
  Box,
  Button,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ENDPOINT_GET_VALIDATE_ADDRESS,
  ENDPOINT_POST_WITHDRAW_TRANSFER,
} from "../../settings/endpoint";
import { get, post } from "../../utils/api";
import { CustomToast } from "../../settings";
import { checkEmpty, checkNumber } from "../../settings/validates";
import { formatAmount } from "../../settings/format";
import GAConfirm from "../common/ga-input/GAConfirm";
import TransactionConfirm from "./TransactionConfirm";

export default function WithdrawalForm({ data }) {
  const balance = data;
  const [network, setNetwork] = useState(null);
  const { setting, user } = useSelector((state) => state);
  const { library } = setting;
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [isFlag, setIsFlag] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGaInput, setShowGaInput] = useState(false);
  const { information } = user;
  const [gaCodeLoading, setGaCodeLoading] = useState(false);

  useEffect(() => {
    if (data && data.networks) {
      setNetwork(data.networks[0]);
    }
  }, [data]);

  useEffect(() => {
    setAddress("");
    setAmount("");
  }, [balance, network]);

  const _handleSubmit = () => {
    const tempErrors = [...errors];
    if (checkEmpty(amount)) {
      tempErrors.push({
        field: "amount",
        error: library.PLEASE_ENTER_AMOUNT,
      });
    } else {
      var num = parseFloat(amount.replaceAll(",", ""));
      if (isNaN(num)) {
        num = 0;
      }
      if (checkNumber(num)) {
        tempErrors.push({
          field: "amount",
          error: library.INVALID_AMOUNT,
        });
      } else {
        if (num <= 0) {
          tempErrors.push({
            field: "amount",
            error: library.NUMBER_GREATER,
          });
        }
      }
    }
    if (
      num - network.withdrawFee <= 0 ||
      num < network.minimumWithdraw + network.withdrawFee
    ) {
      setLoading(false);
      tempErrors.push({
        field: "amount",
        error:
          library.YOUR_AMOUNT_TOO_LOW +
          formatAmount(network.minimumWithdraw + network.withdrawFee) +
          " " +
          balance.asset,
      });
    }
    setErrors(tempErrors);
    setIsFlag(false);
    if (tempErrors.length === 0) {
      // if (information.verifyLevel === "VERIFIED") {
      setShowConfirm(true);
      setLoading(true);
      // } else {
      //   setLoading(false);
      // }
    }
  };

  const _handleWithdraw = (gaCode) => {
    setShowConfirm(false);
    var param;
    if (gaCode) {
      param = {
        type: "WITHDRAW",
        asset: balance.asset,
        network: network.network,
        amount: amount - network.withdrawFee,
        address,
        gaCode,
        addressTag: "",
      };
    } else {
      param = {
        type: "WITHDRAW",
        asset: balance.asset,
        network: network.network,
        amount: amount - network.withdrawFee,
        address,
        addressTag: "",
      };
    }
    post(
      ENDPOINT_POST_WITHDRAW_TRANSFER,
      param,
      () => {
        setAddress("");
        setAmount("");
        setLoading(false);
        CustomToast("success", library.WITHDRAW_SUCCESSFUL);
        setGaCodeLoading(false);
        setShowGaInput(false);
      },
      (error) => {
        CustomToast("error", library[error.code]);
        setGaCodeLoading(false);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    console.log(isFlag);
    if (isFlag) _handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlag]);

  const _checkAddress = (e, action) => {
    let isSubmit = action === "submit";
    let tempErrors = [];
    if (isSubmit) e.preventDefault();
    if (checkEmpty(address)) {
      tempErrors.push({
        field: "address",
        error: library.PLEASE_ENTER_ADDRESS,
      });
      setErrors(tempErrors);
      if (isSubmit) setIsFlag(true);
    } else {
      setLoading(true);
      get(
        `${ENDPOINT_GET_VALIDATE_ADDRESS}?network=${network.network}&address=${address}`,
        (data) => {
          if (!data.result) {
            tempErrors.push({
              field: "address",
              error: library.INVALID_ADDRESS,
            });
          }
          setErrors(tempErrors);
          if (!isSubmit) setLoading(false);
          if (isSubmit) setIsFlag(true);
        },
        () => {
          tempErrors.push({
            field: "address",
            error: library.INVALID_ADDRESS,
          });
          setErrors(tempErrors);
          if (!isSubmit) setLoading(false);
          if (isSubmit) setIsFlag(true);
        }
      );
    }
  };

  const _checkError = (field) => {
    const check = errors.filter((item) => item.field === field)[0];
    if (check) return true;
    return false;
  };

  const _getErrorContent = (field) => {
    const check = errors.filter((item) => item.field === field)[0];
    if (check) return check.error;
    return null;
  };

  const _resetErrors = () => setErrors([]);

  const _handleConfirm = () => {
    setShowConfirm(false);
    if (information.gaEnable && information.verifyLevel === "VERIFIED") {
      setShowGaInput(true);
    } else {
      _handleWithdraw();
    }
  };

  const _onHandleInputGaCode = (e) => {
    e.preventDefault();
    setGaCodeLoading(true);
    const { value } = e.target.gaCode;
    if (checkEmpty(value)) {
      CustomToast("error", library.PLEASE_ENTER_GA_CODE);
      setGaCodeLoading(false);
    } else if (value.trim().length !== 6) {
      CustomToast("error", library.WRONG_GACODE);
      setGaCodeLoading(false);
    } else {
      _handleWithdraw(value);
    }
  };

  return (
    data &&
    network && (
      <Box padding={3}>
        <form
          className="w-100"
          onSubmit={(e) => _checkAddress(e, "submit")}
          noValidate
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                name="network"
                value={network}
                onChange={(e) => {
                  setNetwork(e.target.value);
                  _resetErrors();
                }}
                onBlur={_checkAddress}
                error={_checkError("network")}
                fullWidth
                label={library.NETWORK}
                variant="outlined"
                select
              >
                {balance.networks &&
                  balance.networks.map((option) => (
                    <option key={option.network} value={network}>
                      {option.network}
                    </option>
                  ))}
              </TextField>
              <FormHelperText error>&nbsp; </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  _resetErrors();
                }}
                onBlur={_checkAddress}
                error={_checkError("address")}
                fullWidth
                label={library.ADDRESS}
                variant="outlined"
              />
              <FormHelperText error>
                {_getErrorContent("address")}&nbsp;
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  _resetErrors();
                }}
                placeholder={`${library.MINIMUM}: ${formatAmount(
                  network && network.minimumWithdraw + network.withdrawFee
                )} ${balance.asset}`}
                error={_checkError("amount")}
                label={library.AMOUNT}
                variant="outlined"
                fullWidth
              />
              <FormHelperText error>
                {_getErrorContent("amount")}&nbsp;
              </FormHelperText>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between" marginTop={5}>
            <Box>
              <small>{library.RECEIVE_AMOUNT}</small>
              <Typography>{formatAmount(amount)}</Typography>
              <small>
                {library.FEE}: {formatAmount(network.withdrawFee)} {data.asset}
              </small>
            </Box>
            <Box>
              <Button
                type="submit"
                className="btn"
                color="primary"
                variant="contained"
                disabled={loading}
              >
                {library.WITHDRAW}
              </Button>
            </Box>
          </Box>
        </form>
        {/* {loading && (
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(255,255,255,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
          }}
        >
          <CircularProgress />
        </div>
      )} */}
        <GAConfirm
          open={showGaInput}
          _handleComplete={_onHandleInputGaCode}
          loading={gaCodeLoading}
        />
        <TransactionConfirm
          open={showConfirm}
          title="Confirming for your withdraw"
          data={{
            amount: parseFloat(amount.replaceAll(",", "")),
            username: address,
            fee: network.withdrawFee,
            asset: balance.asset,
            youWillGet: amount - network.withdrawFee,
          }}
          _onCancel={() => {
            setShowConfirm(false);
            setLoading(false);
          }}
          _onConfirm={_handleConfirm}
          type="WITHDRAW"
        />
      </Box>
    )
  );
}
