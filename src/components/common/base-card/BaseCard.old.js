import { Box, Hidden, Typography, styled } from "@mui/material";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { image_url } from "../../../settings";
import { formatAmount, _formatNameToLink } from "../../../settings/format";
import { formatNftName } from "../../../utils/util";
import CopyBox from "../CopyBox";
import "./base-card.scss";

const CustomClassImage = styled("img")(({ theme }) => ({
  width: 40,
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

  return (
    <Box className="new-base-card">
      <Box position="relative">
        <img
          src={`${image_url}/nft_${data.type.toLowerCase()}_${formatNftName(
            data.name
          )}_${data.level.replace("_", "").toLowerCase()}.png`}
          alt="thumbnail"
          style={{
            width: "calc(100% + 4px)",
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
        px={2}
        py={1}
      >
        {data.listingPrice > 0 && !isOwner && (
          <div className="character-price">
            <Typography variant="body1" className="custom-font">
              {formatAmount(data.listingPrice)}{" "}
              {data.paymentInformation && (
                <span>{data.paymentInformation.symbol}</span>
              )}
            </Typography>
          </div>
        )}
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
