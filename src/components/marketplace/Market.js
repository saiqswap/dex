import { Container, Grid, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { image_url } from "../../settings";
import { post } from "../../utils/api";
import FilterBox from "../common/FilterBox";
import "./market.scss";
import MarketContents from "./MarketContents";

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
        label: "Emily",
        img: `${image_url}/avatar_emily.png`,
        key: "emily",
      },
      {
        label: "Dasha",
        img: `${image_url}/avatar_dasha.png`,
        key: "dasha",
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

export default function Market() {
  const [nftType, setNftType] = useState("angel");
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
    setNftType(newValue);
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
      let temp = itemStore.filter(
        (item) => item.type.toLowerCase() === nftType
      );
      if (selectedName.length > 0)
        temp = temp.filter((item) =>
          selectedName.includes(item.name.toLowerCase())
        );
      if (selectedLevel.length > 0)
        temp = temp.filter((item) =>
          selectedLevel.includes(item.level.toLowerCase())
        );
      if (sortKey) {
        temp.sort((a, b) =>
          sortKey === "Increase"
            ? a.listingPrice - b.listingPrice
            : b.listingPrice - a.listingPrice
        );
      }
      if (searchKey) {
        temp = temp.filter((item) => searchKey.includes(item.tokenId));
      }

      setItems(temp);
    }
  }, [itemStore, nftType, searchKey, selectedLevel, selectedName, sortKey]);

  return (
    <>
      <div
        style={{
          position: "relative",
          background: "url(/images/bg-main.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "50% 15%",
          backgroundRepeat: "no-repeat",
        }}
        className="marketplace-banner"
      ></div>
      <div id="market">
        <Container>
          <Grid item xs={12}>
            <div className="market__body">
              <Grid container>
                <Grid item xs={12} md={3}>
                  <div className="market__control-panel">
                    <Tabs value={nftType} onChange={handleChange}>
                      <Tab
                        label="angels"
                        className="custom-font"
                        value="angel"
                      />
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
                  </div>
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
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <MarketContents type={nftType} data={items} />
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Container>
      </div>
    </>
  );
}
