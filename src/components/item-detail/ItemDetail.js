import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Modal,
  styled,
  Typography,
} from "@mui/material";
import { utils } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  checkBeforeBuy,
  getReceipt,
  prefix,
  purchaseECR721,
} from "../../onchain/onchain";
import { AppConfig, image_url } from "../../settings";
import { EndpointConstant } from "../../settings/endpoint";
import {
  formatAddress,
  formatAmount,
  formatNumberWithDecimal,
  formatPrice,
  formatUSD,
  _getNFTImageLink,
} from "../../settings/format";
import { _showAppError } from "../../store/actions/settingActions";
import { get, post, _delete } from "../../utils/api";
import { formatNftName } from "../../utils/util";
import CopyBox from "../common/CopyBox";
import CustomBlueSmallModal from "../common/CustomBlueSmallModal";
import { CustomLoadingButton } from "../common/CustomButton";
import CustomNumberInput from "../common/CustomNumberInput";
import CustomSmallModal from "../common/CustomSmallModal";
import CustomTooltip from "../common/CustomTooltip";
import Model3d from "../common/Model3d";
import TierDescription from "../common/TierDescription";
import ItemSkills from "./ItemSkills";

const StatImage = styled("img")({
  width: "auto",
  height: "90px",
  padding: "10px",
  // marginRight: "30px",
  background: "rgba(255, 255, 255, 0.05)",
  opacity: 0.8,
  borderRadius: "10px",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  marginBottom: 30,
});

