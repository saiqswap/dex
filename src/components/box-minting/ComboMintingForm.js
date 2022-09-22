import styled from "@emotion/styled";
import {
  Close,
  Facebook,
  Instagram,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { parseUnits } from "ethers/lib/utils";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { checkBeforeBuy, getReceipt, purchaseBox } from "../../onchain/onchain";
import { BoxType, MINTING_COMBOS } from "../../settings/constants";
import {
  ENDPOINT_MINTING_BOX_COMBO_PAID,
  ENDPOINT_MINTING_BOX_COMBO_SC_INPUT,
} from "../../settings/endpoint";
import { deleteText, formatAmount, formatPrice } from "../../settings/format";
import { post } from "../../utils/api";
import GeneralPopup from "../common/GeneralPopup";

const PurchaseBox = styled(Box)({
  boxShadow: "inset 0px 0px 5px #000",
  borderBottom: "1px solid rgba(255, 255, 255, 0.35)",
  borderRight: "1px solid rgba(255, 255, 255, 0.25)",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  borderRadius: "5px",
  padding: "20px",
});
const CloseButton = styled(IconButton)({
  position: "absolute",
  top: 0,
  right: 0,
  minWidth: "unset!important",
  marginTop: "0px!important",
});
const SelectAmountButton = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0,0,0,0.5)",
  width: 70,
  padding: theme.spacing(1),
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: theme.spacing(1),
}));
const selectAmount = [20, 50, 70, 100];
const socials = [
  {
    icon: <Facebook fontSize="small" />,
    link: "https://www.facebook.com/InfinityAngel.io/",
  },
  {
    icon: <Twitter fontSize="small" />,
    link: "https://twitter.com/InfinityAngelio",
  },
  {
    icon: <Instagram fontSize="small" />,
    link: "https://www.instagram.com/infinity_angel_official/",
  },
  {
    icon: <Telegram fontSize="small" />,
    link: "https://t.me/infinityangel_global",
  },
];
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
const ComboMintingForm = ({ onClose, data }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const { setting, user } = useSelector((state) => state);
  const { library, config } = setting;
  const { walletAddress } = user;

  const _onChangeAmount = (value) => {
    value = value.replace(".", "");
    setAmount(deleteText(value));
  };

  const _handleErrorCallback = (error) => {
    console.log(error.message);
    setLoading(false);
  };

  const _handleSubmit = () => {
    // if (information) {
    if (amount) {
      const amountNumber = parseFloat(amount);
      if (amountNumber > data.maxOrder || amountNumber < data.minOrder) {
        toast.error(
          `You can buy width Minimum is ${data.minOrder} box, Maximum is ${data.maxOrder} box`
        );
      } else {
        const product = data;
        const purchaseToken = config.contracts.find(
          (e) => e.contractAddress === product.paymentContract
        );
        setLoading(true);
        const total = product.unitPrice * parseFloat(amount);
        const boxScPrice = parseUnits(
          formatPrice(total, 4),
          purchaseToken.decimals
        );

        checkBeforeBuy(
          config.purchaseContract,
          product.paymentContract,
          boxScPrice,
          walletAddress,
          _handleErrorCallback
        ).then((result) => {
          if (result) {
            post(
              ENDPOINT_MINTING_BOX_COMBO_SC_INPUT,
              {
                comboId: data.id,
                amount: parseFloat(amount),
                address: walletAddress,
              },
              (data) => {
                if (data) {
                  purchaseBox(
                    data,
                    boxScPrice,
                    product.paymentContract,
                    config,
                    _handleErrorCallback
                  ).then((e) => {
                    getReceipt(e).then((result) => {
                      if (result) {
                        post(
                          `${ENDPOINT_MINTING_BOX_COMBO_PAID}?txHash=${e}`,
                          {},
                          (data) => {
                            setLoading(false);
                            toast.success("Success");
                          },
                          (error) => {
                            console.log(error);
                            setLoading(false);
                          }
                        );
                      }
                    });
                  });
                } else {
                  toast.error(library.SOMETHING_WRONG);
                  setLoading(false);
                }
              },
              (error) => {
                toast.error(library[error.code]);
                setLoading(false);
              }
            );
          }
        });
      }
    } else {
      toast.error(library.PLEASE_ENTER_AMOUNT);
    }
    // } else {
    //   toast.error("Please connect wallet and login");
    // }
  };

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

  const status = data ? _getStatusProduct(data) : "";

  return (
    <GeneralPopup open={Boolean(data)}>
      <CloseButton size="small" onClick={onClose}>
        <Close fontSize="small" />
      </CloseButton>
      <Box mt={3} />
      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} className="submit-box">
            <div className="box-image">
              <img src={MINTING_COMBOS[data.name].image} alt="boxImg" />
            </div>
            <Typography className="price">
              {formatAmount(data.unitPrice)} {data.paymentCurrency}
            </Typography>
            <SocialComponent />
          </Grid>
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              zIndex: 999,
            }}
          >
            <Typography className="custom-font" textAlign={"left"}>
              {library.BUY_BOX}
            </Typography>
            <PurchaseBox component="form">
              <Typography
                textAlign="left"
                mb={1}
                sx={{
                  textTransform: "capitalize",
                }}
              >
                {data.name.split("_").join(" ").toLowerCase()}{" "}
              </Typography>
              <TextField
                fullWidth
                label="Amount"
                value={amount}
                onChange={(e) => _onChangeAmount(e.target.value)}
              />
              <Box display="flex" mt={1} justifyContent="flex-start">
                <SelectAmountButton
                  onClick={() => _onChangeAmount(data.minOrder.toString())}
                >
                  {data.minOrder}
                </SelectAmountButton>
                {selectAmount.map((item, index) => (
                  <SelectAmountButton
                    key={index}
                    onClick={() =>
                      _onChangeAmount(
                        parseInt(data.maxOrder * (item / 100)).toString()
                      )
                    }
                  >
                    {parseInt(data.maxOrder * (item / 100))}
                  </SelectAmountButton>
                ))}
              </Box>
              <Typography textAlign="left" mt={1}>
                {library.TOTAL}:{" "}
                {formatAmount(data.unitPrice * parseFloat(amount ? amount : 0))}{" "}
                {data.paymentCurrency}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography>
                  {library.MINIMUM}: {data.minOrder}
                </Typography>
                <Typography>
                  {library.MAXIMUM}: {data.maxOrder}
                </Typography>
              </Box>
              <LoadingButton
                loading={loading}
                className="submit custom-font"
                onClick={_handleSubmit}
                style={{ width: "190px" }}
                disabled={status !== "BUY_NOW"}
              >
                {library[status]}
              </LoadingButton>
            </PurchaseBox>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ margin: "1rem 0px" }} />
            <Typography textAlign="left">{library.WILL_RECEIVE}</Typography>
            <Box
              display="flex"
              direction="row"
              alignItems="flex-start"
              spacing={5}
              mt={1}
            >
              {data.products.map(({ product }, index) => {
                const information = BoxType[product.boxType];
                return (
                  <Box key={index} textAlign="left" mr={5}>
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
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={5} className="box-info">
            <DropRate data={data} />
          </Grid>
          <Grid item xs={12} md={7} className="box-info">
            <AvailableTemplate available={available} library={library} />
          </Grid> */}
          <Grid item xs={12}>
            <NoticeAndInformation library={library} />
          </Grid>
        </Grid>
      )}
    </GeneralPopup>
  );
};

