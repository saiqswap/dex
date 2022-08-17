import { PlayCircleOutline } from "@mui/icons-material";
import { Icon } from "@mui/material";
import React from "react";
import { image_url } from "../../settings";
import { formatNftName } from "../../utils/util";

const MinionSkill = ({ data }) => {
  return (
    <div className="passive-skill">
      <div>
        <img
          src={`${image_url}/effect_${data.properties.effect
            .toLowerCase()
            .split(" ")
            .join("_")}.png`}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "";
            currentTarget.className = "image-passive-skill-error";
          }}
        />
      </div>
    </div>
  );
};

const SkinPassiveSkin = ({ data }) => {
  return (
    <div className="passive-skill">
      <div style={{ justifyContent: "flex-start" }}>
        <div>
          {data.properties.passiveSkills.map((item, i) => (
            <h3
              style={{
                color: "#f77d44",
              }}
              key={i}
            >{`- ${item}`}</h3>
          ))}
        </div>
      </div>
    </div>
  );
};

const AngelSkill = ({ data, _onSelectSkill }) => {
  return (
    <>
      <ul className="angel-skill">
        {data.properties.skills.map((item, index) => (
          <li key={index} onClick={() => _onSelectSkill(item)}>
            <img
              src={`${image_url}/skill_${formatNftName(
                data.name
              )}_${formatNftName(item)}.png`}
              alt=""
            />
            <img src="/images/summon/light-1.gif" className="light" alt="" />
            <Icon className="icon-play">
              <PlayCircleOutline />
            </Icon>
          </li>
        ))}
      </ul>
    </>
  );
};

export default function ItemSkills({ data, _onSelectSkill }) {
  if (data.type === "COSTUME") return <SkinPassiveSkin data={data} />;
  if (data.type === "MINION_PARTS") return <MinionSkill data={data} />;
  return <AngelSkill data={data} _onSelectSkill={_onSelectSkill} />;
}
