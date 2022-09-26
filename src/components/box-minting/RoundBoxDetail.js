import { Box, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { BoxType } from "../../settings/constants";
import { formatAmount, formatNumberWithDecimal } from "../../settings/format";
import { _getMintingBoxList } from "../../store/actions/mintingActions";
import {
  BoxItem,
  BoxTypeLabel,
  countDownRenderer,
  CustomButton,
  CustomStack,
  FieldLabel,
  LinearProgressCustom,
  PriceBox,
} from "./MintingStyles";
import NewBoxMintingForm from "./NewBoxMintingForm";
import Title from "./Title";

// export default function RoundBoxDetail({ round }) {
//   const [filterItems, setFilterItems] = useState(null);
//   const [selectedItemId, setSelectedItemId] = useState(round.filterItems[0].id);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedItemByPriceId, setSelectedItemByPriceId] = useState(
//     round.filterItems[0] ? round.filterItems[0].productByPrice[0].id : null
//   );
//   const [selectedItemByPrice, setSelectedItemByPrice] = useState(null);
//   const itemInformation = selectedItemByPrice
//     ? BoxType[selectedItemByPrice.boxType]
//     : null;
//   const { setting } = useSelector((state) => state);
//   const { library } = setting;
//   const now = moment().utc().unix() * 1000;
//   const dispatch = useDispatch();
//   const [showPurchaseForm, setShowPurchaseForm] = useState(false);

//   useEffect(() => {
//     const { filterItems } = round;
//     setFilterItems(filterItems);
//   }, [round]);

//   useEffect(() => {
//     if (filterItems) {
//       const temp = filterItems.find((item) => item.id === selectedItemId);
//       setSelectedItem(temp);
//     }
//   }, [filterItems, selectedItemId]);

//   useEffect(() => {
//     if (selectedItemByPriceId !== null && selectedItem) {
//       const temp = selectedItem.productByPrice.find(
//         (item) => item.id === selectedItemByPriceId
//       );
//       if (temp) {
//         setSelectedItemByPrice(temp);
//       }
//     }
//   }, [selectedItem, selectedItemByPriceId]);

//   const _getStatusProduct = (product) => {
//     const { startTime, endTime, sold, totalSell } = product;
//     const now = moment().utc().unix() * 1000;
//     const start = startTime;
//     const end = endTime;
//     let status = "BUY_NOW";
//     if (now - end > 0) {
//       status = "END_TIME";
//     }
//     if (start - now > 0) {
//       status = "COMING_SOON";
//     }
//     if (totalSell - sold <= 0) {
//       status = "SOLD_OUT";
//     }
//     return status;
//   };

//   const status = selectedItemByPrice
//     ? _getStatusProduct(selectedItemByPrice)
//     : null;

//   return selectedItemByPrice ? (
//     <>
//       <Stack
//         direction="row"
//         alignItems="center"
//         spacing={1}
//         width="fit-content"
//         mb={3}
//       >
//         {round.filterItems.map((item, j) => {
//           const information = BoxType[item.boxType];
//           return (
//             <BoxItem
//               key={j}
//               sx={{
//                 border: `1px solid ${
//                   selectedItemByPrice.boxType === item.boxType
//                     ? information.color
//                     : "var(--main-color)"
//                 }`,
//               }}
//               p={1}
//               onClick={() => {
//                 setSelectedItemId(item.id);
//                 setSelectedItemByPriceId(item.productByPrice[0].id);
//               }}
//             >
//               <img
//                 src={information.image}
//                 alt="box img"
//                 className="thumbnail"
//               />
//             </BoxItem>
//           );
//         })}
//       </Stack>
//       <CustomStack>
//         <BoxTypeLabel
//           className={
//             "custom-font name " +
//             (selectedItemByPrice.boxType.length > 12 ? "long-name" : "")
//           }
//           variant="h6"
//           sx={{
//             color: itemInformation.color,
//           }}
//         >
//           {selectedItemByPrice.boxType.split("_").join(" ").toLowerCase()}{" "}
//           {library.BOX}
//         </BoxTypeLabel>
//       </CustomStack>
//       <CustomStack>
//         <Typography sx={{ width: 120 }}>{library.TOTAL_SELL}:</Typography>
//         <Typography>
//           {formatAmount(selectedItemByPrice.supply)} {library.BOX}
//         </Typography>
//       </CustomStack>
//       {/* price list */}
//       <CustomStack>
//         <FieldLabel>{library.PRICE}:</FieldLabel>
//         <CustomStack>
//           {selectedItem?.productByPrice.map((item, index) => (
//             <PriceBox
//               key={index}
//               className={selectedItemByPrice.id === item.id ? "active" : ""}
//               onClick={() => setSelectedItemByPriceId(item.id)}
//             >
//               <Typography variant="caption" color="#fff">
//                 {formatAmount(item.unitPrice)} {item.paymentCurrency}
//               </Typography>
//             </PriceBox>
//           ))}
//         </CustomStack>
//       </CustomStack>

//       <CustomStack>
//         <FieldLabel>{library.CONDITION}:</FieldLabel>
//         <Typography> {round.condition}</Typography>
//       </CustomStack>
//       <CustomStack>
//         <FieldLabel>{library.TIME}:</FieldLabel>
//         <Typography sx={{ color: "#fff" }}>
//           {`${moment(selectedItemByPrice.startTime).format(
//             "YYYY-MM-DD HH:mm"
//           )} to ${moment(selectedItemByPrice.endTime).format(
//             "YYYY-MM-DD HH:mm"
//           )}`}
//         </Typography>
//       </CustomStack>
//       <Box
//         sx={{
//           transform: "scale(0.7)",
//           width: "fit-content",
//           marginLeft: "-2.5rem",
//         }}
//       >
//         {status === "COMING_SOON" && (
//           <Countdown
//             date={Date.now() + (selectedItemByPrice.startTime - now)}
//             renderer={(props) => countDownRenderer(props)}
//             onComplete={() => dispatch(_getMintingBoxList())}
//           />
//         )}
//       </Box>
//       <CustomStack>
//         <Typography>&nbsp;</Typography>
//       </CustomStack>
//       <Stack>
//         <CustomButton
//           className="custom-btn custom-font"
//           onClick={() => setShowPurchaseForm(true)}
//           disabled={status === "SOLD_OUT" || status === "END_TIME"}
//         >
//           {library[status]}
//         </CustomButton>
//       </Stack>
//       <NewBoxMintingForm
//         data={selectedItemByPrice}
//         open={showPurchaseForm}
//         onClose={() => {
//           setShowPurchaseForm(false);
//         }}
//       />
//     </>
//   ) : null;
// }

export default function RoundBoxDetail({ round }) {
  const [boxes, setBoxes] = useState(null);
  const [selectedBoxType, setSelectedBoxType] = useState("ANGEL");
  const [selectedBox, setSelectedBox] = useState(null);
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const now = moment().utc().unix() * 1000;
  const dispatch = useDispatch();
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
                  {item.id} {formatAmount(item.unitPrice)}{" "}
                  {item.paymentCurrency}
                </Typography>
              </PriceBox>
            ))}
          </CustomStack>
        </CustomStack>
        <CustomStack>
          <FieldLabel>{library.CONDITION}:</FieldLabel>
          <Typography> {round.condition}</Typography>
        </CustomStack>
        <StaticCountdown data={round} />
        <Box
          sx={{
            transform: "scale(0.7)",
            width: "fit-content",
            marginLeft: "-2.5rem",
          }}
        >
          {status === "COMING_SOON" && (
            <Countdown
              date={Date.now() + (selectedBox?.startTime - now)}
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
  );
};
