import { Close, Search } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  NativeSelect,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import "../../styles/filter-box.scss";

const FilterBox = ({
  filters,
  _onSortChange,
  _onSelect,
  onClearFilter,
  sortKey,
  searchKey,
  _onSearchKeyChange,
  open,
  onClose,
}) => {
  return (
    <div id="filter-box" style={{ right: open ? "0" : "-100%" }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ position: "relative" }}>
            <Button className="btn-clear" onClick={onClearFilter}>
              Clear Filter
            </Button>
            <IconButton
              className="btn-icon-txt"
              onClick={onClose}
              style={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translate(0,-50%)",
              }}
            >
              <Close />
            </IconButton>
          </Grid>
          <Grid item xs={12} style={{ position: "relative" }}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Search by NFT ID"
              fullWidth
              value={searchKey}
              onChange={(e) =>
                _onSearchKeyChange(
                  e.target.value.replace(/[^\d.]/g, "").replace(".", "")
                )
              }
            />
            <Search
              style={{ position: "absolute", opacity: 0.1, top: 20, right: 5 }}
            />
            <div className="sort-price">
              <span>Sort by price</span>
              <NativeSelect
                onChange={(value) => _onSortChange(value.target.value)}
                value={sortKey}
              >
                <option value={"None"}>None</option>
                <option value={"Increase"}>Increase</option>
                <option value={"Decrease"}>Decrease</option>
              </NativeSelect>
            </div>
          </Grid>
          {filters &&
            filters.map((item, index) => (
              <Grid item xs={12} key={index}>
                <div className="checkbox-title">
                  <Typography variant="body2">{item.title}</Typography>
                </div>
                <div className="checkbox-items">
                  <Grid container>
                    {item.options.map((option, index) => (
                      <Grid item xs={6} sm={4} md={12} key={index}>
                        <FormControlLabel
                          value={option.label}
                          control={<Checkbox />}
                          label={
                            <div className="checkbox-items__label">
                              {option.img && <img src={option.img} alt="" />}
                              <Typography variant="body2">
                                {option.label}
                              </Typography>
                            </div>
                          }
                          onChange={(e) => {
                            _onSelect(e.target.checked, option.key, item.key);
                          }}
                          labelPlacement="end"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
};

export default FilterBox;
