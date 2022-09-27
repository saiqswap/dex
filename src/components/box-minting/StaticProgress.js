import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumberWithDecimal } from "../../settings/format";
import { LinearProgressCustom } from "./MintingStyles";

export default function StaticProgress({ roundNumber }) {
  const [round, setRound] = useState(null);
  const { setting, minting } = useSelector((state) => state);
  const { library } = setting;
  const [progress, setProgress] = useState(0);
  const { mintingBoxList } = minting;

  useEffect(() => {
    if (mintingBoxList) {
      const temp = mintingBoxList[roundNumber];
      if (temp) {
        setRound(temp);
      }
    }
  }, [mintingBoxList, roundNumber]);

  useEffect(() => {
    if (round) {
      const availablePercent = parseInt(
        (round.angelTotalSold / round.angelTotalSupply) * 100
      );
      setProgress(availablePercent);
    }
  }, [round]);

  return (
    round && (
      <Box
        height={70}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box display={"flex"} justifyContent={"space-between"} px={1} mb={0.5}>
          <Typography variant="caption" color="#fff">
            {library.SOLD}
          </Typography>
          <Typography variant="caption" color="#fff">
            Angel box
          </Typography>
          <Typography variant="caption" color="#fff">
            {library.TOTAL_SELL}
          </Typography>
        </Box>
        <LinearProgressCustom variant="determinate" value={progress} />
        <Box display={"flex"} justifyContent={"space-between"} px={1} mt={0.5}>
          <Typography variant="caption" color="#fff">
            {formatNumberWithDecimal(round.angelTotalSold, 2)} {library.BOX}
          </Typography>
          <Typography variant="caption" color="#fff">
            {formatNumberWithDecimal(round.angelTotalSupply, 2)} {library.BOX}
          </Typography>
        </Box>
      </Box>
    )
  );
}
