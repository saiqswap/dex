import { Box, Button, Stack, styled, Typography } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { BoxType } from "../../settings/constants";
import { formatAmount } from "../../settings/format";
import { _getMintingBoxList } from "../../store/actions/mintingActions";
import NewBoxMintingForm from "./NewBoxMintingForm";

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
  const itemInformation = BoxType[selectedItemByPrice.boxType];
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const now = moment().utc().unix() * 1000;
  const dispatch = useDispatch();
  const [chosenItem, setChosenItem] = useState(false);

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

  const status = _getStatusProduct(selectedItemByPrice);

  return (
    selectedItemByPrice && (
      <>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          width="fit-content"
          mb={3}
        >
          {filterItems.map((item, j) => {
            const information = BoxType[item.boxType];
            return (
              <BoxItem
                key={j}
                sx={{
                  border: `1px solid ${
                    selectedItemByPrice.boxType === item.boxType
                      ? information.color
                      : "var(--main-color)"
                  }`,
                }}
                p={1}
                onClick={() => {
                  setSelectedItem(item);
                  setSelectedItemByPrice(item.productByPrice[0]);
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
              (selectedItemByPrice.boxType.length > 12 ? "long-name" : "")
            }
            variant="h6"
            sx={{
              color: itemInformation.color,
            }}
          >
            {selectedItemByPrice.boxType.split("_").join(" ").toLowerCase()}{" "}
            {library.BOX}
          </BoxTypeLabel>
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
                onClick={() => setSelectedItemByPrice(item)}
              >
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
            onClick={() => setChosenItem(selectedItemByPrice)}
            disabled={status === "SOLD_OUT" || status === "END_TIME"}
          >
            {library[status]}
          </CustomButton>
        </Stack>
        <NewBoxMintingForm
          data={chosenItem}
          // template={template}
          onClose={() => setChosenItem(null)}
        />
      </>
    )
  );
}
