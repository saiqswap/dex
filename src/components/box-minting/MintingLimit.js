import { Divider, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { DropRateDetail } from "./MintingStyles";

export default function MintingLimit({
  mintingBoxSetting,
  userMintingInformation,
}) {
  const { setting, user } = useSelector((state) => state);
  const { library } = setting;
  const { walletAddress } = user;
  return (
    walletAddress && (
      <DropRateDetail>
        <Typography variant="body2">{library.MINTING_LIMIT}: </Typography>
        <Typography variant="body2">
          {mintingBoxSetting?.boxes} {library.BOXES} {library.AND}{" "}
          {mintingBoxSetting?.combos} {library.COMBOS}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2">{library.YOU_OWNED}: </Typography>
        <Typography variant="body2">
          {userMintingInformation?.boughtBoxes} box(s) {library.AND}{" "}
          {userMintingInformation?.boughtCombos} combo(s)
        </Typography>
      </DropRateDetail>
    )
  );
}
