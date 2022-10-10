import { CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { _getNFTImageLink } from "../settings/format";

export default function AvailableTemplates({ boxType }) {
  const { setting } = useSelector((state) => state);
  const { templates } = setting;
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    if (boxType && templates) {
      let tempData;
      tempData = templates.filter((x) =>
        boxType.toLowerCase().includes(x.type.toLowerCase())
      );
      tempData.sort((a, b) =>
        a.level.toLowerCase().localeCompare(b.level.toLowerCase())
      );
      setAvailable(tempData);
    }
  }, [boxType, templates]);

  return (
    <>
      <Typography className="custom-font" textAlign={"left"} mt={2} mb={1}>
        Available:{" "}
        {available && (
          <span>{`${available.length} ${
            available[0]
              ? available[0].type.toLowerCase().replace("_", " ")
              : ""
          }${available[0]?.type.toLowerCase() === "angel" ? "s" : ""}`}</span>
        )}
      </Typography>
      {available ? (
        <ul>
          {available.map((item, index) => (
            <li className={item.level.toLowerCase()} key={index}>
              <img
                src={_getNFTImageLink(item.type, item.name, item.level)}
                alt=""
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul style={{ justifyContent: "center", opacity: 0.2 }}>
          <CircularProgress />
        </ul>
      )}
    </>
  );
}
