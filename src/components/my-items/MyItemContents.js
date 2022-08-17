import { SentimentVeryDissatisfied } from "@mui/icons-material";
import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { image_url } from "../../settings";
import { formatNftName } from "../../utils/util";
import AngelGrade from "../marketplace/AngelGrade";

const MyItemContents = ({ type, checkedList, searchKey, data }) => {
  if (checkedList && checkedList.length > 0) {
    data = data.filter((e) => {
      return checkedList.includes(e.name.toLowerCase());
    });
  }

  if (data === null) {
    return (
      <div className="loader">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  data = data.filter((e) => {
    return e.status === "ACTIVE";
  });

  data = data.filter((e) => {
    return e.type === type;
  });

  if (data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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

  if (searchKey && searchKey.length > 0) {
    data = data.filter((item) => {
      return item.tokenId && item.tokenId.toString().includes(searchKey);
    });
  }

  return (
    <div id="my-item-contents">
      <Container>
        <Grid container spacing={2}>
          {data &&
            data.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Link to={`/nft/${item.tokenId}`}>
                  <div className={`nft-card ${item.type.toLowerCase()}`}>
                    <Grid container style={{ height: "100%" }}>
                      <Grid item xs={12}>
                        <div className="nft-info-top">
                          <div>
                            <div className="nft-id">#{item.tokenId}</div>
                            {type === "MINION_PARTS" && (
                              <Typography variant="caption">
                                Level: {item.level}
                              </Typography>
                            )}
                          </div>
                          <div>
                            <div className="nft-class">
                              <img
                                src="./images/character/class/class_01.png"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className="nft-character">
                          <img
                            src={`${image_url}/body_${formatNftName(item.name)}.png`}
                            alt=""
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className="nft-info-bottom">
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography variant="caption">
                            {item.description}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                    <AngelGrade angel={item} />
                  </div>
                </Link>
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
};

export default MyItemContents;