export default ComboMintingForm;

const SocialComponent = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        " button": {
          minWidth: "unset",
        },
      }}
    >
      {socials.map((s, index) => (
        <IconButton component={Link} href={s.link} target="_blank" key={index}>
          {s.icon}
        </IconButton>
      ))}
    </Box>
  );
};

// const AvailableTemplate = ({ available, library }) => {
//   return (
//     <div className="items" style={{ marginLeft: 0 }}>
//       <Typography className="custom-font" textAlign={"left"} mb={1}>
//         {library.AVAILABLE}:{" "}
//         {available && (
//           <span>{`${available.length} ${
//             available[0]
//               ? available[0].type.toLowerCase().replace("_", " ")
//               : ""
//           }${available[0]?.type.toLowerCase() === "angel" ? "s" : ""}`}</span>
//         )}
//       </Typography>
//       {available ? (
//         <ul>
//           {available.map((item, index) => (
//             <Tooltip
//               key={index}
//               title={
//                 <div
//                   style={{
//                     padding: "5px 20px",
//                     fontSize: "1rem",
//                   }}
//                 >
//                   {`${item.name} ${item.level.replace("_", " ")}`}
//                 </div>
//               }
//               placement="right-end"
//               arrow
//             >
//               <li className={item.level.toLowerCase()}>
//                 <span className="custom-font">
//                   {item.level.replace("_", " ")}
//                 </span>
//                 <img
//                   src={`${image_url}/${
//                     item.type === "ANGEL"
//                       ? `avatar_${formatNftName(item.name)}`
//                       : `body_${formatNftName(item.name)}`
//                   }.png`}
//                   alt=""
//                 />
//               </li>
//             </Tooltip>
//           ))}
//         </ul>
//       ) : (
//         <ul style={{ justifyContent: "center", opacity: 0.2 }}>
//           <CircularProgress />
//         </ul>
//       )}
//     </div>
//   );
// };

