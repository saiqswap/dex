import VerifiedTwoToneIcon from "@mui/icons-material/VerifiedTwoTone";
import { Box, styled, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { image_url } from "../../../settings";
import {
  formatAmount,
  _formatNameToLink,
  _getNFTImageLink,
} from "../../../settings/format";
import "./base-card.scss";
const CustomClassImage = styled("img")(({ theme }) => ({
  width: "3.4em",
  paddingTop: "0.5em",
  marginRight: "0.1em",

  [theme.breakpoints.down("sm")]: {
    width: "9vw!important",
    marginRight: "0!important",
  },

  [theme.breakpoints.down("md")]: {
    marginRight: "0.5vw",
  },
  [theme.breakpoints.down("lg")]: {
    // width: "2.7em",
    // paddingRight: "0.5em",
  },
  [theme.breakpoints.up("lg")]: {
    width: "2.6em",
    paddingRight: "0",
  },
}));

export default function BaseCard({ data, onNftNameChange, isOwner }) {
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();
  const { setting } = useSelector((state) => state);
  const { config } = setting;
  const [paymentInformation, setPaymentInformation] = useState(null);

  useEffect(() => {
    if (config) {
      const temp = config?.contracts?.find(
        (contract) => contract.contractAddress === data.paymentContract
      );
      setPaymentInformation(temp);
    }
  }, [config, data]);

  const onMouseMove = (e, name) => {
    if (onNftNameChange) {
      onNftNameChange(null);
      setTimeout(() => {
        onNftNameChange(name);
      }, 200);
    }
  };

  return (
    <Box
      className="new-base-card"
      onClick={() => history.push(`/details/${data.tokenId}`)}
      onMouseEnter={(e) => onMouseMove(e, data.name)}
    >
      {data.status === "LISTING" && isOwner && (
        <div className="base-card-status">
          <p>Is being listed</p>
        </div>
      )}
      {data.status === "IN_RESEARCHING" && isOwner && (
        <div className="base-card-status">
          <p>Is searching</p>
        </div>
      )}
      <Box position="relative">
        <img
          src={_getNFTImageLink(data.type, data.name, data.level)}
          alt="thumbnail"
          onLoadCapture={() => setLoaded(true)}
          style={{
            width: "calc(100% + 4px)",
            visibility: loaded ? "visible" : "hidden",
          }}
        />
        {data.name && (
          <Typography
            variant="body2"
            className="custom-font"
            sx={{
              position: "absolute",
              bottom: "5px",
              left: "25px",
              visibility: loaded ? "visible" : "hidden",
              display: "flex",
              alignItems: "center",
            }}
            fontWeight={700}
          >
            {data.name}
            {data.mintTxHash && (
              <VerifiedTwoToneIcon
                fontSize="small"
                sx={{
                  path: {
                    color: `var(--angel-${data.level
                      .toLowerCase()
                      .replace("tier", "type")
                      .replace("_", "-")})`,
                  },
                }}
              />
            )}
          </Typography>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        // px={isSmall ? 3 : 1%}
        // py={isSmall ? 3 : }
        sx={{
          position: "relative",
          background: `url("/images/marketplace/${data.level}.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          left: "4px",
          visibility: loaded ? "visible" : "hidden",
          padding: "13%",
        }}
      >
        {data.listingPrice > 0 ? (
          <div className="character-price">
            <Typography variant="body1" className="custom-font">
              {formatAmount(data.listingPrice)}{" "}
              {paymentInformation && <span>{paymentInformation.symbol}</span>}
            </Typography>
          </div>
        ) : (
          <div className="character-price">
            <Typography variant="body1" className="custom-font"></Typography>
          </div>
        )}
        <Box height={40}></Box>
        <Box>
          {data.properties.class && (
            <CustomClassImage
              src={`${image_url}/class_${_formatNameToLink(
                data.properties.class
              )}.png`}
              className="character-class"
              alt="class"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "";
                currentTarget.className = "character-class-none";
              }}
            />
          )}

          {data.properties.effect && (
            <CustomClassImage
              src={`${image_url}/effect_${_formatNameToLink(
                data.properties.effect
              )}.png`}
              className="character-class"
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "";
                currentTarget.className = "character-class-none";
              }}
            />
          )}
          {data.properties.costumeEffect && (
            <CustomClassImage
              src={`${image_url}/effect_${_formatNameToLink(
                data.properties.costumeEffect
              )}.png`}
              className="character-class"
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "";
                currentTarget.className = "character-class-none";
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
