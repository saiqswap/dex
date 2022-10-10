import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { image_url } from "../../settings";
import "../../styles/summon-effect.scss";
import { formatNftName } from "../../utils/util";
import { formatAmount, _formatNameToLink } from "../../settings/format";

const SummonEffect = ({ open, data, boxImage, showInfo }) => {
  const [opening, setOpening] = useState(false);
  const [hideBox, setHideBox] = useState(false);

  useEffect(() => {
    if (open === true) {
      setOpening(true);
      setTimeout(() => {
        setHideBox(false);
      }, 1);
      setTimeout(() => {
        setOpening(false);
      }, 7000);
      setTimeout(() => {
        setHideBox(true);
      }, 6000);
    }
  }, [open]);

  useEffect(() => {
    setOpening(false);
    setHideBox(false);
  }, [boxImage]);

  return (
    <div className="summon-effect">
      {data && open && showInfo && (
        <Typography
          variant="h3"
          className={`custom-font angel-name ${data.nft.level.toLowerCase()}`}
        >
          {data.nft.name}
          <span className="lv">{data.nft.level.replace("_", " ")}</span>
        </Typography>
      )}
      {!hideBox && (
        <>
          {boxImage && (
            <div className={`box-image ${opening ? "active" : ""}`}>
              <img src={boxImage.image} alt="boxImg" />
            </div>
          )}
        </>
      )}
      <img src="/images/summon/stage_1.png" className="standing" alt="" />
      <img src="/images/summon/light-2.png" className="stand-light" alt="" />
      <div className={`stand-1 ${opening ? "active" : ""}`}>
        <img src="/images/summon/summon_1.png" className="summon-1" alt="" />
        <div className={`${opening ? "active" : ""}`}></div>
      </div>
      <div className={`stand-2 ${opening ? "active" : ""}`}>
        <img src="/images/summon/summon_2.png" className="summon-2" alt="" />
      </div>
      {open && (
        <>
          <div className="light">
            <img src="/images/summon/light.png" className="light" alt="" />
          </div>
          <div className="light-1">
            <img src="/images/summon/light-1.gif" alt="" />
            <img src="/images/summon/light-1.gif" alt="" />
            <img src="/images/summon/light-1.gif" alt="" />
          </div>
          <div className="character">
            {!data || !showInfo ? (
              <img src="/images/character/character.png" alt="" />
            ) : (
              <>
                <img
                  src={`${image_url}/body_${
                    data && data.nft ? _formatNameToLink(data.nft.name) : ""
                  }.png?a=1`}
                  alt=""
                />
              </>
            )}
          </div>
        </>
      )}

      {data && open && data.nft && showInfo && (
        <>
          {data.nft.type === "ANGEL" && (
            <>
              <img
                src={`${image_url}/stats_${data.nft.name.toLowerCase()}.png`}
                className="stat"
                alt=""
              />
              <span className="ingame-lv custom-font">
                Level {data.nft.gameLevel}
              </span>
              <img
                src={`${image_url}/class_${data.nft.properties.class.toLowerCase()}.png`}
                className="angel-class"
                alt=""
              />
              <ul className="angel-skill">
                {data.nft.properties.skills.map((item, index) => (
                  <li key={index}>
                    <img
                      alt=""
                      src={`${image_url}/skill_${formatNftName(
                        data.nft.name
                      )}_${formatNftName(item)}.png`}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
          {data.nft.type === "MINION_PARTS" && (
            <>
              <img
                alt=""
                className="minion-skill"
                src={`${image_url}/effect_${data.nft.properties.effect
                  .toLowerCase()
                  .split(" ")
                  .join("_")}.png`}
              />
              <span className="minion-battle custom-font">
                Battle: {formatAmount(data.nft.maxBattle)}
              </span>
              <div className="minion-stat">
                <Typography variant="h6">{`- Increase ${data.nft.properties.stats.goldBonus}% gold in PVE/Boss`}</Typography>
                <Typography variant="h6">{`- Increase ${data.nft.properties.stats.expBonus}% exp`}</Typography>
                <Typography variant="h6">{`- ${data.nft.properties.stats.incBonus[0]}%~${data.nft.properties.stats.incBonus[1]}% chance to get INC in PVE`}</Typography>
                <Typography variant="h6">{`- ${data.nft.properties.stats.methBonus}% chance to get Meth in PVE/Boss`}</Typography>
              </div>
            </>
          )}
          {data.nft.type === "COSTUME" && (
            <>
              <img
                alt=""
                className="minion-skill"
                src={`${image_url}/effect_${data.nft.properties.costumeEffect
                  .toLowerCase()
                  .split(" ")
                  .join("_")}.png`}
              />
              <span className="minion-battle custom-font">
                Battle: {formatAmount(data.nft.maxBattle)}
              </span>
              <div className="minion-stat">
                <Typography variant="h6">{`- Increase ${data.nft.properties.stats.goldBonus}% gold in PVE/Boss`}</Typography>
                <Typography variant="h6">{`- Increase ${data.nft.properties.stats.expBonus}% exp`}</Typography>
                <Typography variant="h6">{`- ${data.nft.properties.stats.incBonus[0]}%~${data.nft.properties.stats.incBonus[1]}% chance to get INC in PVE`}</Typography>
                <Typography variant="h6">{`- ${data.nft.properties.stats.methBonus}% chance to get Meth in PVE/Boss`}</Typography>
              </div>
              <div className="passive-skill">
                {data.nft.properties.passiveSkills.map((item, i) => (
                  <Typography variant="h6" key={i}>{`- ${item}`}</Typography>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SummonEffect;
