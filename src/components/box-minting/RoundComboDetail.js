<<<<<<< HEAD
import {
  Box,
  Button,
  Chip,
  Divider,
  Hidden,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { BoxType, MINTING_COMBOS } from "../../settings/constants";
import { formatAmount } from "../../settings/format";
import { _getMintingBoxList } from "../../store/actions/mintingActions";
import ComboMintingForm from "./ComboMintingForm";

const BoxItem = styled(Box)(({ theme }) => ({
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
  [theme.breakpoints.down("sm")]: {
    height: 40,
    width: 40,
    padding: theme.spacing(0.5),
  },
}));
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
const BoxTypeLabel = styled(Typography)({
  textTransform: "capitalize",
  fontWeight: 700,
});
const FieldLabel = styled(Typography)({
  width: 120,
});
const PriceBox = styled(Box)(({ theme }) => ({
  background: "rgba(255,255,255,0.05)",
  borderRadius: "5px",
  backdropFilter: "blur(5px)",
  padding: theme.spacing(0.5),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: 100,
  textAlign: "center",
  cursor: "pointer",
  "&.active": {
    border: "2px solid var(--border-color)",
  },
}));
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
const CustomButton = styled(Button)({
  padding: "0 30px",
  width: 200,
  textTransform: "uppercase",
});

export default function RoundBoxDetail({ round }) {
  const { filterItems } = round;
  const [selectedItem, setSelectedItem] = useState(filterItems[0]);
  const [selectedItemByPrice, setSelectedItemByPrice] = useState(
    filterItems[0].productByPrice[0]
  );
  const itemInformation = MINTING_COMBOS[selectedItemByPrice.name];
=======
import { Box, Divider, Hidden, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { BoxType, MINTING_COMBOS } from "../../settings/constants";
import { formatAmount, formatNumberWithDecimal } from "../../settings/format";
import { _getMintingBoxList } from "../../store/actions/mintingActions";
import ComboMintingForm from "./ComboMintingForm";
import {
  BoxItem,
  BoxTypeLabel,
  countDownRenderer,
  CustomButton,
  CustomStack,
  FieldLabel,
  PriceBox,
} from "./MintingStyles";

export default function RoundBoxDetail({ roundNumber }) {
  const { minting } = useSelector((state) => state);
  const { mintingComboList } = minting;
  const [filterItems, setFilterItems] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemByPriceId, setSelectedItemByPriceId] = useState(null);
  const [selectedItemByPrice, setSelectedItemByPrice] = useState(null);
  const itemInformation = selectedItemByPrice
    ? MINTING_COMBOS[selectedItemByPrice.comboType]
    : null;
>>>>>>> develop
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const now = moment().utc().unix() * 1000;
  const dispatch = useDispatch();
<<<<<<< HEAD
  const [chosenItem, setChosenItem] = useState(false);
=======
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  useEffect(() => {
    if (mintingComboList && mintingComboList[roundNumber]) {
      const { filterItems } = mintingComboList[roundNumber];
      setFilterItems(filterItems);
    }
  }, [mintingComboList, roundNumber]);

  useEffect(() => {
    if (filterItems && filterItems[0]) {
      if (selectedItemId === null) {
        setSelectedItemId(filterItems[0].id);
      }
      if (selectedItemByPriceId === null) {
        setSelectedItemByPriceId(filterItems[0].productByPrice[0].id);
      }
    }
  }, [filterItems, selectedItemByPriceId, selectedItemId]);

  useEffect(() => {
    if (filterItems && selectedItemId !== null) {
      const temp = filterItems.find((item) => item.id === selectedItemId);
      setSelectedItem(temp);
    }
  }, [filterItems, selectedItemId]);

  useEffect(() => {
    if (selectedItemByPriceId !== null && selectedItem) {
      const temp = selectedItem.productByPrice.find(
        (item) => item.id === selectedItemByPriceId
      );
      if (temp) {
        setSelectedItemByPrice(temp);
      }
    }
  }, [selectedItem, selectedItemByPriceId]);
>>>>>>> develop

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

<<<<<<< HEAD
  const status = _getStatusProduct(selectedItemByPrice);
=======
  const status = selectedItemByPrice
    ? _getStatusProduct(selectedItemByPrice)
    : null;
>>>>>>> develop

  return (
    selectedItemByPrice && (
      <>
        <Hidden mdUp>
          <Divider
            sx={{
              borderWidth: 2,
              mb: 3,
            }}
          />
        </Hidden>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          width="fit-content"
          mb={3}
        >
<<<<<<< HEAD
          {filterItems.map((item, j) => {
            const information = MINTING_COMBOS[item.name];
=======
          {filterItems?.map((item, j) => {
            const information = MINTING_COMBOS[item.comboType];
>>>>>>> develop
            return (
              <BoxItem
                key={j}
                sx={{
                  border: `1px solid ${
<<<<<<< HEAD
                    selectedItemByPrice.name === item.name
=======
                    selectedItemByPrice.comboType === item.comboType
>>>>>>> develop
                      ? information.color
                      : "var(--main-color)"
                  }`,
                }}
                p={1}
                onClick={() => {
<<<<<<< HEAD
                  setSelectedItem(item);
                  setSelectedItemByPrice(item.productByPrice[0]);
=======
                  setSelectedItemId(item.id);
                  setSelectedItemByPriceId(item.productByPrice[0].id);
>>>>>>> develop
                }}
              >
                <img
                  src={information.image}
                  alt="box img"
                  className="thumbnail"
                  style={{
                    transform: "scale(1.5)",
                  }}
                />
              </BoxItem>
            );
          })}
        </Stack>
        <CustomStack>
          <BoxTypeLabel
            className={
              "custom-font name " +
<<<<<<< HEAD
              (selectedItemByPrice.name.length > 12 ? "long-name" : "")
=======
              (selectedItemByPrice.comboType.length > 12 ? "long-name" : "")
>>>>>>> develop
            }
            variant="h6"
            sx={{
              color: itemInformation.color,
            }}
          >
<<<<<<< HEAD
            {selectedItemByPrice.name.split("_").join(" ").toLowerCase()}{" "}
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
=======
            {MINTING_COMBOS[selectedItemByPrice.comboType].value}
          </BoxTypeLabel>
>>>>>>> develop
        </CustomStack>
        <CustomStack>
          <Typography sx={{ width: 120 }}>{library.TOTAL_SELL}:</Typography>
          <Typography>
            {formatAmount(selectedItemByPrice.supply)} {library.BOX}
          </Typography>
        </CustomStack>
        {/* price list */}
        <CustomStack>
          <FieldLabel>{library.PRICE}:</FieldLabel>
          <CustomStack>
            {selectedItem?.productByPrice.map((item, index) => (
              <PriceBox
                key={index}
                className={selectedItemByPrice.id === item.id ? "active" : ""}
<<<<<<< HEAD
                onClick={() => setSelectedItemByPrice(item)}
                sx={{ width: 150 }}
=======
                onClick={() => setSelectedItemByPriceId(item.id)}
>>>>>>> develop
              >
                <Typography
                  variant="caption"
                  color="#fff"
                  sx={{
                    textDecoration: "line-through",
                  }}
                >
<<<<<<< HEAD
                  {formatAmount(item.unitPrice)} {item.paymentCurrency}
                </Typography>{" "}
                <Typography variant="caption" color="#fff">
                  {formatAmount(item.unitPrice - item.unitPrice * 0.1)}{" "}
                  {item.paymentCurrency}
=======
                  {formatNumberWithDecimal(
                    item.unitPrice + item.unitPrice * 0.1
                  )}{" "}
                  {item.paymentCurrency}
                </Typography>{" "}
                <Typography variant="caption" color="#fff">
                  {formatAmount(item.unitPrice)} {item.paymentCurrency}
>>>>>>> develop
                </Typography>
              </PriceBox>
            ))}
          </CustomStack>
        </CustomStack>
<<<<<<< HEAD
        <CustomStack>
          <FieldLabel>{library.CONDITION}:</FieldLabel>
          <Typography> {round.condition}</Typography>
=======

        <CustomStack>
          <FieldLabel>{library.CONDITION}:</FieldLabel>
          <Typography> {selectedItemByPrice.condition}</Typography>
>>>>>>> develop
        </CustomStack>
        <CustomStack>
          <FieldLabel>{library.TIME}:</FieldLabel>
          <Typography sx={{ color: "#fff" }}>
            {`${moment(selectedItemByPrice.startTime).format(
              "YYYY-MM-DD HH:mm"
            )} to ${moment(selectedItemByPrice.endTime).format(
              "YYYY-MM-DD HH:mm"
            )}`}
          </Typography>
        </CustomStack>
        <Box
          sx={{
            transform: "scale(0.7)",
            width: "fit-content",
            marginLeft: "-2.5rem",
          }}
        >
          {status === "COMING_SOON" && (
            <Countdown
              date={Date.now() + (selectedItemByPrice.startTime - now)}
              renderer={(props) => countDownRenderer(props)}
              onComplete={() => dispatch(_getMintingBoxList())}
            />
          )}
        </Box>
        <CustomStack>
          <Typography>&nbsp;</Typography>
        </CustomStack>
        <Stack>
          <CustomButton
            className="custom-btn custom-font"
<<<<<<< HEAD
            onClick={() => setChosenItem(selectedItemByPrice)}
            disabled={
              status === "SOLD_OUT" ||
              status === "END_TIME" ||
              status === "COMING_SOON"
            }
=======
            onClick={() => setShowPurchaseForm(true)}
            disabled={status === "SOLD_OUT" || status === "END_TIME"}
>>>>>>> develop
          >
            {library[status]}
          </CustomButton>
        </Stack>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <Stack direction="row" alignItems="flex-start" spacing={1} mt={1}>
          {selectedItemByPrice.products.map(({ product }, index) => {
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
        <ComboMintingForm
<<<<<<< HEAD
          data={chosenItem}
          // template={template}
          onClose={() => setChosenItem(null)}
=======
          data={selectedItemByPrice}
          open={showPurchaseForm}
          onClose={() => setShowPurchaseForm(false)}
>>>>>>> develop
        />
      </>
    )
  );
}
