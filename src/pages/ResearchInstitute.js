import { Box } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import History from "../components/research/History";
import NewRI from "../components/research/NewRI";
import RISpecialRooms from "../components/research/RISpecialRooms";
import Rooms from "../components/research/Rooms";
import { _getRICountdown } from "../store/actions/riActions";
import "../styles/research-page.scss";

const menus = [
  { label: "R-I", key: "R-I", url: "/research-institute/R-I" },
  { label: "Slot", key: "slot", url: "/research-institute/slot" },
  { label: "History", key: "history", url: "/research-institute/history" },
];

const ResearchInstitute = () => {
  const { comp } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(_getRICountdown());
  }, [dispatch]);

  return (
    <div id="research-page">
      <div className="research-banner"></div>
      <ul className="menu">
        {menus.map((item, index) => (
          <Link
            key={index}
            to={item.url}
            className={`custom-font ${comp === item.key && "active"}`}
          >
            <li>{item.label}</li>
          </Link>
        ))}
      </ul>
      <Box mt={6}>
        <RenderContent component={comp} />
      </Box>
    </div>
  );
};

export default ResearchInstitute;

const RenderContent = ({ component }) => {
  const { user, riStore } = useSelector((state) => state);
  const { myItems, information } = user;

  const Routes = {
    "R-I": <NewRI />,
    slot: information ? (
      information.isRIFactory ? (
        <RISpecialRooms />
      ) : (
        <Rooms />
      )
    ) : (
      <div />
    ),
    history: <History />,
  };

  return Routes[component] ? Routes[component] : null;
};
