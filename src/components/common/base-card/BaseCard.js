import { Hidden, Typography } from "@mui/material";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { image_url } from "../../../settings";
import { formatBigNumber } from "../../../settings/format";
import { formatNftName } from "../../../utils/util";
import CopyBox from "../CopyBox";
import "./base-card.scss";

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
    <div
      className={`base-card ${data.type.toLowerCase()} ${
        isOwner ? "owner" : ""
      } ${data.status.toLowerCase()} ${data.level?.toLowerCase()} `}
      // onMouseEnter={(e) => onMouseMove(e, data.name)}
      onClick={() => history.push(`/nft/${data.tokenId}`)}
    >
      <div className="light" />
      <img
        src={`/images/character/frame-character-type-${frameType}${
          isOwner ? "-1" : ""
        }.png`}
        onLoadCapture={() => setLoaded(true)}
        alt="base card"
        width="100%"
      />
      <div className="base-light">
        <img
          src={`/images/character/frame-character-type-${frameType}-2.png`}
          alt="base-light"
          width="100%"
        />
      </div>
      <div className="base-light delay">
        <img
          src={`/images/character/frame-character-type-${frameType}-2.png`}
          alt="base-light"
          width="100%"
        />
      </div>
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
      {loaded && (
        <div className="content">
          <img
            src={`${image_url}/${
              data.type === "COSTUME" ? "body" : "thumbnail"
            }_${formatNftName(data.name)}.png`}
            alt="thumbnail"
            className="thumbnail"
          />
          {data.level && (
            <div className="character-level">
              <Hidden smDown>
                <Typography variant="body2" className="custom-font">
                  {data.level.toLowerCase().replace("_", " ")}
                </Typography>
              </Hidden>
            </div>
          )}

          {data.tokenId && (
            <div className="character-id" onClick={(e) => e.stopPropagation()}>
              <Hidden smDown>
                <CopyBox content={data.tokenId}>
                  <Typography variant="caption">#{data.tokenId}</Typography>
                </CopyBox>
              </Hidden>
            </div>
          )}

          {data.name && (
            <div className="character-name">
              <Typography variant="body1" className="custom-font">
                {data.name}
              </Typography>
            </div>
          )}

          {data.listingPrice > 0 && !isOwner && (
            <div className="character-price">
              <Typography variant="body1" className="custom-font">
                {formatBigNumber(data.listingPrice)}{" "}
                {data.paymentInformation && (
                  <span>{data.paymentInformation.symbol}</span>
                )}
              </Typography>
            </div>
          )}

          {button && <div className="character-btn">{button}</div>}

          {data.properties.class && (
            <img
              src={`${image_url}/class_${data.properties.class.toLowerCase()}.png`}
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
            <img
              src={`${image_url}/effect_${data.properties.effect
                .toLowerCase()
                .split(" ")
                .join("_")}.png`}
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
            <img
              src={`${image_url}/effect_${data.properties.costumeEffect
                .toLowerCase()
                .split(" ")
                .join("_")}.png`}
              className="character-class"
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "";
                currentTarget.className = "character-class-none";
              }}
            />
          )}

          {data.gameLevel > 0 && data.type.toLowerCase() === "angel" && (
            <div className="character-game_level">
              <Typography variant="caption" className="custom-font">
                {`Lv. ${data.gameLevel}`}
              </Typography>
            </div>
          )}

          {data.maxBattle && (
            <div className="character-game_level">
              <Typography variant="caption" className="custom-font">
                {`B. ${data.maxBattle}`}
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
