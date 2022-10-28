import { Box, Container, Grid, styled, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomStack, PriceBox } from "../components/box-minting/MintingStyles";
import { CustomLoadingButton } from "../components/common/CustomButton";
import CustomNumberInput from "../components/common/CustomNumberInput";
import StakingHistory from "../components/staking/StakingHistory";
import { CoinList } from "../settings/constants";
import { formatNumberWithDecimal } from "../settings/format";

const CustomContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  borderRadius: "20px",
  padding: theme.spacing(5),
}));

export default function TokenStaking() {
  const { user, setting } = useSelector((state) => state);
  const { balances } = user;
  const { library } = setting;
  const [INGBalance, setINGBalance] = useState(0);
  const [selectedPercent, setSelectedPercent] = useState(6);

  useEffect(() => {
    if (balances) {
      const ING = balances.find((item) => item.asset === CoinList.ING);
      setINGBalance(ING.amount);
    }
  }, [balances]);

  const _handleSubmit = (e) => {
    e.preventDefault();
    alert("xxx");
  };

  return (
    <div
      style={{
        marginBottom: -40,
        paddingTop: 40,
        fontFamily: "Orbitron!important",
        background: "url(/images/backgrounds/background.png)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        paddingBottom: 100,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomContainer>
              <Box component="form" onSubmit={_handleSubmit}>
                <CustomStack>
                  <Box mr={3}>
                    <Typography>APY </Typography>
                  </Box>
                  {[6, 9, 12].map((item, index) => (
                    <PriceBox
                      sx={{ minWidth: 70 }}
                      key={index}
                      onClick={() => setSelectedPercent(item)}
                      className={selectedPercent === item ? "active" : ""}
                    >
                      {/* <Typography variant="caption" color="#fff">
                    {item.sold} {formatAmount(item.unitPrice)}{" "}
                    {item.paymentCurrency}
                  </Typography> */}
                      {item}%
                    </PriceBox>
                  ))}
                </CustomStack>
                <Box textAlign="right" mb={1}>
                  <Typography variant="caption" color="#fff" textAlign="right">
                    {library.BALANCE}: {formatNumberWithDecimal(INGBalance, 2)}{" "}
                    {CoinList.ING}
                  </Typography>
                </Box>
                <CustomNumberInput
                  fullWidth
                  label="Amount"
                  placeholder="Please enter ING amount"
                />
                <Box mt={2}></Box>
                <CustomLoadingButton type="submit">Submit</CustomLoadingButton>
              </Box>
            </CustomContainer>
          </Grid>
          <Grid item xs={6}>
            <CustomContainer>xxxx</CustomContainer>
          </Grid>
          <Grid item xs={12}>
            <CustomContainer sx={{ p: 0, borderRadius: 0 }}>
              <StakingHistory />
            </CustomContainer>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
