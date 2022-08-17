import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { image_url } from "../../settings";
import {
  BoxType,
  tierAngelDescription,
  tierCostumeDescription,
  tierMinionPartDescription,
} from "../../settings/constants";
import { formatAmount } from "../../settings/format";
import { formatNftName } from "../../utils/util";
import GeneralPopup from "../common/GeneralPopup";

const BoxItem = ({ data, _handlePurchaseBox, loading, template }) => {
  const [open, setOpen] = useState(false);
  const { user, setting } = useSelector((state) => state);
  const { information } = user;
  const { config } = setting;
  const [type, setType] = useState(null);

  const purchaseToken = config
    ? config.contracts.find((e) => e.contractAddress === data.paymentContract)
    : {};

  const handleConfirm = (type) => {
    if (type.includes("MINION_PARTS")) {
      setType("MINION_PARTS");
    } else {
      setType(type.split("_")[0]);
    }
    setOpen(true);
  };

  const handleBuyBox = () => {
    _handlePurchaseBox(data);
  };

  if (!data) return null;
  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <div
          className="box-card"
          style={{ borderColor: BoxType[data.type].color }}
        >
          <img src={BoxType[data.type].card} className="card" alt="" />
          <div className="base-light">
            <img src={BoxType[data.type].light} alt="base-light" width="100%" />
          </div>
          <div className="base-light delay">
            <img src={BoxType[data.type].light} alt="base-light" width="100%" />
          </div>
          <div className="content">
            {BoxType[data.type] ? (
              <img
                src={BoxType[data.type].image}
                alt="box img"
                className="thumbnail"
              />
            ) : null}

            <Typography
              variant="h6"
              fontWeight={700}
              className={
                "custom-font name " + (data.type.length > 12 ? "long-name" : "")
              }
              style={{ color: BoxType[data.type].color }}
            >
              {data.type.split("_").join(" ").toLowerCase()} Box
            </Typography>

            <Typography variant="body2" className="price">
              Price: {formatAmount(data.price)}{" "}
              <span>{purchaseToken.symbol}</span>
            </Typography>
            <Typography variant="body2" className="amount">
              <span>Available:</span>
              {/* Avail: */}
              <span style={{ marginLeft: 5 }}>{data.available}</span>
            </Typography>
            <div
              className={"buy-box " + (data.available > 0 ? "" : "disabled")}
            >
              <Button
                onClick={() => handleConfirm(data.type)}
                className="custom-font"
                style={{ background: BoxType[data.type].color }}
              >
                {!loading && "Buy"}
              </Button>
            </div>
          </div>
        </div>
      </Grid>

      <ConfirmPopup
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        data={data}
        onSubmit={() =>
          information ? handleBuyBox(data) : toast.error("Please login...!")
        }
        loading={loading}
        template={template}
        type={type}
      />
    </>
  );
};

export default BoxItem;

