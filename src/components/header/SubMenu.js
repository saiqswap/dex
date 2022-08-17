import { Menu } from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Popover,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { _changeLanguage } from "../../store/actions/settingActions";

const MenuButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "transparent!important",
  border: "none!important",
}));

const LanguageItem = styled(Box)({
  background: "rgba(255,255,255,0.05)",
  borderRadius: "5px",
  whiteSpace: "nowrap",
  height: 30,
  width: 30,
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  marginRight: 8,
  cursor: "pointer",
  "&.active": {
    background: "var(--main-blue-color)",
  },
});

const Languages = ["en", "kr", "jp"];

export default function SubMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const dispatch = useDispatch();

  const _handleClick = (event) => {
    setAnchorEl(anchorEl === null ? event.currentTarget : null);
  };
  const _handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <MenuButton onClick={_handleClick}>
        <Menu />
      </MenuButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={_handleClose}
        onBlur={_handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          mt: 3,
        }}
      >
        <Box pt={3} pb={3} pr={2} pl={2}>
          <Box>
            <Typography variant="body2">{library.LANGUAGE}</Typography>
            <Box display="flex" mt={1}>
              {Languages.map((l, index) => (
                <LanguageItem
                  key={index}
                  onClick={() => dispatch(_changeLanguage(l))}
                  className={library.lang === l ? "active" : ""}
                >
                  {l.toUpperCase()}
                </LanguageItem>
              ))}
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
