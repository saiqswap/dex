import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { parseUnits } from "ethers/lib/utils";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  checkBeforeBuy,
  getReceipt,
  provider,
  purchaseBox,
} from "../../onchain/onchain";
import { image_url } from "../../settings";
import {
  BoxType,
  tierAngelDescription,
  tierCostumeDescription,
  tierMinionPartDescription,
} from "../../settings/constants";
import {
  ENDPOINT_PRESALE_PRODUCT_SC_INPUT,
  ENDPOINT_PRESALE_TRIGGER_PAID_PRODUCT,
} from "../../settings/endpoint";
import {
  deleteText,
  formatAmount,
  formatNumberWithDecimal,
  formatPrice,
} from "../../settings/format";
import {
  _getMintingBoxInformation,
  _getMintingBoxList,
} from "../../store/actions/mintingActions";
import { _getOnchainBalance } from "../../store/actions/userActions";
import { post } from "../../utils/api";
import { formatNftName } from "../../utils/util";
import GeneralPopup from "../common/GeneralPopup";
import MintingLimit from "./MintingLimit";
import {
  DropRateDetail,
  LinearProgressCustom,
  PurchaseBox,
  SelectAmountButton,
} from "./MintingStyles";
import { NoticeAndInformation } from "./NoticeAndInformation";
import { SocialComponent } from "./SocialComponent";

const selectAmount = [10, 20, 30];

