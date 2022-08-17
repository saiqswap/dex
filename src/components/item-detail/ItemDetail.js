import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  Modal,
  OutlinedInput,
  styled,
  Typography,
} from "@mui/material";
import { utils } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { config } from "../../onchain/mainnet-config";
// import { config } from "../../onchain/testnet-config";
import {
  checkBeforeBuy,
  getReceipt,
  prefix,
  purchaseECR721,
} from "../../onchain/onchain";
import { image_url } from "../../settings";
import {
  formatAddress,
  formatAmount,
  formatPrice,
  formatUSD,
} from "../../settings/format";
import { get, post, _delete } from "../../utils/api";
import { formatNftName } from "../../utils/util";
import CopyBox from "../common/CopyBox";
import Model3d from "../common/Model3d";
import TierDescription from "../common/TierDescription";
import ItemSkills from "./ItemSkills";

const StatImage = styled("img")({
  width: "auto",
  height: "90px",
  padding: "10px",
  marginRight: "30px",
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

  if (reducerConfig) {
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
            {formatUSD(data.basePrice)} <span>{paymentInfo.symbol}</span>
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
                <BuyComponent data={data} _handleReload={_reload} />
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
            <div className="nft-id">
              <CopyBox content={data.tokenId}>
                <p>#{data.tokenId}</p>
              </CopyBox>
              <CopyBox content={data.ownerAddress}>
                <p className="nft-owner">
                  {library.OWNER}: {formatAddress(data.ownerAddress)}
                </p>
              </CopyBox>
            </div>
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
            </div>
            <div className="nft-class">
              {data.type === "ANGEL" && (
                <img
                  src={`${image_url}/class_${data.properties.class.toLowerCase()}.png`}
                  alt=""
                />
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
        <Grid item xs={12} md={6}>
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
            {data.type === "COSTUME" && (
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
            )}
            <div className="stats">
              <h2 className="custom-font">Stats</h2>
              {statsComponent}
            </div>
            <div className="skills">
              <h2 className="custom-font">
                {data.type === "ANGEL" ? "Skills" : "Passive Skills"}
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

  const _handleMinNFT = () => {
    setLoading(true);
    setShowMintingPopup(false);
    post(
      `/nft/mint?tokenId=${data.tokenId.toString()}`,
      null,
      () => {
        var temp = setInterval(() => {
          get(
            `/nft/get-by-id?tokenId=${data.tokenId.toString()}`,
            (res) => {
              if (res.mintTxHash) {
                _handleReload();
                clearInterval(temp);
              }
            },
            () => {
              toast.error("Listing failed");
              setLoading(false);
              clearInterval(temp);
            }
          );
        }, 5000);
      },
      () => {
        toast.error("Listing failed");
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Button
        className="btn-listing"
        onClick={() => setShowMintingPopup(true)}
        disabled={loading}
      >
        {loading ? <CircularProgress size="29px" /> : "Minting"}
      </Button>
      <Modal
        open={showMintingPopup}
        onClose={() => setShowMintingPopup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="custom-modal-vk"
      >
        <div className="listing-popup">
          <Typography variant="h6" className="custom-font">
            Are you sure for mint NFT #{data && data.tokenId} ?
          </Typography>
          <LoadingButton
            className="custom-btn custom-font mt-20"
            onClick={_handleMinNFT}
            loading={loading}
          >
            {loading ? "" : "Mint NFT"}
          </LoadingButton>
        </div>
      </Modal>
    </>
  );
};

const ListingComponent = ({ data, _handleReload, paymentInfo }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showListingPopup, setShowListingPopup] = useState(false);
  const [price, setPrice] = useState("");
  const { setting, user } = useSelector((state) => state);
  const reducerConfig = setting.config;
  const { walletAddress } = user;

  const _handleListing = (signature) => {
    post(
      "/market/listing",
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
        toast.success("success");
        _handleReload();
        setLoading(false);
        setPrice("");
      },
      () => {
        toast.error("listing failed");
        setLoading(false);
      }
    );
  };

  const _sendSignalForChain = async () => {
    if (price) {
      setShowListingPopup(false);
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
      var listingParams = config.LISTING_PARAMS(message);
      listingParams.domain.verifyingContract =
        setting.config.marketplaceContract;

      const signature = await prefix.request({
        method: "eth_signTypedData_v4",
        params: [walletAddress, JSON.stringify(listingParams)],
      });
      _handleListing(signature);
      setLoading(true);
    } else {
      toast.error("Please enter your price");
    }
  };

  const _handleChangePrice = (e) => {
    const { value } = e.target;
    setPrice(value ? value.replace(/[^\d.]/g, "") : "");
  };

  return (
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
      <Modal
        open={showListingPopup}
        onClose={() => setShowListingPopup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="custom-modal-vk"
      >
        {data && (
          <div className="listing-popup">
            <Typography variant="h6" className="custom-font">
              Desired price
            </Typography>
            <FormControl variant="outlined">
              <OutlinedInput
                className="custom-font input"
                value={price}
                onChange={_handleChangePrice}
                endAdornment={
                  <InputAdornment position="end">
                    <Typography variant="body1" className="custom-font">
                      {paymentInfo.symbol}
                    </Typography>
                  </InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
              />
            </FormControl>
            <p>
              <span>Reference price: </span>{" "}
              {`${formatUSD(data.basePrice)} ${paymentInfo.symbol}`}
            </p>
            {data && (
              <p className="m-0">
                <span>Limit price: </span>{" "}
                {`${formatUSD(data.minListingPrice)} ${paymentInfo.symbol} ~ ${
                  data.maxListingPrice
                    ? formatUSD(data.maxListingPrice) + " " + paymentInfo.symbol
                    : "No Limit"
                }`}
              </p>
            )}
            <LoadingButton
              className="custom-btn custom-font mt-20"
              onClick={_sendSignalForChain}
              loading={loading}
            >
              {loading ? "" : "Listing"}
            </LoadingButton>
          </div>
        )}
      </Modal>
    </>
  );
};

const DelistComponent = ({ data, _handleReload }) => {
  const [showDelistPopup, setShowDelistPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const _handleDelist = () => {
    setLoading(true);
    setShowDelistPopup(false);
    _delete(
      `/market/delist?tokenId=${data.tokenId}`,
      null,
      () => {
        toast.success(`NFT ${data.tokenId} is delist.`);
        setLoading(false);
        _handleReload();
      },
      (error) => console.log(error)
    );
  };

  return (
    <>
      <Button
        className="btn-delist custom-font"
        onClick={() => setShowDelistPopup(true)}
        disabled={loading}
      >
        {loading ? <CircularProgress size="29px" /> : "Delist"}
      </Button>
      <Modal
        open={showDelistPopup}
        onClose={() => setShowDelistPopup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="custom-modal-vk"
      >
        <div className="listing-popup">
          <Typography variant="h6" className="custom-font">
            Are you sure for delist NFT #{data && data.tokenId} ?
          </Typography>
          <LoadingButton
            className="custom-btn custom-font mt-20"
            onClick={_handleDelist}
            loading={loading}
          >
            {loading ? "" : "Delist"}
          </LoadingButton>
        </div>
      </Modal>
    </>
  );
};

const BuyComponent = ({ data, _handleReload }) => {
  const [loading, setLoading] = useState(false);
  const { setting, user } = useSelector((state) => state);
  const reducerConfig = setting.config;
  const { information, walletAddress } = user;

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
          get(
            `/market/order-sc-input?tokenId=${nftToken.tokenId}`,
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
                    _handleReload();
                    toast.success("Success...!");
                    post(
                      `/market/trigger-paid-nft?txHash=${e}`,
                      {},
                      (data) => {
                        console.log(data);
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
                  } else {
                    toast.error("Buy NFT item fail");
                  }
                });
              });
            },
            (error) => {
              console.log(error);
              toast.error(error.msg);
              setLoading(false);
            }
          );
        }
      });
    } else {
      toast.error("Please sign-in for buy NFT.");
    }
  };
  return (
    <>
      <Button
        className={"btn-buy custom-font"}
        onClick={_handlePurchaseBox}
        disabled={loading}
      >
        {loading ? <CircularProgress size="29px" /> : "Buy"}
      </Button>
    </>
  );
};
