import { Box, Link, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CoinList, STAKING_STATUS } from "../../settings/constants";
import { EndpointConstant } from "../../settings/endpoint";
import { formatUSD } from "../../settings/format";
import { _showAppError } from "../../store/actions/settingActions";
import { _getMyStakes } from "../../store/actions/stakingActions";
import { _getBalance } from "../../store/actions/userActions";
import { put } from "../../utils/api";
import CustomBlueSmallModal from "../common/CustomBlueSmallModal";
import { CustomLoadingButton } from "../common/CustomButton";

const StakingHistory = () => {
  const { stakingStore, user } = useSelector((state) => state);
  const { myStakes, packageList } = stakingStore;
  const [page, setPage] = useState(1);
  const [selectedStake, setSelectedStake] = useState(null);
  const { information } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (information && packageList) {
      dispatch(_getMyStakes(packageList));
    }
  }, [dispatch, information, packageList]);

  const menu = [
    {
      key: "amount",
      label: "Total amount",
      format: (e) => formatUSD(e) + " " + CoinList.ING,
    },
    {
      key: "packageId",
      label: "Package ID",
      format: (e) => e,
    },
    {
      key: "estUnStakeFee",
      label: "Fee",
      format: (e) => e,
    },
    // {
    //   key: "",
    //   label: "Est. APY",
    //   format: (e) => "12%",
    // },
    {
      key: "timeToNextPay",
      label: "Next time to pay",
      format: (e) => moment(e).format("YYYY-MM-DD"),
    },
    {
      key: "startTime",
      label: "Interest Start Date",
      format: (e) => moment(e).format("YYYY-MM-DD"),
    },
    {
      key: "endTime",
      label: "Interest End Date",
      format: (e) => moment(e).format("YYYY-MM-DD"),
    },
    // {
    //   key: "",
    //   label: "Interest Period",
    //   format: (e) => "1 Days",
    // },
    {
      key: "status",
      label: "Status",
      // format: (e) => "1 Days",
    },
    {
      key: "status",
      label: "",
      format: (e, row) =>
        e === STAKING_STATUS.STAKING && (
          <Link size="small" onClick={() => setSelectedStake(row)}>
            Unstake
          </Link>
        ),
    },
  ];

  const _unStake = () => {
    setLoading(true);
    put(
      `${EndpointConstant.STAKING_UN_STAKE}?stakingId=${selectedStake.id}`,
      {},
      () => {
        toast.success("Success");
        setLoading(false);
        setSelectedStake(null);
        dispatch(_getMyStakes(packageList));
        dispatch(_getBalance());
      },
      (error) => {
        dispatch(_showAppError(error));
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Box mt={"-30px"} width="100%" overflow="auto">
        <table className="custom-table">
          <thead>
            <tr>
              {menu.map((item, index) => (
                <th
                  className="custom-font"
                  key={index}
                  style={{ wordBreak: "keep-all" }}
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myStakes?.map((row, index) => (
              <tr key={index}>
                {menu.map((item, index) => (
                  <td key={index}>
                    {item.format
                      ? item.format(row[item.key], row)
                      : row[item.key]}
                  </td>
                ))}
              </tr>
            ))}
            {myStakes?.itemCount === 0 && (
              <tr>
                <td className="blank" colSpan={menu.length}>
                  NO RECORD
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* {history ? (
          <Pagination
            count={history.pageCount}
            variant="outlined"
            shape="rounded"
            onChange={(e, nextPage) => setPage(nextPage)}
            defaultPage={page}
          />
        ) : (
          <Loader />
        )} */}
      </Box>
      <CustomBlueSmallModal
        open={Boolean(selectedStake)}
        _close={() => setSelectedStake(null)}
        isShowCloseButton={!loading}
      >
        <Typography mb={2} variant="h6" className="custom-font">
          Are you sure for UNSTAKE #{selectedStake?.id} ?
        </Typography>
        <CustomLoadingButton loading={loading} fullWidth onClick={_unStake}>
          Unstake
        </CustomLoadingButton>
      </CustomBlueSmallModal>
    </>
  );
};

export default StakingHistory;
