import styled from "@emotion/styled";
import {
  Box,
  Container,
  Divider,
  Grid,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { image_url } from "../../settings";
import { EndpointConstant } from "../../settings/endpoint";
import { formatUSD } from "../../settings/format";
import { get } from "../../utils/api";
import Loader from "../common/Loader";

const BoxItem = styled(Box)({
  background: "rgba(255,255,255,0.1)",
  borderTopLeftRadius: "5px",
  whiteSpace: "nowrap",
  height: 25,
  width: "25px!important",
  cursor: "pointer",
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: 0,
  top: 0,
  fontWeight: 600,
});

const RISpecialRooms = () => {
  const { user } = useSelector((state) => state);
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
  const [mounted, setMounted] = useState(true);
  const { information } = user;
  const [page, setPage] = useState(1);

  console.log(information);

  useEffect(() => {
    if (information) {
      setData(null);
      get(
        `${EndpointConstant.NFT_RI}?page=${page}&pageSize=${information.limitRiSlot}`,
        (data) => {
          data.items = data.items.filter((item) => item.angel);
          data.items.reverse();
          setData(data);
          setReload(false);
        },
        () => toast.error("error")
      );
    }
  }, [information, page]);

  return data ? (
    <div className="research-room">
      <Container style={{ marginBottom: 20 }}>
        <Grid container spacing={2}>
          {data.items &&
            data.items.map((item, index) => (
              <Grid item xs={12} md={6} sx={{ margin: "auto" }} key={index}>
                <Box className="box-slot">
                  <Box className="box-body">
                    <Box className="box-body-main box--item">
                      <div className="name-and-type">
                        <Typography variant="body2">
                          {item.angel?.name}
                        </Typography>
                        <Typography variant="caption">
                          {item.angel?.level.toLowerCase().replace("_", " ")}
                        </Typography>
                      </div>
                      <img
                        src={`${image_url}/body_${item.angel?.name
                          .replace("-", "_")
                          .replace(" ", "_")
                          .toLowerCase()}.png`}
                        alt="nft"
                      />
                    </Box>
                    <Box className="box-body-sub">
                      <div className="box-body-sub--minion box--item">
                        <div className="name-and-type">
                          {item.minion && (
                            <Typography variant="caption">
                              {item.minion.level
                                .toLowerCase()
                                .replace("_", " ")}
                            </Typography>
                          )}
                        </div>
                        {item.minion ? (
                          <img
                            src={`${image_url}/body_${item.minion.name
                              .replace("-", "_")
                              .replace(" ", "_")
                              .toLowerCase()}.png`}
                            alt="nft"
                          />
                        ) : (
                          <img
                            src="/logo.png"
                            alt="logo"
                            style={{ opacity: 0.08 }}
                          />
                        )}
                      </div>
                      <div className="box-body-sub--skin box--item">
                        <div className="name-and-type">
                          {item.skin && (
                            <Typography variant="caption">
                              {item.skin.level.toLowerCase().replace("_", " ")}
                            </Typography>
                          )}
                        </div>
                        {item.skin ? (
                          <img
                            src={`${image_url}/body_${item.skin.name
                              .replace("-", "_")
                              .replace(" ", "_")
                              .toLowerCase()}.png`}
                            alt="nft"
                          />
                        ) : (
                          <img
                            src="/logo.png"
                            alt="logo"
                            style={{ opacity: 0.08 }}
                          />
                        )}
                      </div>
                    </Box>
                  </Box>
                  <Box className="box-info">
                    <div className="countdown custom-font">
                      <CountdownResearch
                        time={item.endTime}
                        onReload={(e) => setReload(e)}
                      />
                    </div>
                    <Divider className="mt-20 mb-20" />
                    <div className="parameters">
                      <div className="parameter">
                        <Typography
                          variant="body2"
                          className="label"
                          fontWeight={300}
                        >
                          Reward:
                        </Typography>
                        <Typography
                          variant="body2"
                          className="value"
                          fontWeight={300}
                        >
                          {formatUSD(item.estIncBalance)}
                          <span className="unit"> INC</span>
                        </Typography>
                      </div>
                      <PerformanceComponent item={item} />
                      <TimeComponent item={item} />
                      <div></div>
                    </div>
                  </Box>
                  <BoxItem>{item.id}</BoxItem>
                </Box>
              </Grid>
            ))}
        </Grid>
        {data && (
          <Pagination
            count={data.pageCount}
            variant="outlined"
            shape="rounded"
            onChange={(e, nextPage) => setPage(nextPage)}
            page={page}
          />
        )}
      </Container>
    </div>
  ) : (
    <Loader />
  );
};

export default RISpecialRooms;

const CountdownResearch = ({ time, onReload }) => {
  const [countdown, setCountdown] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const nowTime = moment();
      const countdown = time - nowTime.unix() * 1000;
      setCountdown(countdown);
    }, 1000);

    return () => clearInterval(interval);
  });
  useEffect(() => {
    if (countdown <= 0) {
      onReload(true);
    }
  }, [countdown, onReload]);

  function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return countdown >= 0 ? (
      <>
        <div className="box box-hours">{hours}</div>
        <div className="two-dots"></div>
        <div className="box box-minutes">{minutes}</div>
        <div className="two-dots"></div>
        <div className="box box-seconds">{seconds}</div>
      </>
    ) : (
      <>
        <div className="box box-hours">00</div>
        <div className="two-dots"></div>
        <div className="box box-minutes">00</div>
        <div className="two-dots"></div>
        <div className="box box-seconds">00</div>
      </>
    );
  }
  return <>{msToTime(countdown)}</>;
};

