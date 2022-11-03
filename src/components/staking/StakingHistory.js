import styled from "@emotion/styled";
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
import { _getBalance, _getNewProfile } from "../../store/actions/userActions";
import { put } from "../../utils/api";
import CustomBlueSmallModal from "../common/CustomBlueSmallModal";
import { CustomLoadingButton } from "../common/CustomButton";

const CustomContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
}));

const StakingHistory = () => {
  const { stakingStore, user } = useSelector((state) => state);
  const { myStakes, packageList } = stakingStore;
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
      key: "startTime",
      label: "Time",
      format: (e) => moment(e).format("YYYY-MM-DD hh:mm:ss"),
    },
    {
      key: "amount",
      label: "Staking Amount",
      format: (e) => formatUSD(e) + " " + CoinList.ING,
    },
    {
      key: "endTime",
      label: "Unstake Date",
      format: (e) => moment(e).format("YYYY-MM-DD"),
    },
    {
      key: "amountPaid",
      label: "Accumulated interest",
      format: (e) => formatUSD(e) + " " + CoinList.ING,
    },
    {
      key: "status",
      label: "",
      format: (e, row) =>
        e === STAKING_STATUS.STAKING && (
          <Link size="small" onClick={() => setSelectedStake(row)}>
            Unstake Now
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
        dispatch(_getNewProfile());
      },
      (error) => {
        dispatch(_showAppError(error));
        setLoading(false);
      }
    );
  };

  return information ? (
    <>
      <CustomContainer>
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
              {myStakes?.listStaking?.map((row, index) => (
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
      </CustomContainer>
      <CustomBlueSmallModal
        open={Boolean(selectedStake)}
        _close={() => setSelectedStake(null)}
        isShowCloseButton={!loading}
      >
        <Typography mb={2} variant="h6">
          Are you sure you want to unstake before the unstake expected date with
          a fee of 1%?
        </Typography>
        <Box display="flex">
          <CustomLoadingButton
            loading={loading}
            fullWidth
            onClick={() => setSelectedStake(null)}
          >
            No
          </CustomLoadingButton>
          <Box width={16} />
          <CustomLoadingButton loading={loading} fullWidth onClick={_unStake}>
            Yes
          </CustomLoadingButton>
        </Box>
      </CustomBlueSmallModal>
    </>
  ) : null;
};

export default StakingHistory;