const NewBoxMintingForm = ({ onClose, data, open }) => {
  const [available, setAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const { setting, user, minting } = useSelector((state) => state);
  const { library, config, templates } = setting;
  const { walletAddress, ref } = user;
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { mintingBoxInformation } = minting;
  const [userMintingInformation, setUserMintingInformation] = useState(null);
  const [mintingBoxSetting, setMintingBoxSetting] = useState(null);

  useEffect(() => {
    if (!open) {
      setChecked(false);
      setAmount("");
      setProgress(0);
    }
  }, [open]);

  useEffect(() => {
    if (data && mintingBoxInformation) {
      const userMintingInformation = mintingBoxInformation?.items.find(
        (e) => e.round === data.roundNumber
      );
      if (userMintingInformation) {
        const tempUserMintingInformation = {
          boughtBoxes: userMintingInformation.boxes,
          boughtCombos: userMintingInformation.combos,
        };
        setUserMintingInformation(tempUserMintingInformation);
        const tempMintingBoxSetting = userMintingInformation.inoSetting;
        setMintingBoxSetting(tempMintingBoxSetting);
      }
    }
  }, [data, mintingBoxInformation]);

  useEffect(() => {
    if (data) {
      if (data.boxType && templates) {
        let tempData;
        tempData = templates.filter((x) =>
          data.boxType.toLowerCase().includes(x.type.toLowerCase())
        );
        tempData.sort((a, b) =>
          a.level.toLowerCase().localeCompare(b.level.toLowerCase())
        );
        setAvailable(tempData);
      }
    }
  }, [data, templates]);

  useEffect(() => {
    if (data) {
      const availablePercent = parseInt((data.totalSold / data.supply) * 100);
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < availablePercent) {
            return prevProgress + 10;
          } else {
            clearInterval(timer);
            return prevProgress;
          }
        });
      }, 200);
      return () => {
        clearInterval(timer);
      };
    }
    return () => setProgress(0);
  }, [data]);

  const _onChangeAmount = (value) => {
    value = value.replace(".", "");
    setAmount(deleteText(value));
  };

  const _handleErrorCallback = (error) => {
    setLoading(false);
    console.log(error.message);
  };

  const _handleSubmit = () => {
    const amountNumber = parseFloat(amount);
    if (!walletAddress) {
      toast.error(library.PLEASE_CONNECT_WALLET);
    } else if (!amountNumber) {
      toast.error(library.PLEASE_ENTER_AMOUNT);
    } else if (amountNumber > data.maxOrder || amountNumber < data.minOrder) {
      toast.error(
        `You can buy with Minimum is ${data.minOrder} box, Maximum is ${data.maxOrder} box`
      );
    } else if (
      amountNumber >
      mintingBoxSetting.boxes - userMintingInformation.boughtBoxes
    ) {
      toast.error(library.PRESALE_PRODUCT_OVER_LIMIT);
    } else if (!checked) {
      toast.error(library.PLEASE_READ_AND_ACCEPT);
    } else {
      _handlePurchase();
    }
  };

  const _handlePurchase = () => {
    const product = data;
    const purchaseToken = config.contracts.find(
      (e) => e.contractAddress === product.paymentContract
    );
    setLoading(true);
    const total = product.unitPrice * parseFloat(amount);
    const boxScPrice = parseUnits(
      formatPrice(total, 10),
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
        setIsApproved(true);
        post(
          ENDPOINT_PRESALE_PRODUCT_SC_INPUT,
          {
            productId: data.id,
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
                    setIsConfirmed(true);
                    post(
                      `${ENDPOINT_PRESALE_TRIGGER_PAID_PRODUCT}?txHash=${e}${
                        ref ? `&refId=${ref}` : ""
                      }`,
                      {},
                      () => {
                        setLoading(false);
                        toast.success(library.SUCCESS);
                        setIsApproved(false);
                        setIsConfirmed(false);
                        setTimeout(() => {
                          dispatch(
                            _getOnchainBalance(
                              config.contracts,
                              walletAddress,
                              provider
                            )
                          );
                          dispatch(_getMintingBoxList());
                          dispatch(_getMintingBoxInformation(walletAddress));
                        }, 3000);
                      },
                      (error) => {
                        console.log(error);
                        toast.error(error.code);
                        toast.error(library.SOMETHING_WRONG);
                        setLoading(false);
                        setIsApproved(false);
                        setIsConfirmed(false);
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
  };

  const _getStatusProduct = (product) => {
    const { startTime, endTime, totalSold, totalSell } = product;
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
    if (totalSell - totalSold <= 0) {
      status = "SOLD_OUT";
    }
    return status;
  };

  const status = data ? _getStatusProduct(data) : "";

  return (
    <GeneralPopup open={open} onClose={onClose} disabled={loading}>
      <Box mt={3} />
      {data && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} className="submit-box">
            <div className="box-image">
              <img src={BoxType[data.boxType].image} alt="boxImg" />
            </div>
            <Typography className="price">
              {formatAmount(data.unitPrice)} {data.paymentCurrency}
            </Typography>
            <SocialComponent />
            <Box mt={3} />
            <MintingLimit
              mintingBoxSetting={mintingBoxSetting}
              userMintingInformation={userMintingInformation}
            />
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
                sx={{
                  textTransform: "capitalize",
                }}
              >
                {data.boxType.split("_").join(" ").toLowerCase()} {library.BOX}
              </Typography>
              <Typography
                variant="body2"
                textAlign="left"
                mb={1}
                color="Highlight"
              >
                Ref: {ref}
              </Typography>
              <Box mt={2} mb={2}>
                <LinearProgressCustom variant="determinate" value={progress} />
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  px={1}
                  mt={0.5}
                >
                  <Typography variant="caption" color="#fff">
                    {formatNumberWithDecimal(data.totalSold, 2)} {library.BOX}
                  </Typography>
                  <Typography variant="caption" color="#fff">
                    {formatNumberWithDecimal(data.supply, 2)} {library.BOX}
                  </Typography>
                </Box>
              </Box>
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
                        // parseInt(data.maxOrder * (item / 100)).toString()
                        item.toString()
                      )
                    }
                  >
                    {/* {parseInt(data.maxOrder * (item / 100))} */}
                    {item}
                  </SelectAmountButton>
                ))}
                <SelectAmountButton
                  onClick={() => {
                    _onChangeAmount(
                      (
                        mintingBoxSetting.boxes -
                        userMintingInformation.boughtBoxes
                      ).toString()
                    );
                  }}
                >
                  MAX
                </SelectAmountButton>
              </Box>
              <Typography textAlign="left" mt={3} variant="body2">
                {library.TOTAL}:{" "}
                {formatAmount(data.unitPrice * parseFloat(amount ? amount : 0))}{" "}
                {data.paymentCurrency}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  {library.MINIMUM}: {data.minOrder}
                </Typography>
                <Typography variant="body2">
                  {library.MAXIMUM}: {data.maxOrder}
                </Typography>
              </Box>
              <FormGroup sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="caption" textAlign="left">
                      {library.PRESALE_CHECKBOX_1}{" "}
                      <Link
                        target="_blank"
                        href="https://doc.infinityangel.io/infinity-angel-docs/overview/whitepaper"
                      >
                        {library.WHITEPAPER}
                      </Link>
                      ,{" "}
                      <Link
                        target="_blank"
                        href="https://doc.infinityangel.io/faqs/privacy-policy"
                      >
                        {library.POLICY_AND_CONDITIONS}
                      </Link>{" "}
                      {library.AND}{" "}
                      <Link
                        target="_blank"
                        href="https://doc.infinityangel.io/faqs/disclaimer"
                      >
                        {library.DISCLAIMER}
                      </Link>{" "}
                      {library.PRESALE_CHECKBOX_2}
                    </Typography>
                  }
                />
              </FormGroup>
              <LoadingButton
                loading={loading}
                className="submit custom-font"
                onClick={_handleSubmit}
                style={{ width: "190px" }}
                disabled={status !== "BUY_NOW"}
              >
                {library[status]}
              </LoadingButton>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Box
                mt={3}
                display="flex"
                justifyContent="space-between"
                width={300}
              >
                <Box
                  sx={{
                    justifyContent: "flex-start",
                    opacity: isApproved ? 1 : 0.5,
                    display: "flex",
                  }}
                >
                  <CheckCircleIcon />
                  <Typography ml={1} variant="body2">
                    {library.APPROVED}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    justifyContent: "flex-start",
                    opacity: isConfirmed ? 1 : 0.5,
                    display: "flex",
                  }}
                >
                  <CheckCircleIcon />
                  <Typography ml={1} variant="body2">
                    {library.CONFIRMED}
                  </Typography>
                </Box>
              </Box>
            </PurchaseBox>
          </Grid>
          <Grid item xs={12} md={5} className="box-info">
            <DropRate data={data} />
          </Grid>
          <Grid item xs={12} md={7} className="box-info">
            <AvailableTemplate available={available} library={library} />
          </Grid>
          <Grid item xs={12}>
            <NoticeAndInformation />
          </Grid>
        </Grid>
      )}
    </GeneralPopup>
  );
};

