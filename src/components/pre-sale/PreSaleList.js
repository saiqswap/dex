import {
  Box,
  CardHeader,
  Grid,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PRE_SALE_TOKEN } from "../../settings/constants";
import { formatNumberWithDecimal } from "../../settings/format";
import { _getMintingBoxList } from "../../store/actions/mintingActions";
import Title from "../box-minting/Title";
import Loader from "../common/Loader";
import ListingAds from "./ListingAds";
import {
  CountdownStack,
  CustomButton,
  CustomCard,
  CustomContainer,
  CustomStack,
  CustomStep,
  FieldLabel,
} from "./PresaleStyles";
import PrivateRound from "./PrivateRound";

export default function PreSaleList() {
  const { setting, preSale } = useSelector((state) => state);
  const { library } = setting;
  const history = useHistory();
  const { preSaleRoundList } = preSale;

  const _handleSelectRound = (product) => {
    history.push(`/pre-sale/${product + 1}`);
  };

  return preSaleRoundList ? (
    <>
      <CustomContainer>
        <CustomCard>
          <CustomStep orientation="vertical">
            {preSaleRoundList.map((item, index) => {
              return (
                <Step key={index} active={true}>
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
                          {item.name}
                        </Title>
                      }
                    />
                  </StepLabel>
                  <StepContent sx={{ width: "100%", mt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={7}>
                        <RoundDetail
                          data={item}
                          library={library}
                          _handleSelectRound={() => _handleSelectRound(index)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={5}>
                        {index + 1 === preSaleRoundList.length && (
                          <ListingAds />
                        )}
                      </Grid>
                    </Grid>
                  </StepContent>
                </Step>
              );
            })}
          </CustomStep>
        </CustomCard>
      </CustomContainer>
      <PrivateRound />
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

const RoundDetail = ({ data, library, _handleSelectRound }) => {
  const now = moment().utc().unix() * 1000;
  const start = data.startAt * 1000;
  const dispatch = useDispatch();

  const _getStatusProduct = (product) => {
    const { startAt, endAt, currentSold, totalSupply } = product;
    const start = startAt * 1000;
    const end = endAt * 1000;
    let status = "BUY_NOW";
    if (start - now > 0) {
      status = "COMING_SOON";
    }
    if (now - end > 0) {
      status = "END_TIME";
    }
    let tempMinimum = (1 / parseFloat(data.USDPrice)) * data.minUSD;
    if (totalSupply - currentSold <= tempMinimum || product.isStaticEnd) {
      status = "SOLD_OUT";
    }
    return status;
  };

  const status = _getStatusProduct(data);

  return (
    <>
      <CustomStack>
        <Typography sx={{ width: 120 }}>{library.TOTAL_SELL}:</Typography>
        <Typography>
          {formatNumberWithDecimal(data.totalSupply, 2)} {PRE_SALE_TOKEN}
        </Typography>
      </CustomStack>
      <CustomStack>
        <FieldLabel>{library.PRICE}:</FieldLabel>
        <Typography>
          {`${formatNumberWithDecimal(data.USDPrice)} USDT `}{" "}
          {data.nativeTokenPrice
            ? `| ${formatNumberWithDecimal(data.nativeTokenPrice)} BNB`
            : null}
        </Typography>
      </CustomStack>
      <CustomStack>
        <FieldLabel>{library.CONDITION}:</FieldLabel>
        {data.minUSD ? (
          <Typography>
            Buy minimum {formatNumberWithDecimal(data.minUSD, 2)} USDT
          </Typography>
        ) : null}
      </CustomStack>
      <CustomStack>
        <FieldLabel>{library.TIME}:</FieldLabel>
        <Typography sx={{ color: "#fff" }}>
          {`${moment(data.startAt * 1000).format(
            "YYYY-MM-DD HH:mm"
          )} ~ ${moment(data.endAt * 1000).format("YYYY-MM-DD HH:mm zZ")}`}
        </Typography>
      </CustomStack>
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
      <Stack>
        <CustomButton
          className="custom-btn custom-font"
          sx={{ mt: 3 }}
          onClick={() => _handleSelectRound(data)}
          disabled={status === "SOLD_OUT" || status === "END_TIME"}
        >
          {library[status]}
        </CustomButton>
      </Stack>
    </>
  );
};
