import { LoadingButton } from "@mui/lab";
import {
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatAmount, formatUSD } from "../../settings/format";
import { _getBalance } from "../../store/actions/userActions";
import { post } from "../../utils/api";
import { parseNumber } from "../../utils/util";

const wallets = [
  {
    label: "InfinityAngel Coin (INC)",
    symbol: "/images/coins/INC.png",
    key: "INC",
  },
  {
    label: "InfinityAngel Gem (ING)",
    symbol: "/images/coins/ING.png",
    key: "ING",
  },
];

const inGame = [
  {
    label: "InfinityAngel Gold",
    symbol: "/images/coins/GOLD.png",
    key: "GOLD",
  },
  {
    label: "InfinityAngel INC",
    symbol: "/images/coins/INC.png",
    submitTitle: "Claim",
    key: "INC",
  },
  {
    label: "METH",
    symbol: "/images/coins/METH.png",
    key: "METH",
  },
  {
    label: "InfinityAngel Gem (ING)",
    symbol: "/images/coins/ING.png",
    key: "ING",
  },
];

const MyWallet = () => {
  const { user, setting } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { config, library } = setting;
  const { contracts } = config ? config : { contracts: [] };
  const { balances, walletAddress, metamaskProvider } = user;
  const [funds, setFunds] = useState(null);
  const [otherFunds, setOtherFunds] = useState([]);
  const [confirmClaim, setConfirmClaim] = useState(false);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (balances) {
      const INC = balances.find((item) => item.asset === "INC");
      const ING = balances.find((item) => item.asset === "ING");
      setFunds({
        INC: INC,
        ING: ING,
      });
      setOtherFunds(
        balances.filter((e) => e.asset !== "INC" && e.asset !== "ING")
      );
    }
  }, [balances]);

  const handleCancelConfirm = () => {
    setConfirmClaim(null);
    setAmount(0);
  };

  const Fee = confirmClaim
    ? contracts.find((item) => item.symbol === confirmClaim.key)
    : { withdrawFee: 0 };
  var f = (Fee.withdrawFee * parseNumber(amount)) / 100;
  const willGet = parseNumber(amount) - f;

  const handleClaim = () => {
    setLoading(true);
    post(
      `/fund/withdraw?asset=${confirmClaim.key}&amount=${parseNumber(amount)}`,
      null,
      () => {
        toast.success("Claim success...!");
        dispatch(_getBalance(walletAddress, metamaskProvider));
        setLoading(false);
        setConfirmClaim(null);
      },
      (error) => {
        toast.error(error.msg);
        setLoading(false);
      }
    );
  };

  return (
    <div className="my-wallet">
      {funds && (
        <Container maxWidth="xl">
          <div>
            <Typography variant="h5" className="custom-font">
              {library.WALLET}
            </Typography>
            <Divider
              sx={{
                mt: 3,
                mb: 3,
              }}
            />
            <Grid container>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="wallet-items">
                      <p className="custom-font">Other Currencies</p>
                      {otherFunds.map((item, index) => (
                        <Box mb={1} key={index}>
                          <p>
                            {formatAmount(item.onChainBalance)} {item.asset}
                          </p>
                          <small>-/- USD</small>
                        </Box>
                      ))}
                    </div>
                  </Grid>
                  {wallets.map((item, index) => (
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
                                funds[item.key]
                                  ? funds[item.key].onChainBalance
                                  : 0
                              )}
                            </p>
                            <small>-/- USD</small>
                          </div>
                          <img src={item.symbol} alt="symbol" width="60px" />
                        </Box>
                        {/* <Button className="custom-btn custom-font">
                          Deposit
                        </Button> */}
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div style={{ marginTop: 30 }}>
            <Typography variant="h5" className="custom-font">
              {library.IN_GAME_CURRENCIES}
            </Typography>
            <Divider className="mt-20" />
            <Grid container spacing={2} style={{ marginTop: 10 }}>
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
                    {funds[item.key] && funds[item.key].amount > 1 && (
                      <Button
                        className="custom-btn custom-font"
                        onClick={() => setConfirmClaim(item)}
                      >
                        Claim
                      </Button>
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      )}
      <Modal
        open={confirmClaim}
        onClose={() => handleCancelConfirm()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="custom-modal-vk claim-confirm"
      >
        {confirmClaim && (
          <div className="listing-popup">
            <Typography variant="h6" className="custom-font">
              {library.CLAIM} {confirmClaim.key} {library.CONFIRMATION}
            </Typography>
            <OutlinedInput
              className="custom-font input txt-right"
              value={amount ? amount.replace(/[^\d.]/g, "") : ""}
              onChange={(e) => setAmount(e.target.value)}
              endAdornment={
                <InputAdornment position="end" style={{ opacity: 0.5 }}>
                  <Typography variant="body1" className="custom-font">
                    {confirmClaim.key}
                  </Typography>
                </InputAdornment>
              }
              startAdornment={
                <InputAdornment position="start" style={{ opacity: 0.5 }}>
                  <Typography variant="body1" className="custom-font">
                    {library.AMOUNT}:
                  </Typography>
                </InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
            />
            <div className="mt-20 available">
              <span>{library.AVAILABLE}:</span>
              <span className="value">
                {formatUSD(funds[confirmClaim.key].amount)} {confirmClaim.key}
              </span>
              <span
                className="link"
                onClick={() =>
                  setAmount(formatUSD(funds[confirmClaim.key].amount))
                }
              >
                {library.MAXIMUM}
              </span>
            </div>
            <Divider className="mt-20" />
            <Grid container alignItems={"center"} className="mt-20">
              <Grid item xs={12}>
                <Typography variant="caption" className="mt-20">
                  <span>{library.FEE}:</span>
                  <span className="value">
                    {f
                      ? `${formatUSD(f)} ${Fee.symbol}`
                      : `0 ${confirmClaim.key}`}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  <span>{library.WILL_GET}:</span>
                  <span className="value">{`${
                    willGet > 0 ? formatUSD(willGet) : 0
                  } ${confirmClaim.key}`}</span>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <div className="submit-form">
                  <Button
                    className="custom-font btn-cancel"
                    onClick={() => handleCancelConfirm(null)}
                  >
                    {library.CANCEL}
                  </Button>
                  <LoadingButton
                    className="custom-font btn-submit"
                    onClick={() => handleClaim()}
                    loading={loading}
                  >
                    {library.CLAIM}
                  </LoadingButton>
                </div>
              </Grid>
            </Grid>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyWallet;
