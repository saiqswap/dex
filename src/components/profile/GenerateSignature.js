import { ContentCopyRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { Buffer } from "buffer";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { prefix } from "../../onchain/onchain";
import { formatAddress } from "../../settings/format";
import CopyBox from "../common/CopyBox";
import { CustomButton } from "../common/CustomButton";

export default function GenerateSignature() {
  const { user, setting } = useSelector((state) => state);
  const { walletAddress, information } = user;
  const { library, applicationConfig } = setting;
  const [loginSignatureForBot, setLoginSignatureForBot] = useState("");

  //sign for generate signature
  const _getSignature = async () => {
    const data = `0x${Buffer.from(
      applicationConfig.ARR_SIGN_MESSAGE.BOT,
      "utf8"
    ).toString("hex")}`;
    prefix
      .request({
        method: "personal_sign",
        params: [data, walletAddress],
      })
      .then((signature) => {
        setLoginSignatureForBot(signature);
      })
      .catch((error) => {
        toast.error("Sign wallet failed. Please try again.");
        console.log(error);
      });
  };

  return (
    information.useLoginToken && (
      <Box>
        <Typography mb={2} sx={{ opacity: 0.5 }}>
          {library.LOGIN_HASH}
        </Typography>
        {loginSignatureForBot ? (
          <CopyBox content={`${loginSignatureForBot}`}>
            <CustomButton>
              <small
                style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 16 }}
              >
                {formatAddress(loginSignatureForBot, 18)}
              </small>
              <ContentCopyRounded
                sx={{ fontSize: 14, ml: 2, fill: "rgba(255, 255, 255, 0.6)" }}
              />
            </CustomButton>
          </CopyBox>
        ) : (
          <CustomButton onClick={_getSignature}>Generate</CustomButton>
        )}
      </Box>
    )
  );
}
