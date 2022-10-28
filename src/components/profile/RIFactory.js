import { LoadingButton } from "@mui/lab";
import { Button, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { _showError } from "../../onchain";
import { AppConfig } from "../../settings";
import { CoinList, RI_USER_TYPE } from "../../settings/constants";
import { EndpointConstant } from "../../settings/endpoint";
import { formatNumberWithDecimal } from "../../settings/format";
import { _getBalance, _getLockBalances } from "../../store/actions/userActions";
import { get, put } from "../../utils/api";
import CustomBlueSmallModal from "../common/CustomBlueSmallModal";

export default function RIFactory() {
  const { user } = useSelector((state) => state);
  const history = useHistory();
  const { riUserType } = user;

  useEffect(() => {
    if (riUserType && riUserType !== RI_USER_TYPE.ROOT) {
      history.push("/marketplace");
    }
  }, [history, riUserType]);

  return (
    <Container maxWidth={"lg"} className="history-page">
      <AccountsComponent />
    </Container>
  );
}

const AccountsComponent = () => {
  const [data, setData] = useState(null);
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const [totalINCBalance, setTotalINCBalance] = useState(0);
  const [flag, setFlag] = useState(false);

  const menu = {
    title: "WITHDRAW",
    type: ["WITHDRAW"],
    columns: [
      { key: "id", label: "", format: (e) => `#${e}` },
      {
        key: "user",
        label: "WALLET_ADDRESS",
        format: ({ address }) => `${address}`,
      },
      { key: "slots", label: "NUMBER_OF_SLOTS", format: (e) => `${e.length}` },
      {
        key: "INCBalance",
        label: "AMOUNT",
        format: (e) => `${formatNumberWithDecimal(e, 2)} ${CoinList.INC}`,
      },
    ],
  };

  useEffect(() => {
    get(EndpointConstant.NFT_RI_ROOT, (data) => {
      const list = [];
      let tempTotalINC = 0;
      data.balances.forEach((element) => {
        if (element.asset === CoinList.INC) {
          tempTotalINC += element.amount;
        }
      });
      data.members.forEach((element) => {
        const INCBalance = data.balances.find(
          (b) => b.asset === CoinList.INC && b.userId === element.userId
        );
        element.INCBalance = INCBalance ? INCBalance.amount : 0;
        list.push(element);
      });
      setTotalINCBalance(tempTotalINC);
      setData(list);
    });
  }, [flag]);

  const _reload = () => {
    setFlag((oldFlag) => !oldFlag);
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "auto",
      }}
    >
      <SwapWithdrawComponent
        totalINCBalance={totalINCBalance}
        _reload={_reload}
      />
      <table className="custom-table">
        <thead>
          <tr>
            {menu.columns.map((col, index) => (
              <th className="custom-font" key={index}>
                {library[col.label]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={`${menu.type[0]}-${index}`}>
              {menu.columns.map((col) => (
                <td key={`${col.key}-${index}`}>
                  {col.format ? col.format(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data && data.itemCount === 0 && (
            <tr>
              <td className="blank" colSpan={menu.columns.length}>
                {library.NO_RECORDS_FOUND}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  );
  // {
  //   data ? (
  //     <Pagination
  //       count={data.pageCount}
  //       variant="outlined"
  //       shape="rounded"
  //       onChange={(e, nextPage) => setPage(nextPage)}
  //       defaultPage={page}
  //     />
  //   ) : (
  //     <Loader />
  //   );
  // }
};

const SwapWithdrawComponent = ({ totalINCBalance, _reload }) => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { information } = user;

  useEffect(() => {
    if (information) {
      dispatch(_getLockBalances());
    }
  }, [dispatch, information]);

  return (
    <div className="my-wallet">
      <div>
        <Grid container spacing={2}>
          <INCBalanceComponent
            totalINCBalance={totalINCBalance}
            _reload={_reload}
          />
          <INGBalanceComponent _reload={_reload} />
        </Grid>
      </div>
    </div>
  );
};

const INCBalanceComponent = ({ totalINCBalance, _reload }) => {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const _handleRootSwap = () => {
    setLoading(true);
    put(
      EndpointConstant.RI_FACTORY_ROOT_SWAP,
      {},
      () => {
        toast.success("Success");
        setLoading(false);
        setConfirming(false);
        _reload();
        dispatch(_getBalance());
      },
      (error) => {
        dispatch(_showError(error));
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Grid item xs={12} md={6} lg={4}>
        <div className="wallet-items">
          <p className="custom-font">InfinityAngel INC</p>
          <Box
            mb={5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <div>
              <p>{formatNumberWithDecimal(totalINCBalance, 2)}</p>
            </div>
            <img
              src={`/images/coins/${CoinList.INC}.png`}
              alt="symbol"
              width="60px"
            />
          </Box>
          {parseFloat(totalINCBalance) > 0 && AppConfig.OPEN_FEATURES.isSwap && (
            <Button
              className="custom-btn custom-font"
              onClick={() => setConfirming(true)}
            >
              Swap
            </Button>
          )}
        </div>
      </Grid>
      <CustomBlueSmallModal
        open={confirming}
        _close={() => setConfirming(false)}
        isShowCloseButton={true}
      >
        <div className="listing-popup">
          <Typography variant="h6" className="custom-font">
            Are you sure for swap {formatNumberWithDecimal(totalINCBalance, 2)}{" "}
            {CoinList.INC} to all of members ?
          </Typography>
          <LoadingButton
            className="custom-btn custom-font mt-20"
            onClick={_handleRootSwap}
            loading={loading}
            fullWidth
          >
            Submit
          </LoadingButton>
        </div>
      </CustomBlueSmallModal>
    </>
  );
};

const INGBalanceComponent = ({ _reload }) => {
  const { user } = useSelector((state) => state);
  const { balances } = user;
  const [totalINGBalance, setTotalINGBalance] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const _handleRootWithdraw = () => {
    setLoading(true);
    put(
      EndpointConstant.RI_FACTORY_ROOT_WITHDRAW,
      {},
      () => {
        toast.success("Success");
        setLoading(false);
        setConfirming(false);
        _reload();
        dispatch(_getBalance());
      },
      (error) => {
        dispatch(_showError(error));
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (balances) {
      setTotalINGBalance(balances.find((b) => b.asset === CoinList.ING).amount);
    }
  }, [balances]);

  return (
    <>
      <Grid item xs={12} md={6} lg={4}>
        <div className="wallet-items">
          <p className="custom-font">InfinityAngel Gem (ING)</p>
          <Box
            mb={5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <div>
              <p>{formatNumberWithDecimal(totalINGBalance, 2)}</p>
            </div>
            <img
              src={`/images/coins/${CoinList.ING}.png`}
              alt="symbol"
              width="60px"
            />
          </Box>
          {parseFloat(formatNumberWithDecimal(totalINGBalance, 2)) > 0 &&
            AppConfig.OPEN_FEATURES.isClaim && (
              <Button
                className="custom-btn custom-font"
                onClick={() => setConfirming(true)}
              >
                Claim
              </Button>
            )}
        </div>
      </Grid>
      <CustomBlueSmallModal
        open={confirming}
        _close={() => setConfirming(false)}
        isShowCloseButton={true}
      >
        <div className="listing-popup">
          <Typography variant="h6" className="custom-font">
            Are you sure for claim {formatNumberWithDecimal(totalINGBalance, 2)}{" "}
            {CoinList.ING} ?
          </Typography>
          <LoadingButton
            className="custom-btn custom-font mt-20"
            onClick={_handleRootWithdraw}
            loading={loading}
            fullWidth
          >
            Submit
          </LoadingButton>
        </div>
      </CustomBlueSmallModal>
    </>
  );
};
