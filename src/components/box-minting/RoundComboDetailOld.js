// export default function RoundBoxDetail({ roundNumber }) {
//   const { minting } = useSelector((state) => state);
//   const { mintingComboList } = minting;
//   const [filterItems, setFilterItems] = useState(null);
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedItemByPriceId, setSelectedItemByPriceId] = useState(null);
//   const [selectedItemByPrice, setSelectedItemByPrice] = useState(null);
//   const itemInformation = selectedItemByPrice
//     ? MINTING_COMBOS[selectedItemByPrice.comboType]
//     : null;
//   const { setting } = useSelector((state) => state);
//   const { library } = setting;
//   const now = moment().utc().unix() * 1000;
//   const dispatch = useDispatch();
//   const [showPurchaseForm, setShowPurchaseForm] = useState(false);

//   useEffect(() => {
//     if (mintingComboList && mintingComboList[roundNumber]) {
//       const { filterItems } = mintingComboList[roundNumber];
//       setFilterItems(filterItems);
//     }
//   }, [mintingComboList, roundNumber]);

//   useEffect(() => {
//     if (filterItems && filterItems[0]) {
//       if (selectedItemId === null) {
//         setSelectedItemId(filterItems[0].id);
//       }
//       if (selectedItemByPriceId === null) {
//         setSelectedItemByPriceId(filterItems[0].productByPrice[0].id);
//       }
//     }
//   }, [filterItems, selectedItemByPriceId, selectedItemId]);

//   useEffect(() => {
//     if (filterItems && selectedItemId !== null) {
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
//     const { startTime, endTime, totalSold, totalSupply } = product;
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
//     if (totalSupply - totalSold <= 0) {
//       status = "SOLD_OUT";
//     }
//     return status;
//   };

//   const status = selectedItemByPrice
//     ? _getStatusProduct(selectedItemByPrice)
//     : null;

//   return (
//     selectedItemByPrice && (
//       <>
//         <Hidden mdUp>
//           <Divider
//             sx={{
//               borderWidth: 2,
//               mb: 3,
//             }}
//           />
//         </Hidden>
//         <Stack
//           direction="row"
//           alignItems="center"
//           spacing={2}
//           width="fit-content"
//           mb={3}
//         >
//           {filterItems?.map((item, j) => {
//             const information = MINTING_COMBOS[item.comboType];
//             return (
//               <BoxItem
//                 key={j}
//                 sx={{
//                   border: `1px solid ${
//                     selectedItemByPrice.comboType === item.comboType
//                       ? information.color
//                       : "var(--main-color)"
//                   }`,
//                 }}
//                 p={1}
//                 onClick={() => {
//                   setSelectedItemId(item.id);
//                   setSelectedItemByPriceId(item.productByPrice[0].id);
//                 }}
//               >
//                 <img
//                   src={information.image}
//                   alt="box img"
//                   className="thumbnail"
//                   style={{
//                     transform: "scale(1.5)",
//                   }}
//                 />
//               </BoxItem>
//             );
//           })}
//         </Stack>
//         <CustomStack>
//           <BoxTypeLabel
//             className={
//               "custom-font name " +
//               (selectedItemByPrice.comboType.length > 12 ? "long-name" : "")
//             }
//             variant="h6"
//             sx={{
//               color: itemInformation.color,
//             }}
//           >
//             {MINTING_COMBOS[selectedItemByPrice.comboType].value}
//           </BoxTypeLabel>
//           <Chip
//             label={
//               <Typography variant="caption" color="#fff" fontWeight={500}>
//                 -10%
//               </Typography>
//             }
//             size="small"
//             color="error"
//             sx={{ ml: 1 }}
//           />
//         </CustomStack>
//         <CustomStack>
//           <Typography sx={{ width: 120 }}>{library.TOTAL_SELL}:</Typography>
//           <Typography>
//             {formatAmount(selectedItemByPrice.supply)} {library.BOX}
//           </Typography>
//         </CustomStack>
//         {/* price list */}
//         <CustomStack>
//           <FieldLabel>{library.PRICE}:</FieldLabel>
//           <CustomStack>
//             {selectedItem?.productByPrice.map((item, index) => (
//               <PriceBox
//                 key={index}
//                 className={selectedItemByPrice.id === item.id ? "active" : ""}
//                 onClick={() => setSelectedItemByPriceId(item.id)}
//               >
//                 <Typography
//                   variant="caption"
//                   color="#fff"
//                   sx={{
//                     textDecoration: "line-through",
//                   }}
//                 >
//                   {formatNumberWithDecimal(
//                     item.unitPrice + item.unitPrice * 0.1
//                   )}{" "}
//                   {item.paymentCurrency}
//                 </Typography>{" "}
//                 <Typography variant="caption" color="#fff">
//                   {formatAmount(item.unitPrice)} {item.paymentCurrency}
//                 </Typography>
//               </PriceBox>
//             ))}
//           </CustomStack>
//         </CustomStack>

