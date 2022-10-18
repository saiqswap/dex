import { Box, Grid, styled, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CoinList } from "../../settings/constants";
import { formatNumberWithDecimal } from "../../settings/format";

const MainCustomBox = styled(Box)(({ theme }) => ({
  maxWidth: 500,
  marginBottom: theme.spacing(1),
  width: "100%",
}));

const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  borderRadius: theme.spacing(2),
  width: "100%",
  padding: theme.spacing(1),
  textAlign: "center",
}));

export default function SwapBalances() {
  const { user } = useSelector((state) => state);
  const { balances } = user;
  const [INCBalance, setINCBalance] = useState(0);
  const [INGBalance, setINGBalance] = useState(0);

  useEffect(() => {
    if (balances) {
      setINCBalance(balances.find((b) => b.asset === CoinList.INC));
      setINGBalance(balances.find((b) => b.asset === CoinList.ING));
    }
  }, [balances]);

  return (
    <MainCustomBox>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box component={Link} to="/profile/wallet">
            <CustomBox>
              <img
                src={`/images/coins/${CoinList.INC}.png`}
                alt={CoinList.INC}
                width={30}
                style={{
                  margin: "auto",
                }}
              />
              <Typography variant="body2">
                {formatNumberWithDecimal(INCBalance.amount, 2)} {CoinList.INC}
              </Typography>
            </CustomBox>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box component={Link} to="/profile/wallet">
            <CustomBox>
              <img
                src={`/images/coins/${CoinList.ING}.png`}
                alt={CoinList.ING}
                width={30}
                style={{
                  margin: "auto",
                }}
              />
              <Typography variant="body2">
                {formatNumberWithDecimal(INGBalance.amount, 2)} {CoinList.ING}
              </Typography>
            </CustomBox>
          </Box>
        </Grid>
      </Grid>
    </MainCustomBox>
  );
}
