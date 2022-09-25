import { Box, Divider, Hidden, Popover, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MAIN_MENUS } from "../../settings";
import {
  _handleLogout,
  _removeWalletSignature,
} from "../../store/actions/userActions";
import { logout } from "../../utils/auth";
import { CustomButton } from "../common/CustomButton";
import UserAvatar from "../common/UserAvatar";

export default function LoggedProfile({ loading, _handleSignClick }) {
  const { user, setting } = useSelector((state) => state);
  const { information, walletAddress } = user;
  const { library } = setting;
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const _handleClick = (event) => {
    setAnchorEl(anchorEl === null ? event.currentTarget : null);
  };
  const _handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const _logout = () => {
    logout();
    _handleClose();
    dispatch(_handleLogout());
    dispatch(_removeWalletSignature());
  };

  return (
    <Box mr={1}>
      {!loading ? (
        information ? (
          <UserAvatar
            src={information.avatarImage}
            onClick={_handleClick}
            style={{ cursor: "pointer" }}
            id={information.id}
            size="header"
          />
        ) : (
          walletAddress && (
            <CustomButton onClick={_handleSignClick}>Login</CustomButton>
          )
        )
      ) : null}
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
        <Box
          pt={3}
          pb={3}
          pr={2}
          pl={2}
          sx={{
            background: "#1b1c1d",
          }}
        >
          <Box>
            <Hidden mdUp>
              {MAIN_MENUS.map(
                (item, index) =>
                  (!item.isLogged || (item.isLogged && information)) && (
                    <Link to={item.url[0]} key={index}>
                      <Typography
                        variant="body1"
                        className="custom-font"
                        fontWeight={300}
                        sx={{
                          pt: 1,
                          pb: 1,
                        }}
                      >
                        {library[item.title]}
                      </Typography>
                    </Link>
                  )
              )}
            </Hidden>
            <Link to="/profile/account">
              <Typography
                variant="body1"
                className="custom-font"
                fontWeight={300}
                sx={{
                  pt: 1,
                  pb: 1,
                }}
              >
                {library.PROFILE}
              </Typography>
            </Link>
            <Box mt={1} mb={3}>
              <Divider />
            </Box>
            <Box onClick={_logout} sx={{ cursor: "pointer" }}>
              <Typography
                variant="body1"
                className="custom-font"
                fontWeight={300}
              >
                {library.LOGOUT}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
