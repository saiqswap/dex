import {
  Box,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { image_url } from "../../../settings";
import {
  formatAmount,
  _formatNameToLink,
  _getNFTImageLink,
} from "../../../settings/format";
import "./base-card.scss";

const CustomClassImage = styled("img")(({ theme }) => ({
  width: "2.5em",
  [theme.breakpoints.down("sm")]: {
    width: "2em",
  },
}));

export default function BaseCard({
  data,
  frameType,
  onNftNameChange,
  button,
  isOwner,
}) {
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();

  const onMouseMove = (e, name) => {
    if (onNftNameChange) {
      onNftNameChange(null);
      setTimeout(() => {
        onNftNameChange(name);
      }, 200);
    }
  };
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      className="new-base-card"
      onClick={() => history.push(`/nft/${data.tokenId}`)}
      onMouseEnter={(e) => onMouseMove(e, data.name)}
    >
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
            }}
            fontWeight={700}
          >
            {data.name}
          </Typography>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={isSmall ? 3 : 3.5}
        py={isSmall ? 3 : 4}
        sx={{
          position: "relative",
          background: `url("/images/marketplace/${data.level}.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          left: "4px",
          visibility: loaded ? "visible" : "hidden",
        }}
      >
        {data.listingPrice > 0 && !isOwner ? (
          <div className="character-price">
            <Typography variant="body1" className="custom-font">
              {formatAmount(data.listingPrice)}{" "}
              {data.paymentInformation && (
                <span>{data.paymentInformation.symbol}</span>
              )}
            </Typography>
          </div>
        ) : (
          <div className="character-price">
            <Typography variant="body1" className="custom-font"></Typography>
          </div>
        )}
        <Box height={40}></Box>
        {/* <Box>
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
        </Box> */}
      </Box>
    </Box>
  );
}
