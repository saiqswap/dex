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
import { explorer_url } from "../../settings";
import { formatAddress, formatAmount, formatUSD } from "../../settings/format";
import { post } from "../../utils/api";
import Loader from "../common/Loader";

const History = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [detail, setDetail] = useState(null);

  const menus = [
    {
      title: "Box History",
      type: ["BUY_BOX"],
      columns: [
        { key: "tokenId", label: "", format: (e) => `#${e}` },
        { key: "type", label: "TYPE", format: (e) => e.replace(/_/g, " ") },
        {
          key: "txHash",
          label: "Tx Hash",
          format: (e) => (
            <a target="_blank" rel="noreferrer" href={`${explorer_url}/${e}`}>
              {formatAddress(e)}
            </a>
          ),
        },
        {
          key: "price",
          label: "Price",
          format: (e, row) => `${formatAmount(e)} ${row.coin}`,
        },
        {
          key: "createdTime",
          label: "Time",
          format: (e) => moment(e).format("YYYY-MM-DD HH:mm:ss"),
        },
      ],
    },
    {
      title: "NFT History",
      type: ["BUY_NFT", "DELIST", "LISTING", "SELL_NFT"],
      columns: [
        { key: "id", label: "", format: (e) => `#${e}` },
        { key: "type", label: "TYPE", format: (e) => e.replace(/_/g, " ") },
        { key: "refId", label: "NFT ID", format: (e) => e },
        {
          key: "txHash",
          label: "Tx Hash",
          format: (e) => (
            <a target="_blank" rel="noreferrer" href={`${explorer_url}/${e}`}>
              {formatAddress(e)}
            </a>
          ),
        },
        {
          key: "amount",
          label: "Price",
          format: (e, row) => `${formatAmount(e)} ${row.coin}`,
        },
        {
          key: "createdTime",
          label: "Time",
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
            {item.title}
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
        {detail && (
          <Box className="ri-detail-popup">
            <Grid container>
              <Grid item xs={3}>
                <Typography className="label">Angel</Typography>
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
                <Typography className="label">Minion Parts</Typography>
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
                <Typography className="label">Costume</Typography>
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
                <Typography className="label">Received</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {`${formatUSD(detail.receivedInc)} ${detail.coin}`}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className="label">Ri-Time</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {`${parseInt(detail.time)}m ${parseInt(
                    (detail.time % 1) * 60
                  )}s`.replace("0s", "")}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className="label">Start time</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography className="value">
                  {moment(detail.startTime).format("HH:MM:ss YYYY-MM-DD")}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Modal>
    </Container>
  );
};

export default History;

const HistoryTable = ({ menu }) => {
  const [history, setHistory] = useState(null);
  const [page, setPage] = useState(1);

  console.log(history);

  useEffect(() => {
    setHistory(null);
    if (menu.type[0] !== "BUY_BOX") {
      const params = {
        page: page,
        pageSize: 10,
        types: menu.type,
      };
      post(
        "/nft-transaction/list",
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
        "/nft/my-box-history",
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
                {col.label}
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
    </>
  );
};