const ConfirmPopup = ({
  open,
  onClose,
  data,
  onSubmit,
  loading,
  template,
  type,
}) => {
  const [available, setAvailable] = useState(null);
  const { setting } = useSelector((state) => state);
  const { config } = setting;

  const purchaseToken = config
    ? config.contracts.find((e) => e.contractAddress === data.paymentContract)
    : {};

  useEffect(() => {
    if (type && template) {
      let data;
      data = template.filter(
        (x) => x.type.toLowerCase() === type.toLowerCase()
      );
      data.sort((a, b) =>
        a.level.toLowerCase().localeCompare(b.level.toLowerCase())
      );
      setAvailable(data);
    }
  }, [type, template]);

  return (
    <GeneralPopup open={open}>
      <IconButton
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
        style={{
          minWidth: "fit-content",
          marginTop: 0,
        }}
        size="small"
        onClick={onClose}
      >
        <Close fontSize="small" />
      </IconButton>
      <Box mt={3} />
      <Grid container>
        <Grid item xs={12} md={5} className="submit-box">
          <div className="box-image">
            <img src={BoxType[data.type].image} alt="boxImg" />
          </div>
          <Typography className="price">
            {formatAmount(data.price)} {purchaseToken.symbol}
          </Typography>
          <LoadingButton
            loading={loading}
            className="submit custom-font"
            onClick={() => onSubmit()}
            style={{ width: "190px" }}
          >
            {!loading && "PURCHASE"}
          </LoadingButton>
        </Grid>
        <Grid item xs={12} md={7} className="box-info">
          <div className="drop-rate ">
            <div className="box-info">
              <DropRate data={data} />
            </div>
            {/* <Typography className="custom-font" textAlign={"left"}>
              Drop Rate Detail
            </Typography>
            <ul>
              {BoxType[data.type].rate.map((item, index) => (
                <li key={index}>
                  <Typography>
                    <span
                      className="custom-font mr-10"
                      style={{
                        fontSize: data.type.includes("COSTUME")
                          ? "0.7rem"
                          : "0.8rem",
                        width: data.type.includes("COSTUME") ? "75px" : "65px",
                        display: "inline-block",
                      }}
                    >
                      {item.name}:
                    </span>
                    <span>{item.rate}%</span>
                  </Typography>
                </li>
              ))}
            </ul> */}
          </div>
          <div className="items">
            <Typography
              className="custom-font"
              textAlign={"left"}
              mt={2}
              mb={1}
            >
              Available:{" "}
              {available && (
                <span>{`${available.length} ${
                  available[0]
                    ? available[0].type.toLowerCase().replace("_", " ")
                    : ""
                }${
                  available[0]?.type.toLowerCase() === "angel" ? "s" : ""
                }`}</span>
              )}
            </Typography>
            {available ? (
              <ul>
                {available.map((item, index) => (
                  <Tooltip
                    key={index}
                    title={
                      <div
                        style={{
                          padding: "5px 20px",
                          fontSize: "1rem",
                        }}
                      >
                        {`${item.name} ${item.level.replace("_", " ")}`}
                      </div>
                    }
                    placement="top"
                    arrow
                  >
                    <li className={item.level.toLowerCase()}>
                      <span className="custom-font">
                        {item.level.replace("_", " ")}
                      </span>
                      <img
                        src={`${image_url}/${
                          item.type === "ANGEL"
                            ? `avatar_${formatNftName(item.name)}`
                            : `body_${formatNftName(item.name)}`
                        }.png`}
                        alt=""
                      />
                    </li>
                  </Tooltip>
                ))}
              </ul>
            ) : (
              <ul style={{ justifyContent: "center", opacity: 0.2 }}>
                <CircularProgress />
              </ul>
            )}
          </div>
        </Grid>
      </Grid>
    </GeneralPopup>
  );
};

const DropRateDetail = styled(Box)(() => ({
  background: "rgba(0, 0, 0, 0.4)",
  padding: "20px",
  borderRadius: "5px",
  marginTop: "0px",
  textAlign: "left",
}));

const DropRate = ({ data }) => {
  let tierDescriptions = tierAngelDescription;
  let indexTierDescription = 0;
  if (data) {
    if (data.type.includes("MINION")) {
      tierDescriptions = tierMinionPartDescription;
      indexTierDescription = 2;
    }
    if (data.type.includes("COSTUME")) {
      tierDescriptions = tierCostumeDescription;
      indexTierDescription = 1;
    }
  }
  return (
    <>
      <Typography className="custom-font" textAlign={"left"} mb={1}>
        Drop Rate Detail
      </Typography>
      <DropRateDetail>
        {BoxType[data.type].rate.map((item, index) => (
          <Box key={index}>
            <Typography>
              <span
                className="custom-font mr-10"
                style={{
                  fontSize: data.type.includes("COSTUME") ? "0.7rem" : "0.8rem",
                  width: data.type.includes("COSTUME") ? "75px" : "65px",
                  display: "inline-block",
                }}
              >
                {item.name}:
              </span>
              <span style={{ fontSize: "1rem" }}>{item.rate}%</span>
            </Typography>
            <small>
              {tierDescriptions[index + indexTierDescription].split(":")[1]}
            </small>
          </Box>
        ))}
      </DropRateDetail>
    </>
  );
};