const PerformanceComponent = ({ item }) => {
  const minPerformance = item.angel?.properties.riPerformance[0];
  const maxPerformance = item.angel?.properties.riPerformance[1];
  const performanceBonus = item.skin
    ? item.skin.properties.riPerformanceBonus
    : 0;
  const minPerformanceBonus = (minPerformance * performanceBonus) / 100;
  const maxPerformanceBonus = (maxPerformance * performanceBonus) / 100;

  return (
    <div className="parameter">
      <Typography variant="body2" className="label" fontWeight={300}>
        Performance:
      </Typography>
      <Tooltip
        title={
          <Box>
            <Box display="flex" alignItems="center">
              <Typography variant="body2">Minimum: {minPerformance}</Typography>
              <Typography variant="body2" ml={0.2} mr={1}>
                {item.coin}
              </Typography>
              <Typography variant="caption" color="greenyellow">
                +{minPerformanceBonus} (+ {performanceBonus}%)
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="body2">Maximum: {maxPerformance}</Typography>
              <Typography variant="body2" ml={0.2} mr={1}>
                {item.coin}
              </Typography>
              <Typography variant="caption" color="greenyellow">
                +{maxPerformanceBonus} (+{performanceBonus}%)
              </Typography>
            </Box>
          </Box>
        }
        placement="right-start"
      >
        <Typography variant="body2" className="value" fontWeight={300}>
          {item.angel ? (
            <>
              {item.minPerformance} ~ {item.maxPerformance}
            </>
          ) : (
            "-/-"
          )}
          <span className="unit"> {item.coin}</span>
          {item.angel && <span className="unit"> per 10 mins</span>}
        </Typography>
      </Tooltip>
    </div>
  );
};

const TimeComponent = ({ item }) => {
  const riTime = item.angel.properties.riTime;
  const riTimeBonus = item.minion ? item.minion.properties.riTimeBonus : 0;
  const timeBonus = (riTime * riTimeBonus) / 100;

  return (
    <div className="parameter">
      <Typography variant="body2" className="label" fontWeight={300}>
        Research Time:
      </Typography>
      <Tooltip
        title={
          <Box display="flex" alignItems="center">
            <Typography variant="body2">Time: {riTime}</Typography>
            <Typography variant="body2" ml={0.2} mr={1}>
              mins
            </Typography>
            <Typography variant="caption" color="greenyellow">
              +{timeBonus} (+ {riTimeBonus}%)
            </Typography>
          </Box>
        }
      >
        <Typography variant="body2" className="value" fontWeight={300}>
          {item.time}
          <span className="unit"> mins</span>
        </Typography>
      </Tooltip>
    </div>
  );
};
