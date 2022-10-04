import { Button, Container, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatUSD } from "../../settings/format";
import ClaimForm from "./ClaimForm";
import SwapForm from "./SwapForm";
const inGame = [
  {
    label: "InfinityAngel Gem (ING)",
    symbol: "/images/coins/ING.png",
    key: "ING",
  },
  {
    label: "InfinityAngel INC",
    symbol: "/images/coins/INC.png",
    submitTitle: "Claim",
    key: "INC",
  },
  {
    label: "InfinityAngel Gold",
    symbol: "/images/coins/GOLD.png",
    key: "GOLD",
  },

  {
    label: "METH",
    symbol: "/images/coins/METH.png",
    key: "METH",
  },
];

const MyWallet = () => {
  const { user, setting } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { config } = setting;
  const { contracts } = config ? config : { contracts: [] };
  const { balances, walletAddress } = user;
  const [funds, setFunds] = useState(null);
  const [showClaim, setShowClaim] = useState(false);
  const [showSwap, setShowSwap] = useState(false);

  useEffect(() => {
    if (balances) {
      const INC = balances.find((item) => item.asset === "INC");
      const ING = balances.find((item) => item.asset === "ING");
      setFunds({
        INC: INC,
        ING: ING,
      });
    }
  }, [balances]);

  return (
    <div className="my-wallet">
      {funds && (
        <Container maxWidth="xl">
          <div>
            <Grid container spacing={2}>
              {inGame.map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <div className="wallet-items">
                    <p className="custom-font">{item.label}</p>
                    <Box
                      mb={5}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <div>
                        <p>
                          {formatUSD(
                            funds[item.key] ? funds[item.key].amount : 0
                          )}
                        </p>
                        <small>-/- USD</small>
                      </div>
                      <img src={item.symbol} alt="symbol" width="60px" />
                    </Box>
                    {item.key === "INC" && funds[item.key].amount > 1 && (
                      <Button
                        className="custom-btn custom-font"
                        onClick={() => setShowSwap(true)}
                      >
                        Swap
                      </Button>
                    )}
                    {item.key === "ING" && funds[item.key].amount > 1 && (
                      <Button
                        className="custom-btn custom-font"
                        onClick={() => setShowClaim(true)}
                      >
                        Claim
                      </Button>
                    )}
                    {/* {funds[item.key] && funds[item.key].amount > 1 && (
                      <Button
                        className="custom-btn custom-font"
                        onClick={() => setConfirmClaim(item)}
                      >
                        Claim
                      </Button>
                    )} */}
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      )}
      <SwapForm showSwap={showSwap} _close={() => setShowSwap(false)} />
      <ClaimForm open={showClaim} _onClose={() => setShowClaim(false)} />
    </div>
  );
};

export default MyWallet;
