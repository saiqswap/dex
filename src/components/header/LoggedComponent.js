import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  ClickAwayListener,
  Divider,
  Drawer,
  Grid,
  Hidden,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { GoogleLogout } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { GOOGLE_SIGN_IN_CLIENT_KEY } from "../../settings/constants";
import { formatAddress, formatAmount } from "../../settings/format";
import { _getWalletLogout } from "../../store/actions/userActions";
import CopyComponent from "../common/CopyComponent";
import UserAvatar from "../common/UserAvatar";

const CustomDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: "9998!important",
  " .MuiDrawer-paperAnchorRight": {
    background: "#1b1c1d",
    backdropFilter: "blur(80px)",
    width: "420px!important",
  },
  [theme.breakpoints.down("sm")]: {
    " .MuiDrawer-paperAnchorRight": {
      width: "100%!important",
    },
  },
}));

const WalletOption = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  position: "relative",
  "&:hover": {
    boxShadow: "rgb(255 255 255 / 25%) 0px 0px 8px 0px",
  },
}));

const MenuItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  cursor: "pointer",
  opacity: "0.9",
  "&:hover": {
    opacity: 1,
  },
}));

const menus = [
  {
    icon: <AccountBoxIcon />,
    url: "/profile/account",
    label: "ACCOUNT",
    key: "account",
  },
  {
    icon: <WidgetsIcon />,
    url: "/profile/my-items?type=angel",
    label: "MY_ITEMS",
    key: "my-items",
  },
  {
    icon: <HistoryEduIcon />,
    url: "/profile/history",
    label: "HISTORY",
    key: "history",
  },
  {
    icon: <AccountBalanceWalletIcon />,
    url: "/profile/wallet",
    label: "WALLET",
    key: "wallet",
  },
];

const LoggedComponent = ({ information }) => {
  const [open, setOpen] = useState(false);
  const { user, setting } = useSelector((state) => state);
  const { balances, walletAddress } = user;
  const history = useHistory();
  const dispatch = useDispatch();
  const { library } = setting;

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "unset";
    };
  }, [open]);

  const _handleLogout = () => {
    dispatch(_getWalletLogout());
  };

  const _handleClick = () => {
    setOpen(true);
  };
  const _onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <UserAvatar
        src={information.avatarImage}
        onClick={_handleClick}
        style={{ cursor: "pointer" }}
        id={information.id}
        size="header"
      />
      <CustomDrawer anchor={"right"} open={open} onClose={_onClose}>
        <ClickAwayListener onClickAway={_onClose}>
          <Box mt={10}>
            <Box pl={3} pr={3} mt={2} mb={2} display="flex">
              <AccountCircleIcon />{" "}
              <Typography ml={1}>{library.MY_INFORMATION}</Typography>
            </Box>
            <Divider />
            <Box pl={3} pr={3} mt={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">Email:</Typography>
                <Typography variant="body2">{information.email}</Typography>
              </Box>
              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">
                  {library.WALLET_ADDRESS}:
                </Typography>
                <CopyComponent content={`${walletAddress}`}>
                  {formatAddress(`${walletAddress}`, 8)}
                </CopyComponent>
              </Box>
              <Box
                mt={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">
                  {library.REFERRAL_LINK}:
                </Typography>
                <CopyComponent
                  content={`${window.location.origin}/referral-link?referral=${information.id}`}
                >
                  {formatAddress(
                    `${window.location.origin}/referral-link?referral=${information.id}`,
                    8
                  )}
                </CopyComponent>
              </Box>
            </Box>
            <Box mt={3} mb={3} pl={3} pr={3}>
              <Box
                style={{ border: "1px solid var(--border-color)" }}
                borderRadius="12px"
              >
                {balances &&
                  balances.map((item, index) => (
                    <WalletOption
                      key={index}
                      sx={{
                        borderBottom:
                          index < balances.length - 1
                            ? "1px solid var(--border-color)"
                            : "unset",
                        borderTopLeftRadius: index === 0 ? 10 : 0,
                        borderTopRightRadius: index === 0 ? 10 : 0,
                        borderBottomLeftRadius:
                          index === balances.length - 1 ? 10 : 0,
                        borderBottomRightRadius:
                          index === balances.length - 1 ? 10 : 0,
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item>
                              <img
                                alt={item.asset}
                                src={`/images/coins/${item.asset}.png`}
                                style={{ height: 24 }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography variant="body1">
                                {formatAmount(item.onChainBalance)}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <small>{item.asset}</small>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </WalletOption>
                  ))}
              </Box>
            </Box>
            <Box pl={3} pr={3}>
              <Hidden mdDown>
                <MenuItem
                  onClick={() => {
                    history.push(menus[0].url);
                    _onClose();
                  }}
                >
                  {menus[0].icon} <Box ml={2}>{library[menus[0].label]}</Box>
                </MenuItem>
              </Hidden>
              <Hidden mdUp>
                {menus.map((m, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      history.push(m.url);
                      _onClose();
                    }}
                  >
                    {m.icon} <Box ml={2}>{library[m.label]}</Box>
                  </MenuItem>
                ))}
              </Hidden>
              <GoogleLogout
                clientId={GOOGLE_SIGN_IN_CLIENT_KEY}
                buttonText="Logout"
                onLogoutSuccess={_handleLogout}
                onFailure={(r) => console.log(r)}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <MenuItem
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <ExitToAppOutlinedIcon /> <Box ml={2}>{library.LOGOUT}</Box>
                  </MenuItem>
                )}
              />
            </Box>
          </Box>
        </ClickAwayListener>
      </CustomDrawer>
    </>
  );
};

export default LoggedComponent;
