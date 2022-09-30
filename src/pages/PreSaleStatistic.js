import { TabContext, TabPanel } from "@mui/lab";
import {
  Box,
  Divider,
  Grid,
  Modal,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import BackgroundComponent from "../components/common/BackgroundComponent";
import { CustomButton } from "../components/common/CustomButton";
import Loader from "../components/common/Loader";
import { _claimToken } from "../onchain";
import { provider } from "../onchain/onchain";
import { PRE_SALE_ROUNDS, PRE_SALE_TOKEN } from "../settings/constants";
import { formatNumberWithDecimal } from "../settings/format";
import { _getOnchainBalance } from "../store/actions/userActions";

const CustomBox = styled(Box)({
  borderRadius: "7px",
  border: "1px solid var(--border-color)",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  backdropFilter: "blur(20px)",
});

export default function PreSaleStatistic() {
  const { user, setting } = useSelector((state) => state);
  let { preSaleTokenBalances, walletAddress } = user;
  const { library } = setting;
  const [value, setValue] = useState("0");

  if (preSaleTokenBalances) {
    preSaleTokenBalances = preSaleTokenBalances?.filter(
      (r) =>
        r.arrVesting.length > 0 &&
        r.vestingId !== "0x2000000000000000000000000000000000000000"
    );
  }

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <BackgroundComponent>
      <Container>
        {preSaleTokenBalances && walletAddress ? (
          preSaleTokenBalances.length > 0 ? (
            <TabContext value={value}>
              <CustomBox sx={{ mb: 2 }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  {preSaleTokenBalances?.map((item, index) => (
                    <Tab
                      label={`${library.ROUND} ${
                        item.key === 0 ? "OG" : item.key ? item.key : "special"
                      }`}
                      key={index}
                      sx={{ color: "var(--text-color)" }}
                      value={String(index)}
                    />
                  ))}
                </Tabs>
              </CustomBox>
              {preSaleTokenBalances?.map((item, index) => (
                <VestingDetail data={item} key={index} index={index} />
              ))}
            </TabContext>
          ) : (
            <Typography color="#fff" sx={{ position: "relative" }}>
              {library.NO_RECORDS_FOUND}
            </Typography>
          )
        ) : (
          <Loader />
        )}
      </Container>
    </BackgroundComponent>
  );
}

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

const VestingDetail = ({ data, index }) => {
  const { setting, user } = useSelector((state) => state);
  const { library, config } = setting;
  const { walletAddress } = user;
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [information, setInformation] = useState(null);
  const [currentLockAmount, setCurrentLockAmount] = useState(0);
  const [totalUnlockAmount, setTotalUnlockAmount] = useState(0);

  useState(() => {
    if (data) {
      let totalUnlockAmount = data.totalUnlockAmount;
      data.arrVesting.forEach((element) => {
        if (element.isWithdrawal) totalUnlockAmount += element.unlockAmount;
      });
      setTotalUnlockAmount(totalUnlockAmount);
      setCurrentLockAmount(data.totalLockAmount - totalUnlockAmount);
    }
  });

  useEffect(() => {
    const temp = PRE_SALE_ROUNDS.find(
      (round) => round.roundId === data.vestingId
    );
    if (temp) {
      setInformation(temp.notices[temp.key > 1 ? 2 : 1]);
    }
  }, [data.vestingId]);

  const _handleClaim = () => {
    setOpenConfirm(false);
    _claimToken(
      data.vestingId,
      () => {
        _syncData();
      },
      () => toast.error(library.SOMETHING_WRONG)
    );
  };

  const _syncData = () => {
    dispatch(_getOnchainBalance(config.contracts, walletAddress, provider));
  };

  return (
    <>
      <TabPanel value={String(index)} index={index} sx={{ padding: 0 }}>
        <CustomBox p={2}>
          <Typography>
            {library.INFORMATION}: {library[information]}
          </Typography>
          <Typography>
            {library.WITHDRAWABLE_AMOUNT}:{" "}
            {formatNumberWithDecimal(data.totalUnlockAmount, 2)} ING
          </Typography>
          <Typography>
            {library.TOTAL_AMOUNT}:{" "}
            {formatNumberWithDecimal(data.totalLockAmount, 2)} ING
          </Typography>
          <Typography>
            {library.TOTAL_LOCK_AMOUNT}:{" "}
            {formatNumberWithDecimal(currentLockAmount, 2)} ING
          </Typography>
          <Typography>
            {library.TOTAL_UNLOCK_AMOUNT}:{" "}
            {formatNumberWithDecimal(totalUnlockAmount, 2)} ING
          </Typography>
          {Number(data.totalUnlockAmount).toFixed(2) > 0 && (
            <Box mt={1}>
              <CustomButton onClick={() => setOpenConfirm(true)}>
                {library.CLAIM}
              </CustomButton>
            </Box>
          )}
          <Grid container mt={1} spacing={1}>
            {data.arrVesting.map((vesting, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Box
                  sx={{
                    border: "1px solid var(--border-color)",
                    borderRadius: "7px",
                  }}
                  p={2}
                  mb={1}
                >
                  <Typography variant="body2">
                    {index === 0
                      ? "TGE"
                      : `${ordinal_suffix_of(vesting.period)} ${library.MONTH}`}
                  </Typography>
                  <Typography variant="body2">
                    {library.RELEASE_TIME}:{" "}
                    {moment(vesting.releaseTime * 1000).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {library.RATE}:{" "}
                    {formatNumberWithDecimal(vesting.percentage, 2)}%
                  </Typography>
                  <Typography variant="body2">
                    {library.AMOUNT_UNLOCK}:{" "}
                    {formatNumberWithDecimal(vesting.unlockAmount, 2)} ING
                  </Typography>
                  <Typography variant="body2">
                    {library.WITHDRAWAL_AVAILABILITY}:{" "}
                    {vesting.isWithdrawal ? "Yes" : "No"}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CustomBox>
      </TabPanel>
      <ConfirmPopup
        open={openConfirm}
        _onAccept={_handleClaim}
        _onClose={() => setOpenConfirm(false)}
        data={data}
      />
    </>
  );
};

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999999,
};
const styleBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function ConfirmPopup({ open, _onClose, _onAccept, data }) {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  return (
    <Modal open={open} onClose={_onClose} sx={style}>
      <Box className="modal-confirm-change-chain-bg">
        <Typography variant="h6" className="custom-font">
          {library.CONFIRM_TRANSACTION}
        </Typography>
        <Divider className="mb-20" />
        <Box
          display={"flex"}
          justifyContent={"center"}
          className="custom-font"
          mb={3}
        >
          <Typography>
            {library.DO_YOU_WANT_TO_WITHDRAW}{" "}
            {formatNumberWithDecimal(data.totalUnlockAmount, 2)}{" "}
            {PRE_SALE_TOKEN} ?
          </Typography>
        </Box>
        <Box sx={styleBtn}>
          <CustomButton
            sx={{ marginRight: "10px" }}
            className="btn-submit"
            onClick={() => _onAccept()}
          >
            Ok
          </CustomButton>
          <CustomButton
            sx={{ marginLeft: "10px" }}
            className="btn-cancel"
            onClick={() => _onClose()}
          >
            {library.CANCEL}
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
}
