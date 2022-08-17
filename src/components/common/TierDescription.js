import { Tooltip } from "@mui/material";
import React from "react";
import {
  tierAngelDescription,
  tierCostumeDescription,
  tierMinionPartDescription,
} from "../../settings/constants";

const menus = [
  {
    type: "angel",
    description: tierAngelDescription,
  },
  {
    type: "minion_parts",
    description: tierMinionPartDescription,
  },
  {
    type: "costume",
    description: tierCostumeDescription,
  },
];
const TierDescription = ({ type, children }) => {
  return (
    <Tooltip
      placement="right-start"
      title={
        <>
          {menus.map((menu, index) => (
            <div className="tier-description" key={index}>
              {menu.type === type &&
                menu.description.map((des, index) => (
                  <div key={index}>{des}</div>
                ))}
            </div>
          ))}
        </>
      }
    >
      {children}
    </Tooltip>
  );
};

export default TierDescription;
