import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BoxType, MINTING_COMBOS } from "../../settings/constants";
import { formatAmount, formatNumberWithDecimal } from "../../settings/format";
import ComboMintingForm from "./ComboMintingForm";
import {
  BoxItem,
  BoxTypeLabel,
  CustomButton,
  CustomStack,
  FieldLabel,
  PriceBox,
} from "./MintingStyles";

export default function RoundComboDetail({ roundNumber, angelBoxInformation }) {
  const [round, setRound] = useState(null);
  const [boxes, setBoxes] = useState(null);
  const [selectedBoxType, setSelectedBoxType] = useState("COMBO_1");
  const [selectedBox, setSelectedBox] = useState(null);
  const { setting, minting } = useSelector((state) => state);
  const { library } = setting;
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const { mintingComboList } = minting;

  useEffect(() => {
    if (mintingComboList) {
      const temp = mintingComboList.find(
        (item) => item.roundNumber === roundNumber
      );
      if (temp) {
        setRound(temp);
      }
    }
  }, [mintingComboList, roundNumber]);

  useEffect(() => {
    if (round) {
      const { combos } = round;
      setBoxes(combos);
    }
  }, [round]);

  useEffect(() => {
    if (boxes) {
      const tempBox = boxes.find((box) => box.comboType === selectedBoxType);
      setSelectedBox(tempBox);
    }
  }, [boxes, selectedBoxType]);

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

  const status = angelBoxInformation
    ? _getStatusProduct(angelBoxInformation)
    : null;

  return round && boxes && selectedBox ? (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        width="fit-content"
        mb={3}
      >
        {boxes.map((item, j) => {
          const information = MINTING_COMBOS[item.comboType];
          return (
            <BoxItem
              key={j}
              sx={{
                border: `1px solid ${
                  selectedBoxType === item.comboType
                    ? information.color
                    : "var(--main-color)"
                }`,
              }}
              p={1}
              onClick={() => {
                setSelectedBoxType(item.comboType);
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
            (selectedBox?.comboType.length > 12 ? "long-name" : "")
          }
          variant="h6"
          sx={{
            color: selectedBox?.information?.color,
          }}
        >
          {selectedBox?.comboType.split("_").join(" ").toLowerCase()}{" "}
          {library.BOX}
        </BoxTypeLabel>
        <Chip
          label={
            <Typography variant="caption" color="#fff" fontWeight={500}>
              -10%
            </Typography>
          }
          size="small"
          color="error"
          sx={{ ml: 1 }}
        />
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
              <Typography
                variant="caption"
                color="#fff"
                sx={{
                  textDecoration: "line-through",
                }}
              >
                {formatNumberWithDecimal(parseInt(item.unitPrice / 0.9))}{" "}
                {item.paymentCurrency}
              </Typography>{" "}
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
        <Stack direction="row" alignItems="flex-start" spacing={1} mt={1}>
          {selectedBox?.products.map(({ product }, index) => {
            const information = BoxType[product.boxType];
            return (
              <Box key={index} textAlign="left" width={"33%"}>
                <BoxItem
                  sx={{
                    border: `1px solid ${information.color}`,
                  }}
                  p={1}
                >
                  <img
                    src={information.image}
                    alt="box img"
                    className="thumbnail"
                  />
                </BoxItem>
                <BoxTypeLabel
                  className={
                    "custom-font name " +
                    (product.boxType.length > 12 ? "long-name" : "")
                  }
                  variant="body2"
                  sx={{
                    color: information.color,
                  }}
                >
                  {product.boxType.split("_").join(" ").toLowerCase()}{" "}
                  {library.BOX}
                </BoxTypeLabel>
              </Box>
            );
          })}
        </Stack>
      </Box>
      <Stack>
        <CustomButton
          className="custom-btn custom-font"
          onClick={() => setShowPurchaseForm(true)}
          // disabled={status === "SOLD_OUT" || status === "END_TIME"}
        >
          {library[status]}
        </CustomButton>
      </Stack>
      <ComboMintingForm
        data={selectedBox}
        open={showPurchaseForm}
        onClose={() => setShowPurchaseForm(false)}
        status={status}
      />
    </>
  ) : null;
}
