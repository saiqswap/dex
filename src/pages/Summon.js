import {
  CircularProgress,
  Container,
  Grid,
  Hidden,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SummonEffect from "../components/summon/SummonEffect";
import { BoxType } from "../settings/constants";
import { _getMyItems } from "../store/actions/userActions";
import "../styles/summon-page.scss";
import { get, post } from "../utils/api";
import { objToArray } from "../utils/util";
import Loader from "./../components/common/Loader";

const Summon = () => {
  const [openBox, setOpenBox] = useState(false);
  const [boxes, setBoxes] = useState(null);
  const [boxesSelected, setBoxesSelected] = useState([]);
  const [keySelected, setKeySelected] = useState("");
  const [opening, setOpening] = useState(false);
  const [item, setItem] = useState(null);
  const [completed, setCompleted] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [scale, setScale] = useState(1);
  const [showList] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    get(`/nft/my-boxes`, (data) => {
      if (mounted) {
        var result = data.reduce(function (r, a) {
          r[a.type] = r[a.type] || [];
          r[a.type].push(a);
          return r;
        }, Object.create(null));
        setBoxes(result);
      }
    });
    return () => setMounted(false);
  }, [mounted]);

  const handleOpenBox = () => {
    setOpenBox(false);
    setTimeout(() => {
      setOpenBox(true);
    }, 100);
  };

  const _handleOpenBox = () => {
    const box = boxesSelected[0];
    if (box) {
      setOpening(true);
      setCompleted(false);
      post(
        `/nft/open-box?boxTokenId=${box.tokenId}`,
        {},
        (data) => {
          // get(`/nft/my-boxes`, (data) => setBoxes(data));
          setItem(data);
          setBoxesSelected(
            boxesSelected.filter((item) => item.tokenId !== box.tokenId)
          );
          var output = boxes;
          output[box.type] = output[box.type].filter(
            (item) => item.tokenId !== box.tokenId
          );
          handleOpenBox();
          setBoxes(output);
          setOpening(false);
          setShowInfo(true);
          dispatch(_getMyItems());
          setTimeout(() => {
            setCompleted(true);
          }, 7000);
        },
        (error) => {
          setCompleted(true);
        }
      );
    }
  };

  const _handleSelectBox = (key) => {
    console.log(keySelected);
    setKeySelected(null);
    setTimeout(() => {
      setBoxesSelected(boxes && boxes[key] ? boxes[key] : []);
      setKeySelected(key);
    }, 10);
  };

  useEffect(() => {
    var x = window.innerWidth < 600 ? window.innerWidth / 800 : 1;
    setScale(x < 0.5 ? 0.5 : x);
    window.addEventListener("resize", () => {
      x = window.innerWidth < 600 ? window.innerWidth / 800 : 1;
      setScale(x < 0.5 ? 0.5 : x);
    });
    return () => {
      window.removeEventListener("resize", null);
    };
  }, []);

  if (!boxes) {
    return <Loader />;
  }

  return (
    <div
      className="summon"
      style={{
        minHeight: "100vh",
      }}
    >
      <Container
        className="summon-page"
        style={{ pointerEvents: !completed ? "none" : "" }}
      >
        <div className="box-banner"></div>
        <Grid container>
          <Hidden mdDown>
            <Grid
              item
              xs={12}
              md={5}
              lg={6}
              className={`box-list ${showList ? "" : "hide"}`}
            >
              <Grid container spacing={3}>
                {objToArray(BoxType).map((item, index) => (
                  <Grid item xs={12} md={6} lg={6} key={index}>
                    <div
                      className={`box-card ${
                        keySelected === item.value ? "active" : ""
                      }`}
                      style={{ borderColor: item.color }}
                      onClick={() => {
                        setShowInfo(false);
                        _handleSelectBox(item.value);
                      }}
                    >
                      <img src={item.card} className="card" alt="" />
                      <div className="base-light">
                        <img src={item.light} alt="base-light" width="100%" />
                      </div>
                      <div className="base-light delay">
                        <img src={item.light} alt="base-light" width="100%" />
                      </div>
                      <div className="content">
                        {item ? (
                          <img
                            src={item.image}
                            alt="box img"
                            className="thumbnail"
                          />
                        ) : null}

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          className={
                            "custom-font name summon " +
                            (item.value.length > 12 ? "long-name" : "")
                          }
                          style={{ color: item.color }}
                        >
                          {item.value.split("_").join(" ").toLowerCase()} Box
                        </Typography>
                        <Typography variant="body2" className="amount">
                          Amount:{" "}
                          <span style={{ marginLeft: 5 }}>
                            {boxes && boxes[item.value]
                              ? boxes[item.value].length
                              : 0}
                          </span>
                        </Typography>
                      </div>
                    </div>
                    {/* <div
                      key={index}
                      className={
                        "box-item " +
                        (keySelected === item.value ? "active" : "")
                      }
                      onClick={() => _handleSelectBox(item.value)}
                    >
                      <div
                        className="content"
                        style={{ "--color": item.color }}
                      >
                        <img
                          src={item.card}
                          className="card"
                          alt="images card"
                        />
                        <img src={item.image} className="img-box" alt="" />
                        <div className="base-light">
                          <img
                            src={item.light}
                            alt="base-light"
                            width="100%"
                          />
                        </div>
                        <div className="base-light delay">
                          <img
                            src={item.light}
                            alt="base-light"
                            width="100%"
                          />
                        </div>
                        <div className="info">
                          <Typography
                            variant="body2"
                            className="custom-font box-name"
                            style={{ color: item.color }}
                          >
                            {item.value.split("_").join(" ").toLowerCase()} Box
                          </Typography>
                          <Typography variant="body2" className="available">
                            <span>Avl:</span>
                            <span>
                              x
                              {boxes && boxes[item.value]
                                ? boxes[item.value].length
                                : 0}
                            </span>
                          </Typography>
                        </div>
                      </div>
                      <div className="light-2"></div>
                    </div> */}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Hidden>
          <Grid
            item
            xs={12}
            md={7}
            lg={6}
            className="summon-content"
            style={{ transform: `scale(${scale})` }}
          >
            <SummonEffect
              open={openBox}
              data={item}
              boxImage={BoxType[keySelected]}
              showInfo={showInfo}
            />
            {
              <div
                className={
                  "btn-summon custom-font " +
                  (boxesSelected.length > 0 ? "" : "disabled")
                }
                onClick={() => {
                  _handleOpenBox();
                }}
              >
                {!opening ? (
                  "Summon"
                ) : (
                  <CircularProgress style={{ width: "25px", height: "25px" }} />
                )}
              </div>
            }
          </Grid>
          <Hidden mdUp>
            <Grid item xs={12}>
              <Box
                mt="150px"
                sx={{ zIndex: 1 }}
                display="inline-flex"
                overflow={"auto"}
                width="100%"
              >
                {objToArray(BoxType).map((item, index) => (
                  <Box minWidth={170} mr={1} key={index}>
                    <div
                      className={`box-card ${
                        keySelected === item.value ? "active" : ""
                      }`}
                      style={{ borderColor: item.color }}
                      onClick={() => {
                        setShowInfo(false);
                        _handleSelectBox(item.value);
                      }}
                    >
                      <img src={item.card} className="card" alt="" />
                      <div className="base-light">
                        <img src={item.light} alt="base-light" width="100%" />
                      </div>
                      <div className="base-light delay">
                        <img src={item.light} alt="base-light" width="100%" />
                      </div>
                      <div className="content">
                        {item ? (
                          <img
                            src={item.image}
                            alt="box img"
                            className="thumbnail"
                          />
                        ) : null}

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          className={
                            "custom-font name summon " +
                            (item.value.length > 12 ? "long-name" : "")
                          }
                          style={{ color: item.color }}
                        >
                          {item.value.split("_").join(" ").toLowerCase()} Box
                        </Typography>
                        <Typography variant="body2" className="amount">
                          Amount:{" "}
                          <span style={{ marginLeft: 5 }}>
                            {boxes && boxes[item.value]
                              ? boxes[item.value].length
                              : 0}
                          </span>
                        </Typography>
                      </div>
                    </div>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </div>
  );
};

export default Summon;
