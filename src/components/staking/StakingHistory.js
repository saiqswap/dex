import { Box, Link, Pagination } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CoinList } from "../../settings/constants";
import { formatUSD } from "../../settings/format";
import { get } from "../../utils/api";
import CustomBlueSmallModal from "../common/CustomBlueSmallModal";
import Loader from "../common/Loader";

const StakingHistory = () => {
  const [history, setHistory] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedStake, setSelectedStake] = useState(null);

  const menu = [
    {
      key: "receivedInc",
      label: "Total amount",
      format: (e) => formatUSD(e) + " " + CoinList.ING,
    },
    {
      key: "",
      label: "Est. APY",
      format: (e) => "12%",
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
    {
      key: "",
      label: "Interest Period",
      format: (e) => "1 Days",
    },
    {
      key: "",
      label: "",
      format: (e, row) => (
        <Link size="small" onClick={() => setSelectedStake(row)}>
          Unstake
        </Link>
      ),
    },
  ];

  useEffect(() => {
    setHistory(null);
    get(
      `/nft/ri?page=${page}&pageSize=10&status=COMPLETED`,
      (data) => {
        setHistory(data);
      },
      (error) => console.error(error)
    );
  }, [page]);

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
            {history &&
              history.items.map((row, index) => (
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
            {history && history.itemCount === 0 && (
              <tr>
                <td className="blank" colSpan={menu.length}>
                  NO RECORD
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {history ? (
          <Pagination
            count={history.pageCount}
            variant="outlined"
            shape="rounded"
            onChange={(e, nextPage) => setPage(nextPage)}
            defaultPage={page}
          />
        ) : (
          <Loader />
        )}
      </Box>
      <CustomBlueSmallModal
        open={Boolean(selectedStake)}
        _close={() => setSelectedStake(null)}
        isShowCloseButton
      >
        {selectedStake?.id}
      </CustomBlueSmallModal>
    </>
  );
};

export default StakingHistory;
