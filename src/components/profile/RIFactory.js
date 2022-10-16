import { Button, Container, Divider, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppConfig } from "../../settings";
import { formatNumberWithDecimal } from "../../settings/format";
import { _getLockBalances } from "../../store/actions/userActions";
import ClaimForm from "./ClaimForm";
import SwapForm from "./SwapForm";

export default function RIFactory() {
  const [tabIndex, setTabIndex] = useState(0);
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  const menus = [
    { label: "ACCOUNTS", type: "accounts", component: <AccountsComponent /> },
    {
      label: "SWAP_WITHDRAWAL",
      type: "swap_withdrawal",
      component: <SwapWithdrawComponent />,
    },
  ];

  return (
    <Container maxWidth={"lg"} className="history-page">
      <ul className="menu">
        {menus.map((item, index) => (
          <li
            key={index}
            onClick={() => setTabIndex(index)}
            className={`custom-font ${tabIndex === index ? "active" : ""}`}
          >
            {library[item.label]}
          </li>
        ))}
      </ul>
      <Divider sx={{ mb: 3 }} />
      {menus[tabIndex].component}
    </Container>
  );
}

const AccountsComponent = () => {
  return "AccountsComponent";
};

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
];

const SwapWithdrawComponent = () => {
  const { user, setting } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { config, library } = setting;
  const { contracts } = config ? config : { contracts: [] };
  const { balances, walletAddress, information, lockBalances } = user;
  const [funds, setFunds] = useState(null);
  const [showClaim, setShowClaim] = useState(false);
  const [showSwap, setShowSwap] = useState(false);

  useEffect(() => {
    if (information) {
      dispatch(_getLockBalances());
    }
  }, [dispatch, information]);

  useEffect(() => {
    if (balances && lockBalances) {
      for (const iterator of balances) {
        const find = lockBalances.find((b) => b.asset === iterator.asset);
        if (find) {
          iterator.debtAmount = find.amount;
        }
      }
      const INC = balances.find((item) => item.asset === "INC");
      const ING = balances.find((item) => item.asset === "ING");
      setFunds({
        INC: INC,
        ING: ING,
      });
    }
  }, [balances, lockBalances]);

  return (
    <div className="my-wallet">
      {funds && (
        <div>
          <Grid container spacing={2}>
            {inGame.map((item, index) => {
              return (
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
                          {formatNumberWithDecimal(
                            funds[item.key] ? funds[item.key].amount : 0,
                            2
                          )}
                        </p>
                        <small>
                          {library.LOCK_AMOUNT}:{" "}
                          {funds[item.key]?.debtAmount
                            ? funds[item.key].debtAmount
                            : 0}{" "}
                          {item.key}
                        </small>
                      </div>
                      <img src={item.symbol} alt="symbol" width="60px" />
                    </Box>
                    {item.key === "INC" &&
                      parseFloat(
                        formatNumberWithDecimal(funds[item.key].amount, 2)
                      ) > 0 &&
                      AppConfig.OPEN_FEATURES.isSwap && (
                        <Button
                          className="custom-btn custom-font"
                          onClick={() => setShowSwap(true)}
                        >
                          Swap
                        </Button>
                      )}
                    {item.key === "ING" &&
                      parseFloat(
                        formatNumberWithDecimal(funds[item.key].amount, 2)
                      ) > 0 &&
                      AppConfig.OPEN_FEATURES.isClaim && (
                        <Button
                          className="custom-btn custom-font"
                          onClick={() => setShowClaim(true)}
                        >
                          Claim{" "}
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
              );
            })}
          </Grid>
        </div>
      )}
      <SwapForm showSwap={showSwap} _close={() => setShowSwap(false)} />
      <ClaimForm open={showClaim} _onClose={() => setShowClaim(false)} />
    </div>
  );
};
