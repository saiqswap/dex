import { Box, Divider, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { BoxType } from "../../settings/constants";
import { formatAmount } from "../../settings/format";
import {
  BoxItem,
  BoxTypeLabel,
  countDownRenderer,
  CustomButton,
  CustomStack,
  FieldLabel,
  PriceBox,
} from "./MintingStyles";
import NewBoxMintingForm from "./NewBoxMintingForm";

export default function RoundBoxDetail({ round }) {
  const [boxes, setBoxes] = useState(null);
  const [selectedBoxType, setSelectedBoxType] = useState("ANGEL");
  const [selectedBox, setSelectedBox] = useState(null);
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  useEffect(() => {
    if (round) {
      const { boxes } = round;
      setBoxes(boxes);
    }
  }, [round]);

  useEffect(() => {
    if (boxes) {
      const tempBox = boxes.find((box) => box.boxType === selectedBoxType);
      setSelectedBox(tempBox);
    }
  }, [boxes, selectedBoxType]);

  const _getStatusProduct = (product) => {
    const { startTime, endTime, totalSold, totalSupply } = product;
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
    if (totalSupply - totalSold <= 0) {
      status = "SOLD_OUT";
    }
    return status;
  };

  const status = selectedBox ? _getStatusProduct(selectedBox) : null;

  return (
    boxes && (
      <>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          width="fit-content"
          mb={3}
        >
          {boxes.map((item, j) => {
            const information = BoxType[item.boxType];
            return (
              <BoxItem
                key={j}
                sx={{
                  border: `1px solid ${
                    selectedBoxType === item.boxType
                      ? information.color
                      : "var(--main-color)"
                  }`,
                }}
                p={1}
                onClick={() => {
                  setSelectedBoxType(item.boxType);
                }}
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
              (selectedBox?.boxType.length > 12 ? "long-name" : "")
            }
            variant="h6"
            sx={{
              color: selectedBox?.information?.color,
            }}
          >
            {selectedBox?.boxType.split("_").join(" ").toLowerCase()}{" "}
            {library.BOX}
          </BoxTypeLabel>
        </CustomStack>
        <CustomStack>
          <Typography sx={{ width: 120 }}>{library.TOTAL_SELL}:</Typography>
          <Typography>
            {formatAmount(selectedBox?.totalSupply)} {library.BOX}
          </Typography>
        </CustomStack>
        <CustomStack>
          <Typography sx={{ width: 120 }}>{library.SOLD}:</Typography>
          <Typography>
            {formatAmount(selectedBox?.totalSold)} {library.BOX}
          </Typography>
        </CustomStack>
        <CustomStack>
          <FieldLabel>{library.PRICE}:</FieldLabel>
          <CustomStack>
            {selectedBox?.items?.map((item, index) => (
              <PriceBox key={index}>
                <Typography variant="caption" color="#fff">
                  {formatAmount(item.unitPrice)} {item.paymentCurrency}
                </Typography>
              </PriceBox>
            ))}
          </CustomStack>
        </CustomStack>
        <CustomStack>
          <FieldLabel>{library.CONDITION}:</FieldLabel>
          <Typography> {round.condition}</Typography>
        </CustomStack>
        <Box height={100} mb={4}>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <StaticCountdown data={round} />
        </Box>
        <Stack>
          <CustomButton
            className="custom-btn custom-font"
            onClick={() => setShowPurchaseForm(true)}
            disabled={status === "SOLD_OUT" || status === "END_TIME"}
          >
            {library[status]}
          </CustomButton>
        </Stack>
        <NewBoxMintingForm
          data={selectedBox}
          open={showPurchaseForm}
          onClose={() => {
            setShowPurchaseForm(false);
          }}
        />
      </>
    )
  );
}

const StaticCountdown = ({ data }) => {
  const now = moment().utc().unix() * 1000;
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const _getStatusProduct = (product) => {
    const { angelStartTime, angelEndTime, angelTotalSold, angelTotalSupply } =
      product;
    const now = moment().utc().unix() * 1000;
    const start = angelStartTime;
    const end = angelEndTime;
    let status = "BUY_NOW";
    if (now - end > 0) {
      status = "END_TIME";
    }
    if (start - now > 0) {
      status = "COMING_SOON";
    }
    if (angelTotalSupply - angelTotalSold <= 0) {
      status = "SOLD_OUT";
    }
    return status;
  };

  const status = _getStatusProduct(data);

  let countdownComponent = null;
  let countdownTitle = null;
  if (status === "COMING_SOON") {
    countdownTitle = library.STARTS_IN;
    countdownComponent = (
      <Countdown
        date={Date.now() + (data.angelStartTime - now)}
        renderer={(props) => countDownRenderer(props)}
        // onComplete={() => dispatch(_getPreSaleRoundList())}
      />
    );
  }
  if (status === "BUY_NOW") {
    countdownTitle = library.ENDS_IN;
    countdownComponent = (
      <Countdown
        date={Date.now() + (data.angelEndTime - now)}
        renderer={(props) => countDownRenderer(props)}
        // onComplete={() => dispatch(_getPreSaleRoundList())}
      />
    );
  }
  return (
    (status === "COMING_SOON" || status === "BUY_NOW") && (
      <CustomStack>
        <FieldLabel>{countdownTitle}: </FieldLabel>
        <Box
          sx={{
            transform: "scale(0.7)",
            marginLeft: "-40px",
          }}
        >
          {countdownComponent}
        </Box>
      </CustomStack>
    )
  );
};
