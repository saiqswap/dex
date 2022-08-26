import {
  Box,
  Button,
  Card,
  CardHeader,
  Hidden,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { image_url } from "../../settings";
import { BoxType } from "../../settings/constants";
import { formatAmount } from "../../settings/format";
import { _getMintingBoxList } from "../../store/actions/mintingActions";
import { post } from "../../utils/api";
import { formatNftName } from "../../utils/util";
import Loader from "../common/Loader";
import NewBoxMintingForm from "./NewBoxMintingForm";
import Title from "./Title";

const CustomContainer = styled(Box)(() => ({
  marginTop: 50,
}));
const CustomCard = styled(Card)(({ theme }) => ({
  height: "100%",
  width: "100%",
  minHeight: "50vh",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  padding: "2rem",
  position: "relative",
  backdropFilter: "blur(5px)",
  // zIndex: 99,
  [theme.breakpoints.down("sm")]: {
    padding: "0px 1rem 0px 0px",
  },
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
    padding: "20px",
  },
  "&:before": {
    content: '""',
    width: "2px",
    height: "100%",
    background: "var(--border-color)",
    position: "absolute",
    top: 0,
    left: "5.5rem",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
const CustomStep = styled(Stepper)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    marginLeft: "-1rem",
    "& .MuiStepContent-root": {
      position: "relative",
      paddingBottom: "2rem",
    },
  },
  "& .MuiStepConnector-root": {
    height: "100px",
    [theme.breakpoints.down("md")]: {
      width: "150vw",
      marginLeft: "-10vw",
      background: "var(--border-color)",
      height: "10px",
      marginBottom: "20px",
    },
  },
  "& .MuiStepLabel-iconContainer svg": {
    width: "50px",
    height: "50px",
    color: "var(--border-color)",
    position: "relative",
    zIndex: 100,
    border: "3px solid var(--border-color)",
    borderRadius: "100px",
    "& text": {
      fill: "var(--main-color)",
      fontWeight: "bold",
    },
  },
  "& .MuiStepConnector-line": {
    opacity: 0,
  },
  "& .MuiStepLabel-labelContainer": {
    paddingLeft: "1rem",
  },
  "& .MuiStepContent-root": {
    paddingLeft: "6rem",
    borderLeft: "none",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "0px",
    },
  },
  "& .MuiStepLabel-root": {
    [theme.breakpoints.down("md")]: {
      marginLeft: "0px",
    },
  },
  "& .MuiStepLabel-iconContainer": {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
const FieldLabel = styled(Typography)({
  width: 120,
});
const CustomButton = styled(Button)({
  padding: "0 30px",
  width: 200,
  textTransform: "uppercase",
});
const CustomStack = ({ children }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="flex-start"
    color="#fff"
    flexWrap={"wrap"}
  >
    {children}
  </Stack>
);
const CountdownStack = ({ children }) => (
  <Stack
    sx={{
      background: "rgba(255,255,255,0.1)",
      width: "60px",
      height: "60px",
      color: "#fff",
      borderRadius: "10px",
    }}
    justifyContent="center"
  >
    {children}
  </Stack>
);
const BoxItem = styled(Box)({
  background: "rgba(255,255,255,0.05)",
  borderRadius: "5px",
  whiteSpace: "nowrap",
  height: 50,
  width: 50,
  cursor: "pointer",
  display: "flex",
  textAlign: "center",
  img: {
    width: "100%",
    margin: "auto",
  },
});
const BoxTypeLabel = styled(Typography)({
  textTransform: "capitalize",
  fontWeight: 700,
});

const angels = ["Alice", "Ceci", "Dasha", "Emily", "Bestie"];

export default function MintingList() {
  const { setting, minting } = useSelector((state) => state);
  const { library } = setting;
  const { mintingBoxList } = minting;
  const [selectedRound, setSelectedRound] = useState(null);
  const [template, setTemplate] = useState(null);
  const [random] = useState(Math.floor(Math.random() * 5));

  useEffect(() => {
    const param = {
      page: 1,
      pageSize: 200,
      getMeta: false,
    };
    post(
      "/nft/templates",
      param,
      (result) => {
        setTemplate(result.items);
      },
      () => {}
    );
  }, []);

  const _handleSelectRound = (product) => {
    setSelectedRound(product);
  };

  const _handleRemoveSelectedRound = () => {
    setSelectedRound(null);
  };

  return mintingBoxList ? (
    <>
      <CustomContainer>
        <CustomCard>
          <CustomStep orientation="vertical">
            {mintingBoxList.map((product, index) => {
              return (
                <Step
                  key={index}
                  active={true}
                  className={index === mintingBoxList.length - 1 ? "end" : ""}
                >
                  <StepLabel sx={{ marginLeft: "2rem" }}>
                    <CardHeader
                      sx={{ padding: 0 }}
                      title={
                        <Title
                          variant="h5"
                          sx={{
                            textAlign: "left",
                            width: "fit-content",
                            fontWeight: 700,
                          }}
                        >
                          Minting NFT Box Round {product.roundNumber}
                        </Title>
                      }
                    />
                  </StepLabel>
                  <StepContent sx={{ width: "100%", maxWidth: "600px", mt: 1 }}>
                    <RoundDetail
                      product={product}
                      library={library}
                      _handleSelectRound={_handleSelectRound}
                    />
                  </StepContent>
                </Step>
              );
            })}
          </CustomStep>
        </CustomCard>
        <Hidden smDown>
          <img
            src={`${image_url}/artwork_${formatNftName(angels[random])}.png`}
            alt="thumbnail"
            className="animate__animated animate__fadeInRight"
            style={{
              position: "fixed",
              width: "50%",
              bottom: 0,
              right: 0,
              zIndex: 0,
              opacity: 0.6,
            }}
          />
        </Hidden>
      </CustomContainer>
      <NewBoxMintingForm
        data={selectedRound}
        template={template}
        onClose={_handleRemoveSelectedRound}
      />
    </>
  ) : (
    <Loader />
  );
}

const countDownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return "";
  } else {
    return (
      <Stack direction="row" spacing={1}>
        <CountdownStack>
          <Typography fontSize="1.5rem" textAlign="center">
            {days < 10 ? "0" : ""}
            {days}
          </Typography>
          <Typography fontSize="0.7rem" mt="-0.5rem" textAlign="center">
            days
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="1.5rem" textAlign="center">
            {hours < 10 ? "0" : ""}
            {hours}
          </Typography>
          <Typography fontSize="0.7rem" mt="-0.5rem" textAlign="center">
            hours
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="1.5rem" textAlign="center">
            {minutes < 10 ? "0" : ""}
            {minutes}
          </Typography>
          <Typography fontSize="0.7rem" mt="-0.5rem" textAlign="center">
            min
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="1.5rem" textAlign="center">
            {seconds < 10 ? "0" : ""}
            {seconds}
          </Typography>
          <Typography fontSize="0.7rem" mt="-0.5rem" textAlign="center">
            sec
          </Typography>
        </CountdownStack>
      </Stack>
    );
  }
};

const RoundDetail = ({ product, library, _handleSelectRound }) => {
  const now = moment().utc().unix() * 1000;
  const [selectedItem, setSelectedItem] = useState(product.items[0]);
  const itemInformation = BoxType[selectedItem.boxType];
  const start = product.items[0].startTime;
  const dispatch = useDispatch();

  const _getStatusProduct = (product) => {
    const { startTime, endTime, sold, totalSell } = product;
    const now = moment().utc().unix() * 1000;
    const start = startTime;
    const end = endTime;
    let status = "BUY_NOW";
    if (now - end > 0) {
      status = "END_TIME";
    }
    if (start - now > 0) {
      status = "COMING_SOON";
    }
    if (totalSell - sold <= 0) {
      status = "SOLD_OUT";
    }
    return status;
  };

  const status = _getStatusProduct(selectedItem);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        width="fit-content"
        mb={3}
      >
        {product.items.map((item, j) => {
          const information = BoxType[item.boxType];
          return (
            <BoxItem
              key={j}
              sx={{
                border: `1px solid ${
                  selectedItem.boxType === item.boxType
                    ? information.color
                    : "var(--main-color)"
                }`,
              }}
              p={1}
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={information.image}
                alt="box img"
                className="thumbnail"
              />
            </BoxItem>
          );
        })}
      </Stack>
      <CustomStack>
        <BoxTypeLabel
          className={
            "custom-font name " +
            (selectedItem.boxType.length > 12 ? "long-name" : "")
          }
          variant="h6"
          sx={{
            color: itemInformation.color,
          }}
        >
          {selectedItem.boxType.split("_").join(" ").toLowerCase()}{" "}
          {library.BOX}
        </BoxTypeLabel>
      </CustomStack>
      <CustomStack>
        <Typography sx={{ width: 120 }}>{library.TOTAL_SELL}:</Typography>
        <Typography> {formatAmount(selectedItem.supply)}</Typography>
      </CustomStack>
      <CustomStack>
        <FieldLabel>{library.PRICE}:</FieldLabel>
        <Typography>
          {formatAmount(selectedItem.unitPrice)} {selectedItem.paymentCurrency}
        </Typography>
      </CustomStack>
      <CustomStack>
        <FieldLabel>{library.TIME}:</FieldLabel>
        <Typography sx={{ color: "#fff" }}>
          {`${moment(selectedItem.startTime).format(
            "YYYY-MM-DD HH:mm"
          )} to ${moment(selectedItem.endTime).format("YYYY-MM-DD HH:mm")}`}
        </Typography>
        {status === "COMING_SOON" && (
          <Box
            sx={{
              transform: "scale(0.7)",
              width: "fit-content",
              marginLeft: "-2.5rem",
            }}
          >
            <Countdown
              date={Date.now() + (start - now)}
              renderer={(props) => countDownRenderer(props)}
              onComplete={() => dispatch(_getMintingBoxList())}
            />
          </Box>
        )}
      </CustomStack>
      <CustomStack>
        <FieldLabel>{library.CONDITION}:</FieldLabel>
        <Typography> {product.condition}</Typography>
      </CustomStack>
      <Stack>
        <CustomButton
          className="custom-btn custom-font"
          sx={{ mt: 5 }}
          onClick={() => _handleSelectRound(selectedItem)}
          disabled={status === "SOLD_OUT" || status === "END_TIME"}
        >
          {library[status]}
        </CustomButton>
      </Stack>
    </>
  );
};
