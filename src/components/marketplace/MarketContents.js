import { SentimentVeryDissatisfied } from "@mui/icons-material";
import { Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import BaseCard from "../common/base-card/BaseCard";
import Loader from "../common/Loader";

const MarketContents = ({ data, nftType, onNftNameChange }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  if (data === null) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }

  const _renderLevelForFrameCharacter = (level) => {
    return level?.toLowerCase().replace("tier_", "");
  };

  if (data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "250px",
          height: "100%",
        }}
      >
        <SentimentVeryDissatisfied
          style={{ fontSize: 50, background: "#ff6363", borderRadius: 999 }}
        />
        Not record found
      </div>
    );
  }

  return (
    <div id="market-contents">
      <Container>
        <Grid container spacing={isSmall ? 2 : 6}>
          {data &&
            data.map((item, index) => (
              <Grid item xs={6} sm={6} md={4} key={index}>
                <BaseCard
                  key={index}
                  data={item}
                  frameType={_renderLevelForFrameCharacter(item.level)}
                  onNftNameChange={onNftNameChange}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
};

export default MarketContents;
