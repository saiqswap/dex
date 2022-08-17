import { FilterAlt } from "@mui/icons-material";
import { Box, Button, Container, Grid, Hidden, Tab, Tabs } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import FilterBox from "../components/common/FilterBox";
import MarketContents from "../components/marketplace/MarketContents";
import { image_url } from "../settings";
import "../styles/new-marketplace.scss";
import { post } from "../utils/api";
import { formatNftName } from "../utils/util";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const filtersAngel = [
  {
    title: "Generals",
    key: "name",
    options: [
      {
        label: "Alice",
        img: `${image_url}/avatar_alice.png`,
        key: "alice",
      },
      {
        label: "Ceci",
        img: `${image_url}/avatar_ceci.png`,
        key: "ceci",
      },
      {
        label: "Bestie",
        img: `${image_url}/avatar_bestie.png`,
        key: "bestie",
      },
      {
        label: "Emily",
        img: `${image_url}/avatar_emily.png`,
        key: "emily",
      },
      {
        label: "Dasha",
        img: `${image_url}/avatar_dasha.png`,
        key: "dasha",
      },
    ],
  },
  {
    title: "Tier",
    key: "level",
    options: [
      { label: "Tier 1", key: "tier_1" },
      { label: "Tier 2", key: "tier_2" },
      { label: "Tier 3", key: "tier_3" },
      { label: "Tier 4", key: "tier_4" },
      { label: "Tier 5", key: "tier_5" },
    ],
  },
];

const filtersSkinOrMinion = [
  {
    title: "Grade",
    key: "type",
    options: [
      { label: "Tier 1", key: "tier_1" },
      { label: "Tier 2", key: "tier_2" },
      { label: "Tier 3", key: "tier_3" },
      { label: "Tier 4", key: "tier_4" },
      { label: "Tier 5", key: "tier_5" },
    ],
  },
];

export default function Marketplace() {
  let query = useQuery();
  let nftType = query.get("type");
  const [filters, setFilters] = useState(null);
  const [selectedName, setSelectedName] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const { setting } = useSelector((state) => state);
  const { config } = setting;
  const [mounted, setMounted] = useState(true);
  const [items, setItems] = useState(null);
  const [itemStore, setItemStore] = useState(null);
  const [sortKey, setSortKey] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [nftName, setNftName] = useState("angel");
  const [open, setOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (
      !nftType ||
      !["angel", "costume", "minion_parts"].includes(nftType.toLowerCase())
    ) {
      history.push(`/marketplace?type=angel`);
    }
  }, [history, nftType]);

  const handleClearFilter = () => {
    setFilters(null);
    setSelectedName([]);
    setSelectedLevel([]);
    setSortKey("");
    setSearchKey("");
  };

  useEffect(() => {
    if (config) {
      post(
        `/market/get-marketplace`,
        {
          page: 1,
          pageSize: 1000,
          filers: {},
        },
        (data) => {
          if (mounted) {
            const items = data.items;
            items.forEach((item) => {
              item.paymentInformation = config.contracts.find(
                (e) => e.contractAddress === item.paymentContract
              );
            });
            setItemStore(items);
          }
        }
      );
      return () => setMounted(false);
    }
  }, [config, mounted]);

  const handleChange = (event, newValue) => {
    history.push(`/marketplace?type=${newValue}`);
    setItems(null);
    setNftName(newValue);
  };

  useEffect(() => {
    setSelectedName([]);
    setSelectedLevel([]);
    setFilters(null);
  }, [nftType]);

  useEffect(() => {
    if (!filters) {
      if (nftType === "angel") setFilters(filtersAngel);
      if (nftType === "costume") setFilters(filtersSkinOrMinion);
      if (nftType === "minion_parts") setFilters(filtersSkinOrMinion);
    }
  }, [filters, nftType]);

  //handle check multiple select
  const _onSelect = (status, key, type) => {
    var temp = [];
    if (type === "name") {
      temp = [...selectedName];
    } else {
      temp = [...selectedLevel];
    }
    if (status) {
      temp.push(key);
    } else {
      const index = temp.indexOf(key);
      temp.splice(index, 1);
    }
    if (type === "name") {
      setSelectedName(temp);
    } else {
      setSelectedLevel(temp);
    }
  };

  useEffect(() => {
    if (itemStore) {
      //filter by nft type
      let temp = itemStore.filter(
        (item) => item.type.toLowerCase() === nftType
      );

      //sort default by level
      temp.sort((a, b) => b.level.localeCompare(a.level));

      //search by name
      if (selectedName.length > 0)
        temp = temp.filter((item) =>
          selectedName.includes(item.name.toLowerCase())
        );

      //filter by level
      if (selectedLevel.length > 0)
        temp = temp.filter((item) =>
          selectedLevel.includes(item.level.toLowerCase())
        );

      //sort by key
      if (sortKey) {
        temp.sort((a, b) =>
          sortKey === "Increase"
            ? a.listingPrice - b.listingPrice
            : b.listingPrice - a.listingPrice
        );
      }
      if (searchKey) {
        temp = temp.filter((item) =>
          item.tokenId.toString().includes(searchKey)
        );
      }

      setItems(temp);
    }
  }, [itemStore, nftType, searchKey, selectedLevel, selectedName, sortKey]);

  return (
    <Container maxWidth="xl">
      <Box id="new-marketplace">
        <div
          className="bg-main"
          style={{ background: "url(/images/backgrounds/background.png)" }}
        ></div>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Box className="product-filter">
              <div className="market__control-panel">
                <Tabs value={nftType} onChange={handleChange}>
                  <Tab label="angels" className="custom-font" value="angel" />
                  <Tab
                    label="costume"
                    className="custom-font"
                    value="costume"
                  />
                  <Tab
                    label="minion parts"
                    className="custom-font"
                    value="minion_parts"
                  />
                </Tabs>
                <Button
                  className="filter-btn"
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <FilterAlt />
                </Button>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FilterBox
              filters={filters}
              _onSelect={_onSelect}
              data={items}
              _onSortChange={(e) => setSortKey(e)}
              onClearFilter={handleClearFilter}
              sortKey={sortKey}
              searchKey={searchKey}
              _onSearchKeyChange={(e) => {
                setSearchKey(e);
              }}
              open={open}
              onClose={() => setOpen(false)}
            />
          </Grid>
          <Grid item xs={12} lg={7}>
            <Box className="product-list">
              <MarketContents
                data={items}
                nftType={nftType}
                onNftNameChange={(e) => {
                  setNftName(e);
                }}
              />
            </Box>
          </Grid>
          <Hidden lgDown>
            <Grid item xs={5}>
              <Box className="product-intro">
                {nftName && (
                  <img
                    src={`${image_url}/artwork_${formatNftName(nftName)}.png`}
                    alt="thumbnail"
                    className="animate__animated animate__fadeInRight"
                  />
                )}
              </Box>
            </Grid>
          </Hidden>
        </Grid>
      </Box>
    </Container>
  );
}
