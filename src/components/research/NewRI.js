import { Add, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Hidden,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { image_url } from "../../settings";
import { EndpointConstant } from "../../settings/endpoint";
import { _getNFTImageLink } from "../../settings/format";
import { _getMyItems } from "../../store/actions/userActions";
import { post } from "../../utils/api";
import { formatNftName } from "../../utils/util";
import Loader from "../common/Loader";

const inventory = [
  {
    label: "Costume",
    key: "costume",
    boxType: "sub",
    screen: { xs: 12, sm: 12, md: 3 },
  },
  {
    label: "Angel",
    key: "angel",
    boxType: "main",
    screen: { xs: 12, sm: 12, md: 4 },
  },
  {
    label: "Minion Parts",
    key: "minion_parts",
    boxType: "sub",
    screen: { xs: 12, sm: 12, md: 3 },
  },
];

const EndTimeCountdown = ({ endTime }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    function update() {
      const now = moment().utc().unix() * 1000;
      const time = endTime - now;
      setTime(time);
    }
    update();
    const timer = setInterval(() => {
      update();
    }, 100);
    return () => clearInterval(timer);
  });

  var sec_num = parseInt(time / 1000, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
};

const NewRI = () => {
  const history = useHistory();
  const [data, setData] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({ type: "", data: [] });
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false);
  const [statusGetData, setStatusGetData] = useState(false);
  const [angel, setAngel] = useState(null);
  const [skin, setSkin] = useState(null);
  const [minion, setMinion] = useState(null);
  const [reload, setReload] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mount, setMount] = useState(true);
  let params = { angel: angel, costume: skin, minion_parts: minion };
  const nowTime = moment().unix() * 1000;
  const { user, riStore } = useSelector((state) => state);
  const { myItems } = user;
  const { endTimeServer } = riStore;
  const dispatch = useDispatch();

  // let timeout;
  useEffect(() => {
    if (myItems) {
      setData(myItems);
    }
  }, [myItems]);

  useEffect(() => {
    if (openPopup) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [openPopup]);

  const handleResearching = () => {
    setActive(true);
    setConfirm(false);
    setLoading(true);

    let body = {
      angelId: params.angel ? params.angel.tokenId : null,
      minionId: params.minion_parts ? params.minion_parts.tokenId : null,
      skinId: params.costume ? params.costume.tokenId : null,
    };

    Object.keys(body).forEach((k) => body[k] === null && delete body[k]);

    post(
      EndpointConstant.NFT_RI,
      body,
      () => {
        // toast.success("Great! You joined Research");
        setLoading(false);
        setReload(!reload);
        handleCloseConfirmPopup();
        setStatusGetData(true);
        setSuccess(true);
        dispatch(_getMyItems());
      },
      (err) => {
        toast.error(err.msg);
        setLoading(false);
        setReload(!reload);
        handleCloseConfirmPopup();
      }
    );
  };

  useEffect(() => {
    if (success && mount) {
      let timeout = setTimeout(() => {
        setSuccess(false);
        toast.success("Great! You joined Research");
        history.push("/research-institute/slot");
      }, 24000);
      return () => {
        clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);
  useEffect(() => {
    return () => {
      setMount(false);
      // clearTimeout(timeout);
    };
  }, [mount]);

  const handleClick = (type) => {
    if (type === "angel") {
      _handleDataFilter(type);
      setOpenPopup(true);
    } else {
      if (params.angel) {
        _handleDataFilter(type);
        setOpenPopup(true);
      } else {
        toast.error("Please choose an Angel...!");
      }
    }
  };

  const _handleDataFilter = (type) => {
    let filteredData = data.filter((e) => {
      return (
        e.type.toLowerCase() === type && e.status.toLowerCase() !== "listing"
      );
    });
    filteredData.sort((a, b) => a.level.localeCompare(b.level));
    if (filteredData) {
      setSelected({
        type: type,
        data: filteredData,
      });
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelected({ type: "", data: [] });
  };

  const handleCloseConfirmPopup = () => {
    setOpenPopupConfirm(false);
    setAngel(null);
    setSkin(null);
    setMinion(null);
    setActive(true);
    setConfirm(false);
    setStatusGetData(false);
  };

  const handleAddNFT = (data) => {
    const { type } = selected;
    if (type === "angel") {
      setAngel(data);
    }
    if (type === "costume") {
      setSkin(data);
    }
    if (type === "minion_parts") {
      setMinion(data);
    }
    setOpenPopup(false);
  };

  const handleRemoveNFT = (type) => {
    if (type === "angel") {
      setAngel(null);
      setSkin(null);
      setMinion(null);
    }
    if (type === "costume") {
      setSkin(null);
    }
    if (type === "minion_parts") {
      setMinion(null);
    }
  };

  const riPerformanceBonus = skin ? skin.properties.riPerformanceBonus : 0;
  const minPerformanceBonus =
    angel && skin
      ? (angel.properties.riPerformance[0] * riPerformanceBonus) / 100
      : 0;
  const maxPerformanceBonus =
    angel && skin
      ? (angel.properties.riPerformance[1] * riPerformanceBonus) / 100
      : 0;
  const riTimeBonusPercent = minion ? minion.properties.riTimeBonus : 0;
  const riTime = angel
    ? (angel.properties.riTime * riTimeBonusPercent) / 100
    : 0;

  // console.log(moment().utc().format(""));

  return (
    <div className="new-ri">
      {success && (
        <div className="ri-video">
          <video
            src={`${image_url}/ri-intro.mp4`}
            autoPlay={true}
            muted={true}
          />
          <Button
            className="btn-skip"
            onClick={() => {
              setSuccess(false);
              toast.success("Great! You joined Research");
              history.push("/research-institute/slot");
            }}
          >
            Skip
          </Button>
        </div>
      )}

      {data ? (
        <>
          <Container maxWidth="md">
            <Grid
              container
              spacing={3}
              className={`inventory-boxes`}
              alignItems="center"
              justifyContent="center"
            >
              {statusGetData ? (
                <>
                  <Loader />
                </>
              ) : (
                <>
                  {inventory.map((item, index) => (
                    <Grid
                      item
                      xs={item.screen.xs}
                      sm={item.screen.sm}
                      md={item.screen.md}
                      key={index}
                      className={`area-${item.key}`}
                    >
                      {params[item.key] && (
                        <IconButton
                          className="btn-close"
                          onClick={() => handleRemoveNFT(item.key)}
                        >
                          <Close />
                        </IconButton>
                      )}
                      <div
                        className={`inventory-box inventory-box--${
                          item.boxType
                        } 
                ${!data && "disable"} `}
                        onClick={() => {
                          data && handleClick(item.key);
                        }}
                      >
                        <div className="content">
                          {!params[item.key] && (
                            <>
                              <div className="box-name">
                                <Typography
                                  variant="body1"
                                  className="custom-font"
                                >
                                  {item.label}
                                </Typography>
                              </div>
                              {statusGetData ? <CircularProgress /> : <Add />}
                            </>
                          )}
                          {params[item.key] ? (
                            <img
                              className={`custom-img ${
                                item.key === "angel" && "angel"
                              }`}
                              src={`${image_url}/body_${formatNftName(
                                params[item.key].name
                              )}.png`}
                              // src={_getNFTImageLink(
                              //   params[item.key].type,
                              //   params[item.key].name,
                              //   params[item.key].level
                              // )}
                              alt="nft"
                            />
                          ) : null}
                        </div>
                        <div className="line"></div>
                        <div
                          className={`bg-type-nft ${
                            params[item.key] &&
                            params[item.key].level.toLowerCase()
                          }`}
                        ></div>
                      </div>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
            <Grid container justifyContent="center">
              <Grid item xs={12} className="information-form">
                {!params.angel && (
                  <Hidden mdDown>
                    <div className="slogan" id="mess">
                      <p>Automated research system ready!</p>
                    </div>
                  </Hidden>
                )}
                <div>
                  <Typography variant="body1" className="custom-font">
                    Performance:
                  </Typography>
                  <Typography variant="body1">
                    {angel ? (
                      <span className="value-1">
                        {params.angel.properties.riPerformance[0] +
                          minPerformanceBonus}{" "}
                        <span
                          style={{
                            color: "greenyellow",
                            opacity: 0.7,
                          }}
                        >
                          +{minPerformanceBonus}
                        </span>
                        <span> ~ </span>
                        {params.angel.properties.riPerformance[1] +
                          minPerformanceBonus}{" "}
                        <span
                          style={{
                            color: "greenyellow",
                            opacity: 0.7,
                          }}
                        >
                          +{maxPerformanceBonus}
                        </span>
                      </span>
                    ) : (
                      "-/-"
                    )}
                    {params.angel && ` INC`}
                    {params.costume && params.angel && (
                      <span className="value-2">
                        {" "}
                        (+{riPerformanceBonus}% costume bonus)
                      </span>
                    )}
                    {params.angel && ` per 10 mins`}
                  </Typography>
                </div>
                <div className="mt-10">
                  <Typography variant="body1" className="custom-font">
                    Research Time:
                  </Typography>
                  <Typography variant="body1" display="inline-block">
                    {params.angel ? (
                      <span className="value-1">
                        {params.angel.properties.riTime + riTime}{" "}
                        <span
                          style={{
                            color: "greenyellow",
                            opacity: 0.7,
                          }}
                        >
                          +{riTime}
                        </span>{" "}
                        mins
                      </span>
                    ) : (
                      "-/-"
                    )}
                    {params.minion_parts && params.angel && (
                      <span className="value-3">
                        {" "}
                        (+{params.minion_parts.properties.riTimeBonus}% minion
                        parts bonus)
                      </span>
                    )}
                  </Typography>
                </div>
                <Divider className="mt-20" />
                {params.angel && (
                  <div className="mt-20">
                    <div
                      className="btn-start custom-font"
                      onClick={() => {
                        setOpenPopupConfirm(true);
                      }}
                    >
                      Start
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
          </Container>

          <Modal sx={style} open={openPopupConfirm}>
            <Box className="custom-modal-confirm">
              <Grid container justifyContent="center">
                <Grid item xs={12} className="information-form">
                  <div>
                    <Typography variant="body1" className="custom-font">
                      Performance:
                    </Typography>
                    <Typography variant="caption">
                      {angel ? (
                        <span className="value-1">
                          {params.angel.properties.riPerformance[0] +
                            minPerformanceBonus}{" "}
                          <span
                            style={{
                              color: "greenyellow",
                              opacity: 0.7,
                            }}
                          >
                            +{minPerformanceBonus}
                          </span>
                          <span> ~ </span>
                          {params.angel.properties.riPerformance[1] +
                            minPerformanceBonus}{" "}
                          <span
                            style={{
                              color: "greenyellow",
                              opacity: 0.7,
                            }}
                          >
                            +{maxPerformanceBonus}
                          </span>
                        </span>
                      ) : (
                        "-/-"
                      )}
                      {params.angel && ` INC`}
                      {params.costume && params.angel && (
                        <span className="value-2">
                          {" "}
                          (+{riPerformanceBonus}% costume bonus)
                        </span>
                      )}
                      {params.angel && ` per 10 mins`}
                    </Typography>
                  </div>
                  <div className="mt-10">
                    <Typography variant="body1" className="custom-font">
                      Research Time:
                    </Typography>
                    <Typography variant="caption">
                      {params.angel ? (
                        <span className="value-1">
                          {params.angel.properties.riTime + riTime}{" "}
                          <span
                            style={{
                              color: "greenyellow",
                              opacity: 0.7,
                            }}
                          >
                            +{riTime}
                          </span>{" "}
                          mins
                        </span>
                      ) : (
                        "-/-"
                      )}
                      {params.minion_parts && params.angel && (
                        <span className="value-3">
                          {" "}
                          (+{params.minion_parts.properties.riTimeBonus}% minion
                          parts bonus)
                        </span>
                      )}
                    </Typography>
                  </div>
                  <Divider className="mt-10 " />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label={
                      <Typography
                        style={{
                          color: `${active ? "#ffffffcc" : "#FF6464"}`,
                          fontSize: 12,
                        }}
                      >
                        i agree to the{" "}
                        <a
                          href="/docs/Privacy_Policy_Research_Institute_R-I.pdf"
                          target="_blank"
                          style={{
                            color: "#2FA4FF",
                            textDecoration: "underline",
                          }}
                        >
                          privacy policy
                        </a>{" "}
                        of the InfinityAngel.
                      </Typography>
                    }
                    onChange={(e) => {
                      setActive(e.target.checked);
                      setConfirm(e.target.checked);
                    }}
                    labelPlacement="end"
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <div
                      className="btn-close custom-font"
                      style={{ background: "transparent" }}
                      onClick={handleCloseConfirmPopup}
                    >
                      Cancel
                    </div>
                    <div
                      className="btn-start custom-font"
                      onClick={() => {
                        confirm ? handleResearching() : setActive(false);
                      }}
                    >
                      {loading ? (
                        <CircularProgress style={{ width: 20, height: 20 }} />
                      ) : (
                        "Start"
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          {/* character selected popup */}
          <Modal sx={style} open={openPopup}>
            <Box className="custom-modal">
              <Box className="custom-modal-head character-selected-popup-head">
                <Typography variant="h5" className="custom-font">
                  Select {selected.type.toUpperCase().replace("_", " ")}
                </Typography>
                <IconButton className="btn-icon-txt" onClick={handleClosePopup}>
                  <Close />
                </IconButton>
              </Box>
              <Divider />
              <Box className="custom-modal-body character-selected-popup-body">
                <Grid container spacing={1} className="nft-popup">
                  {selected.data &&
                    selected.data.map((item, index) => (
                      <Grid
                        item
                        xs={4}
                        sm={3}
                        md={2}
                        key={index}
                        className={`nft-item ${
                          moment(nowTime).format("L") ===
                            moment(item.lastResearch).format("L") &&
                          "disabled-card"
                        } ${
                          (item.type.toLowerCase() === "minion_parts" ||
                            item.type.toLowerCase() === "costume") &&
                          item.status.toLowerCase() === "in_researching" &&
                          "disabled-card"
                        }`}
                      >
                        <div
                          className={item.level.toLowerCase()}
                          onClick={() => handleAddNFT(item)}
                        >
                          <img
                            className="custom-img"
                            // src={`${image_url}/body_${formatNftName(
                            //   item.name
                            // )}.png`}
                            src={_getNFTImageLink(
                              item.type,
                              item.name,
                              item.level
                            )}
                            alt="nft"
                          />
                          <span className="nft-name">{item.name}</span>

                          <div className="nft-status">
                            <Typography variant="body1">
                              {item.status === "IN_RESEARCHING" &&
                                "R - I in progress"}
                              {item.status === "ACTIVE" &&
                                moment(nowTime).format("L") ===
                                  moment(item.lastResearch).format("L") && (
                                  <>
                                    You can R-I after{" "}
                                    <EndTimeCountdown endTime={endTimeServer} />
                                  </>
                                )}
                            </Typography>
                          </div>
                        </div>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Box>
          </Modal>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default NewRI;

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