//         <CustomStack>
//           <FieldLabel>{library.CONDITION}:</FieldLabel>
//           <Typography> {selectedItemByPrice.condition}</Typography>
//         </CustomStack>
//         <CustomStack>
//           <FieldLabel>{library.TIME}:</FieldLabel>
//           <Typography sx={{ color: "#fff" }}>
//             {`${moment(selectedItemByPrice.startTime).format(
//               "YYYY-MM-DD HH:mm"
//             )} to ${moment(selectedItemByPrice.endTime).format(
//               "YYYY-MM-DD HH:mm"
//             )}`}
//           </Typography>
//         </CustomStack>
//         <Box
//           sx={{
//             transform: "scale(0.7)",
//             width: "fit-content",
//             marginLeft: "-2.5rem",
//           }}
//         >
//           {status === "COMING_SOON" && (
//             <Countdown
//               date={Date.now() + (selectedItemByPrice.startTime - now)}
//               renderer={(props) => countDownRenderer(props)}
//               onComplete={() => dispatch(_getMintingBoxList())}
//             />
//           )}
//         </Box>
//         <CustomStack>
//           <Typography>&nbsp;</Typography>
//         </CustomStack>
//         <Stack>
//           <CustomButton
//             className="custom-btn custom-font"
//             onClick={() => setShowPurchaseForm(true)}
//             disabled={status === "SOLD_OUT" || status === "END_TIME"}
//           >
//             {library[status]}
//           </CustomButton>
//         </Stack>
//         <Divider sx={{ mt: 2, mb: 2 }} />

//         <Stack direction="row" alignItems="flex-start" spacing={1} mt={1}>
//           {selectedItemByPrice.products.map(({ product }, index) => {
//             const information = BoxType[product.boxType];
//             return (
//               <Box key={index} textAlign="left" width={"33%"}>
//                 <BoxItem
//                   sx={{
//                     border: `1px solid ${information.color}`,
//                   }}
//                   p={1}
//                 >
//                   <img
//                     src={information.image}
//                     alt="box img"
//                     className="thumbnail"
//                   />
//                 </BoxItem>
//                 <BoxTypeLabel
//                   className={
//                     "custom-font name " +
//                     (product.boxType.length > 12 ? "long-name" : "")
//                   }
//                   variant="body2"
//                   sx={{
//                     color: information.color,
//                   }}
//                 >
//                   {product.boxType.split("_").join(" ").toLowerCase()}{" "}
//                   {library.BOX}
//                 </BoxTypeLabel>
//               </Box>
//             );
//           })}
//         </Stack>
//         <ComboMintingForm
//           data={selectedItemByPrice}
//           open={showPurchaseForm}
//           onClose={() => setShowPurchaseForm(false)}
//         />
//       </>
//     )
//   );
// }
