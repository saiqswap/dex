import React from "react";
import {
  Container,
  Divider,
  Drawer,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import moment from "moment";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { formatAddress, formatAmount } from "../../settings/format";

export default function TransactionConfirm({
  open,
  data,
  title,
  _onCancel,
  _onConfirm,
  type,
  youWillGet,
}) {
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  return (
    <Drawer anchor="left" open={open} className={"custom-modal-vk"} style={{}}>
      <Container
        maxWidth="md"
        style={{ padding: 0, backgroundColor: "var(--main-color)" }}
      >
        <div
          style={{
            textAlign: "center",
            width: 300,
            height: "100%",
            backgroundColor: "var(--paper-bg-color)",
            paddingTop: 50,
          }}
        >
          <IconButton
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            onClick={_onCancel}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
          <Box marginBottom={3}>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Typography variant="caption">
            {type === "WITHDRAW" ? library.ADDRESS : library.USERNAME}
          </Typography>
          <Typography variant="subtitle2">
            {formatAddress(data.username)}
          </Typography>
          <Box marginBottom={1} marginTop={1}>
            <Divider />
          </Box>
          <Typography variant="caption">{library.AMOUNT}</Typography>
          <Typography variant="subtitle2">
            {formatAmount(data.amount)} {data.asset}
          </Typography>
          <Box marginBottom={1} marginTop={1}>
            <Divider />
          </Box>
          <Typography variant="caption">{library.FEE}</Typography>
          <Typography variant="subtitle2">
            {formatAmount(data.fee)} {data.asset}
          </Typography>
          <Box marginBottom={1} marginTop={1}>
            <Divider />
          </Box>
          <Typography variant="caption">{library.YOU_WILL_GET}</Typography>
          <Typography variant="subtitle2">
            {formatAmount(data.youWillGet)} {data.asset}
          </Typography>
          <Box marginBottom={1} marginTop={1}>
            <Divider />
          </Box>
          <Typography variant="caption">{library.TIME}</Typography>
          <Typography variant="subtitle2">
            {moment().format("YYYY-MM-DD HH-mm-ss")}
          </Typography>
          <Box marginTop={3}>
            <div
              fullWidth
              onClick={_onConfirm}
              color="primary"
              style={{
                borderRadius: 0,
                backgroundColor: "var(--primary-color)",
                padding: 16,
                cursor: "pointer",
              }}
            >
              {library.CONFIRM}
            </div>
          </Box>
        </div>
      </Container>
    </Drawer>
  );
}
