import {
  Container,
  Divider,
  Pagination,
  Backdrop,
  Box,
  Grid,
  Typography,
  Modal,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { explorer_url } from "../../settings";
import { EndpointConstant } from "../../settings/endpoint";
import { formatAddress, formatAmount, formatUSD } from "../../settings/format";
import { post } from "../../utils/api";
import Loader from "../common/Loader";

const History = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [detail, setDetail] = useState(null);
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  const menus = [
    {
      title: "BOX_HISTORY",
      type: ["BUY_BOX"],
      columns: [
        { key: "tokenId", label: "", format: (e) => `#${e}` },
        { key: "type", label: "TYPE", format: (e) => e.replace(/_/g, " ") },
        {
          key: "txHash",
          label: "TX_HASH",
          format: (e) => (
            <a target="_blank" rel="noreferrer" href={`${explorer_url}/${e}`}>
              {formatAddress(e)}
            </a>
          ),
        },
        {
          key: "price",
          label: "PRICE",
          format: (e, row) => `${formatAmount(e)} ${row.coin}`,
        },
        {
          key: "createdTime",
          label: "TIME",
          format: (e) => moment(e).format("YYYY-MM-DD HH:mm:ss"),
        },
      ],
    },
    {
      title: "NFT_HISTORY",
      type: ["BUY_NFT", "DELIST", "LISTING", "SELL_NFT"],
      columns: [
        { key: "id", label: "", format: (e) => `#${e}` },
        { key: "type", label: "TYPE", format: (e) => e.replace(/_/g, " ") },
        { key: "refId", label: "NFT_ID", format: (e) => e },
        {
          key: "txHash",
          label: "TX_HASH",
          format: (e) => (
            <a target="_blank" rel="noreferrer" href={`${explorer_url}/${e}`}>
              {formatAddress(e)}
            </a>
          ),
        },
        {
          key: "amount",
          label: "PRICE",
          format: (e, row) => `${formatAmount(e)} ${row.coin}`,
        },
        {
          key: "createdTime",
          label: "TIME",
          format: (e) => moment(e).format("YYYY-MM-DD HH:mm:ss"),
        },
      ],
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
            {library[item.title]}
          </li>
        ))}
      </ul>
      <Divider className="mt-20" />
      <HistoryTable menu={menus[tabIndex]} />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={detail ? true : false}
        onClose={() => setDetail(null)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        {detail ? (
          <Box className="ri-detail-popup">
            <Grid container>
              <Grid item xs={3}>
                <Typography className="label">{library.ANGEL}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {detail.angel
                    ? `${detail.angel.name} ${detail.angel.level.replace(
                        /_/g,
                        " "
                      )}`
                    : "- -"}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className="label">
                  {library.MINION_PARTS}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {detail.minion
                    ? `${detail.minion.name} ${detail.minion.level.replace(
                        /_/g,
                        " "
                      )}`
                    : "- -"}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className="label">{library.COSTUME}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {detail.skin
                    ? `${detail.skin.name} Type ${detail.skin.level.replace(
                        /_/g,
                        " "
                      )}`
                    : "- -"}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className="label">{library.RECEIVED}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {`${formatUSD(detail.receivedInc)} ${detail.coin}`}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className="label">{library.RI_TIME}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {`${parseInt(detail.time)}m ${parseInt(
                    (detail.time % 1) * 60
                  )}s`.replace("0s", "")}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className="label">{library.START_TIME}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {moment(detail.startTime).format("HH:MM:ss YYYY-MM-DD")}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <div />
        )}
      </Modal>
    </Container>
  );
};

export default History;

const HistoryTable = ({ menu }) => {
  const [history, setHistory] = useState(null);
  const [page, setPage] = useState(1);
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  useEffect(() => {
    setHistory(null);
    if (menu.type[0] !== "BUY_BOX") {
      const params = {
        page: page,
        pageSize: 10,
        types: menu.type,
      };
      post(
        EndpointConstant.NFT_TRANSACTION_LIST,
        params,
        (data) => {
          setHistory(data);
        },
        (error) => console.error(error)
      );
    }
    if (menu.type[0] === "BUY_BOX") {
      const params = {
        page: page,
        pageSize: 10,
      };
      post(
        EndpointConstant.NFT_MY_BOX_HISTORY,
        params,
        (data) => {
          setHistory(data);
        },
        (error) => console.error(error)
      );
    }
  }, [menu.type, page]);

  return (
    <>
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
          {history &&
            history.items.map((row) => (
              <tr key={row.id}>
                {menu.columns.map((col) => (
                  <td key={row}>
                    {col.format ? col.format(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          {history && history.itemCount === 0 && (
            <tr>
              <td className="blank" colSpan={menu.columns.length}>
                {library.NO_RECORDS_FOUND}
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
    </>
  );
};