const ItemDetail = ({ data, _handleReload }) => {
  const { setting, user } = useSelector((state) => state);
  const [skillSelected, setSkillSelected] = useState(null);
  const reducerConfig = setting.config;
  const { library } = setting;
  let paymentInfo = {};
  const [loadingActionButton, setLoadingActionButton] = useState(false);
  const { information } = user;

  useEffect(() => {
    setLoadingActionButton(true);
  }, [information]);

  useEffect(() => {
    setLoadingActionButton(false);
  }, [data]);

  if (reducerConfig && data.paymentContract) {
    paymentInfo = reducerConfig.contracts.find(
      (e) => e.contractAddress === data.paymentContract
    );
  }

  const renderPrice = () => {
    if (!data.isOwner || data.status === "LISTING") {
      return (
        <>
          <p>Price</p>
          <h2>
            {formatAmount(data.listingPrice)}{" "}
            <span>
              {data.paymentInformation && data.paymentInformation.symbol}
            </span>
          </h2>
        </>
      );
    } else {
      return (
        <>
          {" "}
          <p>Reference price:</p>
          <h2>
            {formatUSD(data.basePrice)} <span>{paymentInfo?.symbol}</span>
          </h2>
        </>
      );
    }
  };

  let oldType = "angel";
  let image = <Model3d name={data.name} height="100%" />;
  let statsComponent = (
    <img src={`${image_url}/stats_${data.name.toLowerCase()}.png`} alt="" />
  );
  if (data.type === "COSTUME") {
    oldType = "skin";
    image = (
      <img
        src={`${image_url}/body_${formatNftName(data.name)}.png?a=1`}
        alt=""
      />
    );
    statsComponent = (
      <>
        <h3>{`- Increase ${data.properties.stats.goldBonus}% gold in PVE/Boss`}</h3>
        <h3>{`- Increase ${data.properties.stats.expBonus}% exp`}</h3>
        <h3>{`- ${data.properties.stats.incBonus[0]}%~${data.properties.stats.incBonus[1]}% chance to get INC in PVE`}</h3>
        <h3>{`- ${data.properties.stats.methBonus}% chance to get Meth in PVE/Boss`}</h3>
      </>
    );
  }
  if (data.type === "MINION_PARTS") {
    oldType = "minion";
    image = (
      <img
        src={`${image_url}/body_${formatNftName(data.name)}.png?a=1`}
        alt=""
      />
    );
    statsComponent = (
      <>
        <h3>{`- Increase ${data.properties.stats.goldBonus}% gold in PVE/Boss`}</h3>
        <h3>{`- Increase ${data.properties.stats.expBonus}% exp`}</h3>
        <h3>{`- ${data.properties.stats.incBonus[0]}%~${data.properties.stats.incBonus[1]}% chance to get INC in PVE`}</h3>
        <h3>{`- ${data.properties.stats.methBonus}% chance to get Meth in PVE/Boss`}</h3>
      </>
    );
  }

  const _reload = () => {
    setLoadingActionButton(true);
    _handleReload();
  };

  let ActionButton = () => <div />;
  if (information) {
    if (loadingActionButton) {
      ActionButton = () => <CircularProgress size="29px" />;
    } else {
      if (data.status !== "IN_RESEARCHING") {
        if (data.isRenderBtnByOwner !== undefined) {
          if (data.isRenderBtnByOwner) {
            if (data.status === "LISTING") {
              ActionButton = () => (
                <DelistComponent data={data} _handleReload={_reload} />
              );
            } else {
              if (data.mintTxHash) {
                ActionButton = () => (
                  <ListingComponent
                    data={data}
                    _handleReload={_reload}
                    paymentInfo={paymentInfo}
                  />
                );
              } else {
                ActionButton = () => (
                  <MintComponent data={data} _handleReload={_reload} />
                );
              }
            }
          } else {
            if (data.status === "LISTING") {
              ActionButton = () => (
                <BuyComponent
                  data={data}
                  _handleReload={_reload}
                  paymentInfo={paymentInfo}
                />
              );
            }
          }
        } else {
          ActionButton = () => <CircularProgress size="29px" />;
        }
      }
    }
  }

  return (
    <>
      <Grid container spacing={2} className={`nft-${oldType}-detail`}>
        <Grid item xs={12} md={6}>
          <div className="identification">
            <Box
              sx={(theme) => ({
                display: "flex",
                [theme.breakpoints.down("lg")]: {
                  display: "block!important",
                },
              })}
              className="nft-id"
            >
              <Box width="fit-content">
                <CopyBox content={data.tokenId}>
                  <p>#{data.tokenId}</p>
                </CopyBox>
              </Box>
              <Box>
                <CopyBox content={data.ownerAddress}>
                  <p
                    className="nft-owner"
                    style={{
                      marginRight: 0,
                    }}
                  >
                    {library.OWNER}: {formatAddress(data.ownerAddress)}
                  </p>
                </CopyBox>
              </Box>
            </Box>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-start",
              }}
            >
              <div className="nft-name">
                <h1 className="custom-font">{data.name}</h1>
              </div>
              <TierDescription type={data.type.toLowerCase()}>
                <div className="nft-type">
                  <h3 className={`type-${data.level.toLowerCase()}`}>
                    {data.level.split("_").join(" ")}
                  </h3>
                </div>
              </TierDescription>
              {data.status === "IN_RESEARCHING" && (
                <div className="nft-type">
                  <h3 className={`type-${data.level.toLowerCase()}`}>
                    Researching
                  </h3>
                </div>
              )}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="impact">
            <div className="nft-price">{renderPrice()}</div>
            <div className="nft-impacting">
              <ActionButton />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6} style={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              right: 16,
              top: 32,
              zIndex: 1,
            }}
          >
            {data.type === "ANGEL" && (
              <CustomTooltip title={data.properties.class}>
                <StatImage
                  src={`${image_url}/class_${data.properties.class.toLowerCase()}.png`}
                  alt=""
                  // style={{ width: "50px" }}
                />
              </CustomTooltip>
            )}
            {data.type === "MINION_PARTS" && (
              <CustomTooltip title={data.properties.effect}>
                <StatImage
                  src={`${image_url}/effect_${data.properties.effect
                    .toLowerCase()
                    .split(" ")
                    .join("_")}.png`}
                  alt=""
                  // style={{ width: "50px" }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "";
                    currentTarget.className = "image-passive-skill-error";
                  }}
                />
              </CustomTooltip>
            )}
            {data.type === "COSTUME" && (
              <CustomTooltip title={data.properties.costumeEffect}>
                <StatImage
                  src={`${image_url}/effect_${data.properties.costumeEffect
                    .toLowerCase()
                    .split(" ")
                    .join("_")}.png`}
                  alt=""
                  // style={{ width: "50px" }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "";
                    currentTarget.className = "image-passive-skill-error";
                  }}
                />
              </CustomTooltip>
            )}
          </Box>
          <div className="shape">
            {image}
            {data.type === "ANGEL" ? (
              <h3 className="custom-font nft-level">Level {data.gameLevel}</h3>
            ) : (
              <h3 className="custom-font nft-battle">{`${
                data.maxBattle
                  ? `${formatAmount(data.maxBattle)} / ${formatAmount(
                      data.maxBattle
                    )}`
                  : 0
              } Battle`}</h3>
            )}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="statistical">
            {/* {data.type === "COSTUME" && (
              <StatImage
                alt=""
                src={`/images/effect-icons/${data.properties.costumeEffect
                  .toLowerCase()
                  .split(" ")
                  .join("_")}.png`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "";
                  currentTarget.className = "image-passive-skill-error";
                }}
              />
            )} */}
            <div className="stats">
              <h2 className="custom-font">Stats</h2>
              {statsComponent}
            </div>
            <div className="skills">
              <h2 className="custom-font">
                {data.type === "ANGEL"
                  ? "Skills"
                  : data.type === "COSTUME"
                  ? "Passive Skills"
                  : ""}
              </h2>
              <ItemSkills
                data={data}
                _onSelectSkill={(skill) => setSkillSelected(skill)}
              />
            </div>
          </div>
        </Grid>
      </Grid>

      {/* show video skill for angel */}
      <Modal
        open={skillSelected !== null}
        onClose={() => setSkillSelected(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="custom-modal-vk skill-review"
      >
        <div className="listing-popup">
          <Box
            sx={{
              border: "3px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              boxShadow: "0px 0px 10px #000",
              maxWidth: "60vw",
              minWidth: "60vw",
              overflow: "hidden",
            }}
          >
            {skillSelected && (
              <video
                src={`${image_url}/skill_video_${formatNftName(
                  data.name
                )}_${formatNftName(skillSelected)}.mp4`}
                autoPlay={true}
                muted={true}
                onEnded={() => setSkillSelected(null)}
              />
            )}
          </Box>

          <img
            src={`${image_url}/skill_${formatNftName(
              data.name
            )}_${formatNftName(skillSelected ? skillSelected : "")}.png`}
            alt=""
          />
        </div>
      </Modal>
    </>
  );
};

