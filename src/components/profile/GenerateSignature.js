import { ContentCopyRounded } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { formatAddress } from "../../settings/format";
import CopyBox from "../common/CopyBox";
import { CustomButton } from "../common/CustomButton";

export default function GenerateSignature() {
  const { user, setting } = useSelector((state) => state);
  const { walletSignature } = user;
  const [show, setShow] = useState(false);
  const { library } = setting;
  return (
    <Box>
      <Typography mb={2} sx={{ opacity: 0.5 }}>
        {library.LOGIN_HASH}
      </Typography>
      {show ? (
        <CopyBox content={`${walletSignature}`}>
          <CustomButton>
            <small style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 16 }}>
              {formatAddress(walletSignature, 18)}
            </small>
            <IconButton
              style={{
                marginLeft: 10,
                padding: 2,
                background: "transparent",
                border: "none",
              }}
            >
              <ContentCopyRounded
                sx={{ fontSize: 14, fill: "rgba(255, 255, 255, 0.6)" }}
              />
            </IconButton>
          </CustomButton>
        </CopyBox>
      ) : (
        <CustomButton onClick={() => setShow(true)}>Generate</CustomButton>
      )}
    </Box>
  );
}
