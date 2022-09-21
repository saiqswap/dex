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

export default function StaticRoundComboDetail({ round }) {
  const [selectedItem, setSelectedItem] = useState(round[0]);
  const itemInformation = MINTING_COMBOS[selectedItem.name];
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

  const status = _getStatusProduct(selectedItem);

  return (
    selectedItem && (
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
          {round.map((item, j) => {
            const information = MINTING_COMBOS[item.name];
            return (
              <BoxItem
                key={j}
                sx={{
                  border: `1px solid ${
                    selectedItem.name === item.name
                      ? information.color
                      : "var(--main-color)"
                  }`,
                }}
                p={1}
                onClick={() => {
                  setSelectedItem(item);
                  setSelectedItem(item);
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
              (selectedItem.name.length > 12 ? "long-name" : "")
            }
            variant="h6"
            sx={{
              color: itemInformation.color,
            }}
          >
            {selectedItem.name.split("_").join(" ").toLowerCase()} {library.BOX}
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
            {formatAmount(selectedItem.supply)} {library.BOX}
          </Typography>
        </CustomStack>
        {/* price list */}
        <CustomStack>
          <FieldLabel>{library.PRICE}:</FieldLabel>
        </CustomStack>
        <CustomStack>
          {selectedItem?.assets.map((item, index) => (
            <PriceBox
              key={index}
              className={selectedItem.id === item.id ? "active" : ""}
              sx={{ width: 180 }}
            >
              <Typography
                variant="caption"
                color="#fff"
                sx={{
                  textDecoration: "line-through",
                }}
              >
                {formatAmount(item.price)} {item.asset}
              </Typography>{" "}
              <Typography variant="caption" color="#fff">
                {formatAmount(Math.round(item.price - item.price * 0.1))}{" "}
                {item.asset}
              </Typography>
            </PriceBox>
          ))}
        </CustomStack>
        <CustomStack>
          <FieldLabel>{library.CONDITION}:</FieldLabel>
          <Typography> {round.condition}</Typography>
        </CustomStack>
        <CustomStack>
          <FieldLabel>{library.TIME}:</FieldLabel>
          <Typography sx={{ color: "#fff" }}>
            {`${moment(selectedItem.startTime).format(
              "YYYY-MM-DD HH:mm"
            )} to ${moment(selectedItem.endTime).format("YYYY-MM-DD HH:mm")}`}
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
              date={Date.now() + (selectedItem.startTime - now)}
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
            onClick={() => setChosenItem(selectedItem)}
            disabled={
              status === "SOLD_OUT" ||
              status === "END_TIME" ||
              status === "COMING_SOON"
            }
          >
            {library[status]}
          </CustomButton>
        </Stack>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <Stack direction="row" alignItems="flex-start" spacing={1} mt={1}>
          {selectedItem.boxes.map((product, index) => {
            const information = BoxType[product];
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
                    (product.length > 12 ? "long-name" : "")
                  }
                  variant="body2"
                  sx={{
                    color: information.color,
                  }}
                >
                  {product.split("_").join(" ").toLowerCase()} {library.BOX}
                </BoxTypeLabel>
              </Box>
            );
          })}
        </Stack>
        <ComboMintingForm
          data={chosenItem}
          // template={template}
          onClose={() => setChosenItem(null)}
        />
      </>
    )
  );
}