// const DropRate = ({ data }) => {
//   let tierDescriptions = tierAngelDescription;
//   let indexTierDescription = 0;
//   if (data) {
//     if (data.boxType.includes("MINION")) {
//       tierDescriptions = tierMinionPartDescription;
//       indexTierDescription = 2;
//     }
//     if (data.boxType.includes("COSTUME")) {
//       tierDescriptions = tierCostumeDescription;
//       indexTierDescription = 1;
//     }
//   }
//   return (
//     <>
//       <Typography className="custom-font" textAlign={"left"} mb={1}>
//         Drop Rate Detail
//       </Typography>
//       <DropRateDetail>
//         {BoxType[data.boxType].rate.map((item, index) => (
//           <Box key={index}>
//             <Typography>
//               <span
//                 className="custom-font mr-10"
//                 style={{
//                   fontSize: data.boxType.includes("COSTUME")
//                     ? "0.7rem"
//                     : "0.8rem",
//                   width: data.boxType.includes("COSTUME") ? "75px" : "65px",
//                   display: "inline-block",
//                 }}
//               >
//                 {item.name}:
//               </span>
//               <span style={{ fontSize: "1rem" }}>{item.rate}%</span>
//             </Typography>
//             <small>
//               {tierDescriptions[index + indexTierDescription].split(":")[1]}
//             </small>
//           </Box>
//         ))}
//       </DropRateDetail>
//     </>
//   );
// };

const NoticeAndInformation = ({ library }) => {
  return (
    <>
      <Divider sx={{ margin: "1rem 0px" }} />
      <Box textAlign="left" padding="1rem 2rem">
        <Typography variant="h6" mt={2} color="primary">
          NOTICE
        </Typography>
        <ul style={{ marginLeft: "1rem", listStyle: "inside" }}>
          <li>{`${library.MINTING_FORM_NOTICE_1}.`}</li>
          <li>{`${library.MINTING_FORM_NOTICE_2}.`}</li>
          <li>{`${library.MINTING_FORM_NOTICE_3}.`}</li>
        </ul>
        <Typography variant="h6" mt={2} color="primary">
          INFORMATION
        </Typography>
        <Typography mt={1}>What is Infinity Angel?</Typography>
        <Typography variant="inherit" mt={1} mb={1}>
          Infinity Angel is an AA game, with the playing genre is the horizontal
          screen MOBA focusing on PVP and E-sport in addition to the PVE game
          mode of the Endless RPG genre. With a diverse costume system of more
          than 100 sets of each characters and minions, besides the variety of
          tactics that can be combined from the passive skills of the
          skin/minion is a highlight of the game.
        </Typography>
        <Typography variant="inherit">
          Any user from individual to business can easily to buy, sell and trade
          their NFT. In the beautiful 3D Infinity Angel graphics world, players
          can use their NFT Angels in a variety of ways, from equipping them
          with powerful weapons or unique outfits in fiery, competitive battles
          with each other to get NFT items that can be exchanged and traded
          according to P2E criteria.
        </Typography>
      </Box>
    </>
  );
};
