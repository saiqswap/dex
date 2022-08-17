import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ENDPOINT_GET_ADDRESS } from "../../settings/endpoint";
import { get } from "../../utils/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CustomToast } from "../../settings";
import { FileCopy } from "@mui/icons-material";
import Metamask from "./Metamask";

export default function DepositForm({ data }) {
  const [method] = useState(0);

  const methods = [
    {
      value: 0,
      label: "Send address",
      component: <ManualDeposit data={data} />,
    },
    {
      value: 1,
      label: "Connect wallet",
      component: (
        <Grid item xs={12}>
          <Metamask data={data} />
        </Grid>
      ),
    },
  ];

  return (
    <Box padding={3} position="relative">
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
          <TextField
            id="outlined-select-method"
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
            }}
            fullWidth
            variant="outlined"
            select
            label="Method select"
            SelectProps={{
              native: true,
            }}
          >
            {methods.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid> */}
        {methods[method].component}
      </Grid>
    </Box>
  );
}

function ManualDeposit({ data }) {
  const [network, setNetwork] = useState("");
  const [dataAddress, setDataAddress] = useState(null);
  const [walletError, setWalletError] = useState(false);
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.networks) {
      setNetwork(data.networks[0].network);
    }
  }, [data]);

  useEffect(() => {
    if (network !== "") {
      setLoading(true);
      get(
        ENDPOINT_GET_ADDRESS + "?network=" + network,
        (data) => {
          setDataAddress(data);
          setWalletError(false);
          setLoading(false);
        },
        () => {
          setLoading(false);
          setWalletError(true);
        }
      );
    }
  }, [network]);

  return (
    <>
      <Grid item xs={12}>
        <TextField
          name="network"
          value={network}
          onChange={(e) => {
            setNetwork(e.target.value);
          }}
          fullWidth
          label={library.NETWORK}
          variant="outlined"
          select
          SelectProps={{
            native: true,
          }}
        >
          {data.networks &&
            data.networks.map((option) => (
              <option key={option.network} value={option.network}>
                {option.network}
              </option>
            ))}
        </TextField>
      </Grid>
      {walletError ? (
        <Grid item xs={12} align="center">
          <Typography variant="h6">{library.DEPOSIT_DISABLE}</Typography>
        </Grid>
      ) : (
        <>
          <Grid item xs={12} align="center">
            <img
              className="qr-code"
              src={
                "https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=" +
                (dataAddress ? dataAddress.address : "")
              }
              alt="qrcode"
              style={{
                borderRadius: 16,
                height: 300,
                width: 300,
              }}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <CopyToClipboard
              text={dataAddress && dataAddress.address}
              onCopy={() => CustomToast("success", library.COPIED)}
            >
              <Typography
                style={{ cursor: "pointer" }}
                className="deposit-address"
              >
                {dataAddress && dataAddress.address}
                <FileCopy fontSize="inherit" />
              </Typography>
            </CopyToClipboard>
          </Grid>
        </>
      )}
      {loading && (
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(var(--paper-bg-color-rgb),0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
          }}
        >
          <CircularProgress />
        </div>
      )}
    </>
  );
}