export default NewBoxMintingForm;

const AvailableTemplate = ({ available, library }) => {
  return (
    <div className="items" style={{ marginLeft: 0 }}>
      <Typography className="custom-font" textAlign={"left"} mb={1}>
        {library.AVAILABLE}:{" "}
        {available && (
          <span>{`${available.length} ${
            available[0]
              ? available[0].type.toLowerCase().replace("_", " ")
              : ""
          }${available[0]?.type.toLowerCase() === "angel" ? "s" : ""}`}</span>
        )}
      </Typography>
      {available ? (
        <ul>
          {available.map((item, index) => (
            <Tooltip
              key={index}
              title={
                <div
                  style={{
                    padding: "5px 20px",
                    fontSize: "1rem",
                  }}
                >
                  {`${item.name} ${item.level.replace("_", " ")}`}
                </div>
              }
              placement="right-end"
              arrow
            >
              <li className={item.level.toLowerCase()}>
                <span className="custom-font">
                  {item.level.replace("_", " ")}
                </span>
                <img
                  src={`${image_url}/${
                    item.type === "ANGEL"
                      ? `avatar_${formatNftName(item.name)}`
                      : `body_${formatNftName(item.name)}`
                  }.png`}
                  alt=""
                />
              </li>
            </Tooltip>
          ))}
        </ul>
      ) : (
        <ul style={{ justifyContent: "center", opacity: 0.2 }}>
          <CircularProgress />
        </ul>
      )}
    </div>
  );
};

const DropRate = ({ data }) => {
  let tierDescriptions = tierAngelDescription;
  let indexTierDescription = 0;
  if (data) {
    if (data.boxType.includes("MINION")) {
      tierDescriptions = tierMinionPartDescription;
      indexTierDescription = 2;
    }
    if (data.boxType.includes("COSTUME")) {
      tierDescriptions = tierCostumeDescription;
      indexTierDescription = 1;
    }
  }
  return (
    <>
      <Typography className="custom-font" textAlign={"left"} mb={1}>
        Drop Rate Detail
      </Typography>
      <DropRateDetail>
        {BoxType[data.boxType].rate.map((item, index) => (
          <Box key={index}>
            <Typography>
              <span
                className="custom-font mr-10"
                style={{
                  fontSize: data.boxType.includes("COSTUME")
                    ? "0.7rem"
                    : "0.8rem",
                  width: data.boxType.includes("COSTUME") ? "75px" : "65px",
                  display: "inline-block",
                }}
              >
                {item.name}:
              </span>
              <span style={{ fontSize: "1rem" }}>{item.rate}%</span>
            </Typography>
            <small>
              {tierDescriptions[index + indexTierDescription].split(":")[1]}
            </small>
          </Box>
        ))}
      </DropRateDetail>
    </>
  );
};
