import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  checkBeforeBuy,
  getReceipt,
  provider,
  purchaseBox,
} from "../../onchain/onchain";
import { PROJECT_LOCATION } from "../../settings";
import { BoxType, MINTING_COMBOS } from "../../settings/constants";
import {
  ENDPOINT_MINTING_BOX_COMBO_PAID,
  ENDPOINT_MINTING_BOX_COMBO_SC_INPUT,
} from "../../settings/endpoint";
import {
  deleteText,
  formatAmount,
  formatNumberWithDecimal,
  formatPrice,
} from "../../settings/format";
import {
  _getMintingBoxInformation,
  _getMintingComboList,
} from "../../store/actions/mintingActions";
import { _getOnchainBalance } from "../../store/actions/userActions";
import { post } from "../../utils/api";
import GeneralPopup from "../common/GeneralPopup";
import MintingLimit from "./MintingLimit";
import {
  BoxItem,
  BoxTypeLabel,
  CustomStack,
  LinearProgressCustom,
  PriceBox,
  PurchaseBox,
  SelectAmountButton,
} from "./MintingStyles";
import { NoticeAndInformation } from "./NoticeAndInformation";
import PolicyCheck from "./PolicyCheck";
import { SocialComponent } from "./SocialComponent";

const selectAmount = [5, 10];

const ComboMintingForm = ({ onClose, data, open, status }) => {
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const [boxInformation, setBoxInformation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const { setting, user, minting } = useSelector((state) => state);
  const { library, config } = setting;
  const { walletAddress, ref, onChainBalances } = user;
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { mintingBoxInformation } = minting;
  const [userMintingInformation, setUserMintingInformation] = useState(null);
  const [mintingBoxSetting, setMintingBoxSetting] = useState(null);
  const [onChainBalance, setOnchainBalance] = useState(0);

  useEffect(() => {
    if (data) {
      const temp = data.items.find(
        (item) => item.paymentCurrency === selectedAsset
      );
      setBoxInformation(temp);
    }
  }, [data, selectedAsset]);

  useEffect(() => {
    if (onChainBalances) {
      const temp = onChainBalances.find((b) => b.symbol === selectedAsset);
      setOnchainBalance(temp);
    }
  }, [onChainBalances, selectedAsset]);

  useEffect(() => {
    if (!open) {
      setChecked(false);
      setAmount("");
    }
  }, [open]);

  useEffect(() => {
    if (data && mintingBoxInformation) {
      const userMintingInformation = mintingBoxInformation?.items.find(
        (e) => e.round === data.roundNumber && e.location === PROJECT_LOCATION
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
      const availablePercent = parseInt((data.totalSold / data.supply) * 100);
      setProgress(availablePercent);
    }
    return () => {
      setProgress(0);
    };
  }, [data]);

  useEffect(() => {
    if (data) {
      let staticPrice = 0;
      data.products.forEach((p) => (staticPrice += p.unitPrice));
    }
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
      mintingBoxSetting.combos - userMintingInformation.boughtCombos
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
    const { unitPrice } = product;
    const total = unitPrice * parseFloat(amount);
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
                    setIsConfirmed(true);
                    post(
                      `${ENDPOINT_MINTING_BOX_COMBO_PAID}?txHash=${e}${
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
                          dispatch(_getMintingComboList());
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

  return (
    <GeneralPopup open={open} onClose={onClose} disabled={loading}>
      {boxInformation && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} className="submit-box">
            <div className="box-image">
              <img src={MINTING_COMBOS[data.comboType].image} alt="boxImg" />
            </div>
            <Box className="price">
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through" }}
              >
                {formatAmount(data.unitPrice / 0.9)} {data.paymentCurrency}
              </Typography>
              <Typography>
                {formatAmount(data.unitPrice)} {data.paymentCurrency}
              </Typography>
            </Box>

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
            <PurchaseBox component="form">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  textAlign="left"
                  sx={{
                    textTransform: "capitalize",
                    color: data?.information?.color,
                  }}
                >
                  {data.comboType.split("_").join(" ").toLowerCase()}{" "}
                  {library.BOX}
                </Typography>
                {ref && (
                  <Typography
                    variant="body2"
                    textAlign="left"
                    mb={1}
                    color="Highlight"
                  >
                    Ref: {ref}
                  </Typography>
                )}
              </Box>
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
              <CustomStack>
                {data &&
                  data.items.length > 1 &&
                  data?.items?.map((item, index) => (
                    <PriceBox
                      key={index}
                      onClick={() => setSelectedAsset(item.paymentCurrency)}
                      className={
                        selectedAsset === item.paymentCurrency ? "active" : ""
                      }
                    >
                      <Typography variant="caption" color="#fff">
                        {item.sold} {formatAmount(item.unitPrice)}{" "}
                        {item.paymentCurrency}
                      </Typography>
                    </PriceBox>
                  ))}
              </CustomStack>
              <Box textAlign="right">
                <Typography variant="caption" color="#fff" opacity="0.8">
                  {library.BALANCE}:{" "}
                  {formatNumberWithDecimal(onChainBalance?.onChainBalance, 2)}{" "}
                  {onChainBalance?.symbol}
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Amount"
                value={amount}
                onChange={(e) => _onChangeAmount(e.target.value)}
                placeholder={` Limited to one-time purchase: ${data.minOrder} ~ ${data.maxOrder} ${library.BOX}`}
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
                    onClick={() => _onChangeAmount(item.toString())}
                  >
                    {item}
                  </SelectAmountButton>
                ))}
                <SelectAmountButton
                  onClick={() => {
                    _onChangeAmount(
                      (
                        mintingBoxSetting.combos -
                        userMintingInformation.boughtCombos
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
              <FormGroup sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                  }
                  label={<PolicyCheck />}
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
              {loading && (
                <Box textAlign="left">
                  <Typography variant="caption" color="error" textAlign="left">
                    Notice: Please do not reload this page to avoid risk in the
                    transaction process
                  </Typography>
                </Box>
              )}
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
          <Grid item xs={12}>
            <NoticeAndInformation />
          </Grid>
        </Grid>
      )}
    </GeneralPopup>
  );
};

export default ComboMintingForm;
