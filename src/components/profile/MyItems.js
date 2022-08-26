import {
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import BaseCard from "../common/base-card/BaseCard";

const menus = [
  { label: "ANGEL", type: "angel" },
  { label: "MINION_PARTS", type: "minion_parts" },
  { label: "COSTUME", type: "costume" },
];

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const MyItems = () => {
  const history = useHistory();
  let query = useQuery();
  const type = query.get("type");
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  return (
    <div className="my-items">
      <Container maxWidth="xl">
        <ul className="menu">
          {menus.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                history.push(`/profile/my-items?type=${item.label}`);
              }}
              className={`custom-font ${type === item.label ? "active" : ""}`}
            >
              {library[item.label]}
            </li>
          ))}
        </ul>
        <Divider className="mt-20" />
        <TabPanel />
      </Container>
    </div>
  );
};

export default MyItems;

const TabPanel = () => {
  const { user } = useSelector((state) => state);
  const { myItems } = user;
  let query = useQuery();
  const type = query.get("type");
  const [data, setData] = useState(null);
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  useEffect(() => {
    if (myItems) {
      setData(null);
      setTimeout(() => {
        const tempData = myItems.filter((e) => {
          return e.type.toLowerCase() === type.toLowerCase();
        });
        tempData.sort((a, b) => b.level.localeCompare(a.level));
        setData(tempData);
      }, 1000);
    }
  }, [myItems, type]);

  if (data === null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="body1" className="custom-font ml-10">
          loading
        </Typography>
      </div>
    );
  }

  const _renderLevelForFrameCharacter = (level) => {
    return level?.toLowerCase().replace("tier_", "");
  };

  return (
    <div className="my-item-contents mt-20">
      {data.length === 0 && (
        <Typography variant="h6">{library.NO_RECORDS_FOUND}</Typography>
      )}
      <Grid container spacing={6}>
        {data &&
          data.map((item, index) => (
            <Grid item xs={6} md={4} lg={3} key={index}>
              <BaseCard
                data={item}
                frameType={_renderLevelForFrameCharacter(item.level)}
                isOwner={true}
                key={index}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};
