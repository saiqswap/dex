import { Box, Divider, Popover, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PROFILE_MENUS, RI_USER_TYPE } from "../../settings/constants";
import {
  _getMyItems,
  _handleLogout,
  _removeWalletSignature,
} from "../../store/actions/userActions";
import { logout } from "../../utils/auth";
import { CustomButton } from "../common/CustomButton";
import UserAvatar from "../common/UserAvatar";

export default function LoggedProfile({ loading, _handleSignClick }) {
  const { user, setting } = useSelector((state) => state);
  const { information, walletAddress, riUserType } = user;
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

  const _handleSync = () => {
    _handleClose();
    dispatch(
      _getMyItems(() => {
        toast.success("Sync data success");
      })
    );
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
            {PROFILE_MENUS.map(
              (item, index) =>
                (item.key !== "ri-factory" ||
                  (item.key === "ri-factory" &&
                    riUserType === RI_USER_TYPE.ROOT)) && (
                  <Link to={item.url} key={index}>
                    <Typography
                      variant="body1"
                      className="custom-font"
                      fontWeight={300}
                      sx={{
                        pt: 1,
                        pb: 1,
                      }}
                    >
                      {library[item.label]}
                    </Typography>
                  </Link>
                )
            )}
            <Box mt={1} mb={2}>
              <Divider />
            </Box>
            <Box onClick={_handleSync} sx={{ cursor: "pointer" }}>
              <Typography
                variant="body1"
                className="custom-font"
                fontWeight={300}
                sx={{ mb: 1 }}
              >
                Sync data
              </Typography>
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
