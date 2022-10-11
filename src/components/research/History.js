import {
  Backdrop,
  Box,
  Container,
  Grid,
  Modal,
  Pagination,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { formatUSD } from "../../settings/format";
import { get } from "../../utils/api";
import Loader from "../common/Loader";

const History = () => {
  const [history, setHistory] = useState(null);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);

  const menu = [
    { key: "id", label: "ID", format: (e) => `#${e}` },
    {
      key: "receivedInc",
      label: "Recieve",
      format: (e) => formatUSD(e),
    },
    {
      key: "coin",
      label: "Coin",
    },
    {
      key: "startTime",
      label: "Start time",
      format: (e) => moment(e).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      key: "endTime",
      label: "End time",
      format: (e) => moment(e).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      key: "",
      label: "",
      format: (e, row) => (
        <span className="link" onClick={() => setDetail(row)}>
          View Detail
        </span>
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
      <Container>
        <table className="custom-table">
          <thead>
            <tr>
              {menu.map((item, index) => (
                <th className="custom-font" key={index}>
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
      </Container>
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
                    ? `${detail.skin.name} ${detail.skin.level.replace(
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
                  {moment(detail.startTime).utc().format("HH:MM:ss YYYY-MM-DD")}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <div />
        )}
      </Modal>
    </>
  );
};

export default History;
