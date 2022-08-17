import { Category, Inbox, Science, Storefront } from "@mui/icons-material";
import { Grid } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const menus = [
  {
    title: "MARKETPLACE",
    url: ["/marketplace"],
    icon: <Storefront fontSize="small" />,
  },
  {
    title: "BOXES",
    url: ["/boxes"],
    icon: <Inbox fontSize="small" />,
  },
  {
    title: "SUMMON",
    url: ["/summon"],
    isLogged: true,
    icon: <Category fontSize="small" />,
  },
  {
    title: "R - I",
    url: [
      "/research-institute/R-I",
      "/research-institute/slot",
      "/research-institute/history",
    ],
    isLogged: true,
    icon: <Science fontSize="small" />,
  },
];

const BottomMenu = () => {
  return (
    <div id="bottom-menu">
      <Grid
        container
        alignItems="center"
        style={{ width: "100%", background: "var(--main-color)" }}
      >
        {menus.map(
          (item, index) =>
            (!item.isLogged || (item.isLogged && isLoggedIn())) && (
              <Link
                to={item.url[0]}
                key={index}
                style={{
                  width: `calc(100% / ${!isLoggedIn() ? 2 : 4})`,
                }}
                className={`${
                  item.url.includes(window.location.pathname) && "active"
                }`}
              >
                <Grid
                  item
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <div style={{ marginBottom: "5px" }}>{item.icon}</div>
                  {item.title}
                </Grid>
              </Link>
            )
        )}
      </Grid>
    </div>
  );
};

export default BottomMenu;