export default ItemDetail;

const MintComponent = ({ data, _handleReload }) => {
  const [showMintingPopup, setShowMintingPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const _handleMinNFT = () => {
    setLoading(true);
    setShowMintingPopup(false);
    post(
      `${EndpointConstant.NFT_MINT}?tokenId=${data.tokenId.toString()}`,
      null,
      () => {
        var temp = setInterval(() => {
          get(
            `${
              EndpointConstant.NFT_GET_BY_ID
            }?tokenId=${data.tokenId.toString()}`,
            (res) => {
              if (res.mintTxHash) {
                _handleReload();
                clearInterval(temp);
              }
            },
            (error) => {
              dispatch(_showAppError(error));
              setLoading(false);
              clearInterval(temp);
            }
          );
        }, 5000);
      },
      (error) => {
        dispatch(_showAppError(error));
        setLoading(false);
      }
    );
  };

  return AppConfig.has_minting ? (
    <>
      {!data.isLockMinting && !data.inDb && (
        <Button
          className="btn-listing"
          onClick={() => setShowMintingPopup(true)}
          disabled={loading}
        >
          {loading ? (
            <>
              <Typography mr={1}>Minting</Typography>
              <CircularProgress size="20px" />{" "}
            </>
          ) : (
            "Mint"
          )}
        </Button>
      )}
      <CustomBlueSmallModal
        open={showMintingPopup}
        _close={() => setShowMintingPopup(false)}
        isShowCloseButton={!loading}
      >
        <div className="listing-popup">
          <Typography variant="h6" className="custom-font">
            Are you sure for mint NFT #{data && data.tokenId} ?
          </Typography>
          <LoadingButton
            className="custom-btn custom-font mt-20"
            onClick={_handleMinNFT}
            loading={loading}
            fullWidth
          >
            {"Mint NFT"}
          </LoadingButton>
        </div>
      </CustomBlueSmallModal>
    </>
  ) : null;
};

const ListingComponent = ({ data, _handleReload, paymentInfo }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showListingPopup, setShowListingPopup] = useState(false);
  const [price, setPrice] = useState("");
  const { setting, user } = useSelector((state) => state);
  const reducerConfig = setting.config;
  const { walletAddress } = user;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!showListingPopup) {
      setPrice("");
    }
  }, [showListingPopup]);

  const _handleListing = (signature) => {
    post(
      EndpointConstant.MARKET_LISTING,
      {
        signature,
        data: {
          address: walletAddress,
          readablePrice: formatPrice(price, 4),
          message: {
            tokenId: data.tokenId.toString(),
            tokenContract: data.isOwner.contractAddress,
            price: utils
              .parseUnits(formatPrice(price, 4), paymentInfo.decimals)
              .toString(),
            decimals: paymentInfo.decimals,
            paymentContract: paymentInfo.contractAddress,
          },
        },
      },
      () => {
        setLoading(false);
        toast.success("Success");
        _handleReload();
      },
      (error) => {
        setLoading(false);
        dispatch(_showAppError(error));
      }
    );
  };

  const _sendSignalForChain = async (e) => {
    e.preventDefault();
    if (price) {
      if (parseFloat(price) >= data.minListingPrice) {
        setLoading(true);
        const message = {
          tokenId: data.tokenId.toString(),
          tokenContract: data.isOwner.contractAddress.toString(),
          price: utils
            .parseUnits(formatPrice(price, 4), paymentInfo.decimals)
            .toString(),
          decimals: paymentInfo.decimals,
          paymentContract: paymentInfo.contractAddress,
          foundationFeePercent: reducerConfig.foundationFeePercent,
        };
        var listingParams = AppConfig.BLOCKCHAIN.config.LISTING_PARAMS(message);
        listingParams.domain.verifyingContract =
          setting.config.marketplaceContract;
        try {
          const signature = await prefix.request({
            method: "eth_signTypedData_v4",
            params: [walletAddress, JSON.stringify(listingParams)],
          });
          _handleListing(signature);
        } catch (error) {
          setLoading(false);
        }
      } else {
        toast.error(
          `Please enter listing price greater than ${data.minListingPrice} ${paymentInfo.symbol}`
        );
      }
    } else {
      toast.error("Please enter your price");
    }
  };

  const _handleChangePrice = (e) => {
    const { value } = e.target;
    setPrice(value ? value.replace(/[^\d.]/g, "") : "");
  };

  return AppConfig.has_listing ? (
    <>
      <Button
        className="btn-listing"
        onClick={() => {
          data.status !== "IN_RESEARCHING"
            ? setShowListingPopup(true)
            : history.push("/research-institute/slot");
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size="29px" /> : "Listing"}
      </Button>
      <CustomBlueSmallModal
        open={showListingPopup}
        _close={() => setShowListingPopup(false)}
        isShowCloseButton={!loading}
      >
        {data && (
          <Box
            component={"form"}
            onSubmit={_sendSignalForChain}
            className="listing-popup"
            noValidate
          >
            <Typography variant="h6" className="custom-font">
              Desired price
            </Typography>
            <CustomNumberInput
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body1" className="custom-font">
                      {paymentInfo.symbol}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              fullWidth
              onChange={_handleChangePrice}
              value={price}
              className="custom-font"
              aria-describedby="outlined-weight-helper-text"
              disabled={loading}
            />
            <Box textAlign="left" mt={2}>
              <span>Reference price: </span>{" "}
              {`${formatUSD(data.basePrice)} ${paymentInfo.symbol}`}
            </Box>
            {data && (
              <Box textAlign="left">
                <span>Limit price: </span>{" "}
                {`${formatUSD(data.minListingPrice)} ${paymentInfo.symbol} ~ ${
                  data.maxListingPrice
                    ? formatUSD(data.maxListingPrice) + " " + paymentInfo.symbol
                    : "No Limit"
                }`}
              </Box>
            )}
            <Box display="flex">
              <LoadingButton
                className="custom-btn custom-font mt-20"
                loading={loading}
                fullWidth
                type="submit"
              >
                Listing
              </LoadingButton>
            </Box>
          </Box>
        )}
      </CustomBlueSmallModal>
    </>
  ) : null;
};

