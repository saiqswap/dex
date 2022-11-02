import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { parseUnits } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _checkBeforePurchase, _depositING, _getReceipt } from "../../onchain";
import { provider } from "../../onchain/onchain";
import { AppConfig } from "../../settings";
import { EndpointConstant } from "../../settings/endpoint";
import { formatNumberWithDecimal, formatPrice } from "../../settings/format";
import { _showAppError } from "../../store/actions/settingActions";
import {
  _getBalance,
  _getLockBalances,
  _getOnchainBalance,
} from "../../store/actions/userActions";
import { get, post } from "../../utils/api";
import RIMintingCheck from "../common/RIMintingCheck";
import ClaimForm from "./ClaimForm";
import SwapForm from "./SwapForm";
import SyncIcon from "@mui/icons-material/Sync";
import CustomModal from "../common/CustomModal";
import CustomNumberInput from "../common/CustomNumberInput";
import { CoinList } from "../../settings/constants";
import { CustomLoadingButton } from "../common/CustomButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  return (
    <RIMintingCheck isText={true}>
      <Wallets />
    </RIMintingCheck>
  );
};

const Wallets = () => {
  const { user, setting } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { library } = setting;
  const { balances, information, lockBalances, walletAddress } = user;
  const [funds, setFunds] = useState(null);
  const [showClaim, setShowClaim] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

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

  const _syncData = () => {
    post(
      EndpointConstant.FUND_SYNC_DEPOSIT,
      {},
      () => {
        dispatch(_getBalance());
        toast.success("Synced");
      },
      (error) => {
        dispatch(_showAppError(error));
      }
    );
  };

  return (
    <div className="my-wallet">
      {funds && (
        <Container maxWidth="xl">
          <div>
            <Grid container spacing={2}>
              {inGame.map((item, index) => {
                return (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <div
                      className="wallet-items"
                      style={{ position: "relative" }}
                    >
                      <Box display="flex" alignItems="center">
                        <p className="custom-font">{item.label}</p>
                        {item.key === "ING" && (
                          <IconButton
                            sx={{
                              width: "unset!important",
                              p: "8px!important",
                            }}
                            onClick={_syncData}
                          >
                            <SyncIcon sx={{ fontSize: "1.5rem!important" }} />
                          </IconButton>
                        )}
                      </Box>
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
                      {item.key === "ING" && (
                        <>
                          {parseFloat(
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
                          <Button
                            className="custom-btn custom-font"
                            onClick={() => setShowDeposit(true)}
                            sx={{
                              mt: 1,
                            }}
                          >
                            Deposit
                          </Button>
                        </>
                      )}
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </Container>
      )}
      <SwapForm showSwap={showSwap} _close={() => setShowSwap(false)} />
      <ClaimForm open={showClaim} _onClose={() => setShowClaim(false)} />
      <DepositForm
        open={showDeposit}
        _close={() => setShowDeposit(false)}
        funds={funds}
        walletAddress={walletAddress}
        _syncData={_syncData}
      />
    </div>
  );
};

export default MyWallet;

const DepositForm = ({ open, _close, funds, walletAddress, _syncData }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { setting } = useSelector((state) => state);
  const { library, applicationConfig } = setting;

  useEffect(() => {
    if (open) {
      setAmount("");
      setIsApproved(false);
      setIsConfirmed(false);
    }
  }, [open]);

  const _handleDepositING = (e) => {
    e.preventDefault();
    const boxScPrice = parseUnits(formatPrice(amount, 2), 18);
    setLoading(true);
    _checkBeforePurchase(
      applicationConfig.ADDRESS_DEPOSIT_ING,
      funds.ING.contractAddress,
      boxScPrice,
      walletAddress,
      () => setLoading(false)
    ).then((success) => {
      if (success) {
        setIsApproved(true);
        _depositING(applicationConfig.ADDRESS_DEPOSIT_ING, boxScPrice).then(
          (txHash) => {
            _getReceipt(txHash).then((success) => {
              if (success) {
                setIsConfirmed(true);
                toast.success("Success");
                setLoading(false);
                _syncData();
                _close();
              }
            });
          }
        );
      }
    });
  };
  return (
    <CustomModal open={open} _close={_close}>
      <Box component="form" onSubmit={_handleDepositING} p={2}>
        <Typography
          variant="h6"
          className="custom-font"
          textAlign="left"
          mb={3}
        >
          Deposit ING
        </Typography>
        <CustomNumberInput
          fullWidth
          label="Amount"
          placeholder="Please enter ING amount"
          id="amount"
          name="amount"
          disabled={loading}
          inputProps={{
            autoFocus: true,
            step: "any",
            type: "number",
            min: "0",
            onWheel: (e) => e.target.blur(),
          }}
          InputProps={{
            endAdornment: (
              <img
                src={`/images/coins/${CoinList.ING}.png`}
                width="50px"
                alt="ing-logo"
              />
            ),
          }}
          onChange={(e) => setAmount(e.target.value)}
        />
        <CustomLoadingButton loading={loading} type="submit" sx={{ mt: 1 }}>
          Submit
        </CustomLoadingButton>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Box
            sx={{
              justifyContent: "flex-start",
              opacity: isApproved ? 1 : 0.5,
              display: "flex",
            }}
          >
            <CheckCircleIcon />
            <Typography ml={1} variant="body2">
              {library.APPROVED}
            </Typography>
          </Box>
          <Box
            sx={{
              justifyContent: "flex-start",
              opacity: isConfirmed ? 1 : 0.5,
              display: "flex",
            }}
          >
            <CheckCircleIcon />
            <Typography ml={1} variant="body2">
              {library.CONFIRMED}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CustomModal>
  );
};
