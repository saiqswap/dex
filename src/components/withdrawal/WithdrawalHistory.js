import { Grid, Paper, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ENDPOINT_GET_WITHDRAW } from "../../settings/endpoint";
import { post } from "../../utils/api";

export default function WithdrawalHistory() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState(null);
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  useEffect(() => {
    const param = {
      page: page,
      pageSize: pageSize,
      search: "",
      orderBy: "",
      responseMeta: true,
      filters: {},
    };
    post(ENDPOINT_GET_WITHDRAW, param, (data) => {
      setData(data);
    });
  }, [page, pageSize]);

  // eslint-disable-next-line no-unused-vars
  const _handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className="box" style={{ paddingBottom: 10 }}>
            <Typography>{library.WITHDRAW_HISTORY}</Typography>
          </Paper>
        </Grid>
        {data &&
          data.items.map((item, index) => (
            <Grid item xs={12} kye={index}>
              <Paper className="box">
                <Grid container>
                  <Grid item xs={6} style={{ fontWeight: 600 }}>
                    {item.asset}
                  </Grid>
                  <Grid item xs={6} align="right" style={{ fontWeight: 600 }}>
                    {item.amount}
                  </Grid>
                  <Grid item xs={6}>
                    <small>
                      {moment(item.createdTime).format("yyyy-MM-DD hh:mm:ss")}
                    </small>
                  </Grid>
                  <Grid item xs={6} align="right">
                    <small>{library[item.status]}</small>
                  </Grid>
                  <Grid item xs={12}>
                    <small>Address: {item.address}</small>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        {data && data.items.length === 0 && (
          <Grid item xs={12} align="center">
            No data for load
          </Grid>
        )}{" "}
      </Grid>
    </div>
  );
}