const DelistComponent = ({ data, _handleReload }) => {
  const [showDelistPopup, setShowDelistPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const _handleDelist = () => {
    setLoading(true);
    _delete(
      `${EndpointConstant.MARKET_DELIST}?tokenId=${data.tokenId}`,
      null,
      () => {
        toast.success(`NFT ${data.tokenId} is delist.`);
        setLoading(false);
        _handleReload();
        setShowDelistPopup(false);
      },
      (error) => {
        dispatch(_showAppError(error));
        setLoading(false);
      }
    );
  };

  return AppConfig.has_listing ? (
    <>
      <Button
        className="btn-delist custom-font"
        onClick={() => setShowDelistPopup(true)}
        disabled={loading}
      >
        {loading ? <CircularProgress size="29px" /> : "Delist"}
      </Button>
      <CustomBlueSmallModal
        open={showDelistPopup}
        _close={() => setShowDelistPopup(false)}
        isShowCloseButton={true}
      >
        <div className="listing-popup">
          <Typography variant="h6" className="custom-font">
            Are you sure for delist NFT #{data && data.tokenId} ?
          </Typography>
          <LoadingButton
            className="custom-btn custom-font mt-20"
            onClick={_handleDelist}
            loading={loading}
            fullWidth
          >
            Delist
          </LoadingButton>
        </div>
      </CustomBlueSmallModal>
    </>
  ) : null;
};

const CustomBox = styled(Box)(({ theme }) => ({
  textAlign: "left",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const BuyComponent = ({ data, _handleReload, paymentInfo }) => {
  const [loading, setLoading] = useState(false);
  const { setting, user } = useSelector((state) => state);
  const { library } = setting;
  const reducerConfig = setting.config;
  const { information, walletAddress } = user;
  const [showConfirm, setShowConfirm] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!showConfirm) {
      setIsApproved(false);
      setIsConfirmed(false);
    }
  }, [showConfirm]);

  const _handleErrorCallback = () => {
    setLoading(false);
  };

  const _handlePurchaseBox = () => {
    if (information) {
      const nftToken = data;
      const purchaseToken = reducerConfig.contracts.find(
        (e) => e.contractAddress === nftToken.paymentContract
      );
      setLoading(true);
      var nftTokenScPrice = parseUnits(
        nftToken.listingPrice.toString(),
        purchaseToken.decimals
      );
      checkBeforeBuy(
        reducerConfig.marketplaceContract,
        nftToken.paymentContract,
        nftTokenScPrice,
        walletAddress,
        _handleErrorCallback
      ).then((result) => {
        if (result) {
          setIsApproved(true);
          get(
            `${EndpointConstant.MARKET_ORDER_SC_INPUT}?tokenId=${nftToken.tokenId}`,
            (data) => {
              purchaseECR721(
                data,
                nftTokenScPrice,
                nftToken.paymentContract,
                reducerConfig,
                _handleErrorCallback
              ).then((e) => {
                getReceipt(e).then((result) => {
                  setLoading(false);
                  if (result) {
                    setIsConfirmed(true);
                    _handleReload();
                    toast.success("Success...!");
                    post(
                      `${EndpointConstant.MARKET_TRIGGER_PAIR_NFT}?txHash=${e}`,
                      {},
                      () => {},
                      () => {}
                    );
                  } else {
                    toast.error("Buy NFT item fail");
                  }
                });
              });
            },
            (error) => {
              setLoading(false);
              dispatch(_showAppError(error));
            }
          );
        }
      });
    } else {
      toast.error("Please sign-in for buy NFT.");
    }
  };

  return AppConfig.has_buy ? (
    <>
      <Button
        className={"btn-buy custom-font"}
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        {loading ? <CircularProgress size="29px" /> : "Buy"}
      </Button>
      <CustomSmallModal
        open={showConfirm}
        isShowCloseButton={!loading}
        _close={() => setShowConfirm(false)}
      >
        <Box textAlign={"left"}>
          <Typography mb={1} variant="h5">
            {library.CONFIRM_TRANSACTION}
          </Typography>
          <Divider />
          <Box my={2} display="flex" alignItems={"center"}>
            <img
              src={_getNFTImageLink(data.type, data.name, data.level)}
              width={70}
              alt={data.name}
            />
            <Box ml={2}>
              <Typography className="custom-font">{data.name}</Typography>
              <Typography variant="body2">
                Price: {formatNumberWithDecimal(data.listingPrice, 8)}{" "}
                {paymentInfo.symbol}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CustomBox mt={3}>
            <CustomBox
              sx={{
                justifyContent: "flex-start",
                opacity: isApproved ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon />
              <Typography ml={1} variant="body2">
                {library.APPROVED}
              </Typography>
            </CustomBox>
            <CustomBox
              sx={{
                justifyContent: "flex-start",
                opacity: isConfirmed ? 1 : 0.5,
              }}
            >
              <CheckCircleIcon />
              <Typography ml={1} variant="body2">
                {library.CONFIRMED}
              </Typography>
            </CustomBox>
          </CustomBox>

          <CustomLoadingButton
            loading={loading}
            onClick={_handlePurchaseBox}
            fullWidth
            sx={{ mt: 3 }}
          >
            {library.CONFIRM}
          </CustomLoadingButton>
        </Box>
      </CustomSmallModal>
    </>
  ) : null;
};
