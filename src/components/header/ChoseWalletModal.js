import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Drawer,
  Paper,
  styled,
  Typography,
  Link,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _connectToMetamaskWallet } from "../../onchain/onchain";
import {
  _setWalletAddress,
  _setWalletName,
} from "../../store/actions/userActions";
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
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  position: "relative",
  "&:hover": {
    boxShadow: "rgb(255 255 255 / 25%) 0px 0px 8px 0px",
  },
}));

const InstallButton = styled(Button)(({ theme }) => ({
  display: "flex",
  padding: " 4px 8px",
  color: "#fff !important",
  borderRadius: "7px !important",
  textTransform: "uppercase!important",
  fontFamily: "Orbitron !important",
  background: "rgba(255, 255, 255, 0.1) !important",
  position: "absolute",
  right: theme.spacing(1),
  minWidth: "unset!important",
}));

export default function ChoseWalletModal({ open, _onClose, _successCallback }) {
  const dispatch = useDispatch();
  const [isInstalledMetamask, setIsInstalledMetamask] = useState(false);
  const [isInstalledBitKeep, setIsInstalledBitKeep] = useState(false);
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "unset";
    };
  }, [open]);

  const _handleUpdateWalletAddress = (address, walletName) => {
    dispatch(_setWalletAddress(address));
    dispatch(_setWalletName(walletName));
    _onClose();
    setTimeout(() => {
      _successCallback();
    }, 200);
  };

  useState(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsInstalledMetamask(true);
    }
    if (typeof window.bitkeep !== "undefined") {
      setIsInstalledBitKeep(true);
    }
  }, []);

  return (
    <CustomDrawer anchor={"right"} open={open} onClose={_onClose}>
      <ClickAwayListener onClickAway={_onClose}>
        <Box mt={10}>
          <Box pl={3} pr={3} mt={2} mb={2} display="flex">
            <AccountCircleIcon />{" "}
            <Typography ml={1}>{library.MY_WALLET}</Typography>
          </Box>
          <Divider />
          <Typography variant="body2" mt={2} pl={3} pr={3}>
            {library.MY_WALLET_NOTE_1}
          </Typography>
          <Box p={3}>
            <Paper
              sx={{
                borderRadius: "10px!important",
                background: "transparent!important",
                boxShadow: "unset",
              }}
            >
              <WalletOption
                onClick={() => {
                  if (isInstalledMetamask) {
                    _connectToMetamaskWallet(
                      "metamask",
                      _handleUpdateWalletAddress
                    );
                  }
                }}
                sx={{
                  borderBottom: "1px solid var(--border-color)",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                <img
                  src="/images/metamask-logo.png"
                  alt="logo metamask"
                  width="24px"
                  height="24px"
                />
                <Typography
                  className="custom-font"
                  variant="body2"
                  fontWeight={900}
                  ml={2}
                >
                  Metamask
                </Typography>
                {!isInstalledMetamask && (
                  <InstallButton
                    component={Link}
                    href="https://metamask.io/download/"
                    target="_blank"
                  >
                    <Typography variant="body2">{library.INSTALL}</Typography>
                  </InstallButton>
                )}
              </WalletOption>
              <WalletOption
                onClick={() => {
                  if (isInstalledBitKeep) {
                    _connectToMetamaskWallet(
                      "bitkeep",
                      _handleUpdateWalletAddress
                    );
                  }
                }}
                sx={{
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                <img
                  src="/images/bitkeep-logo.png"
                  alt="logo bitkeep"
                  width="24px"
                  height="24px"
                  style={{
                    borderRadius: "50%",
                  }}
                />
                <Typography
                  className="custom-font"
                  variant="body2"
                  fontWeight={900}
                  ml={2}
                >
                  Bitkeep
                </Typography>
                {!isInstalledBitKeep && (
                  <InstallButton
                    component={Link}
                    href="https://bitkeep.com/download?type=2&theme=light"
                    target="_blank"
                  >
                    <Typography variant="body2">{library.INSTALL}</Typography>
                  </InstallButton>
                )}
              </WalletOption>
            </Paper>
          </Box>
          <Box pl={3} pr={3}>
            <Typography variant="body2" className="mt-20">
              {library.MY_WALLET_NOTE_2}
            </Typography>
            <Typography variant="body2">
              {library.SEE}{" "}
              <a
                href="/docs/Infinity_Angel_NFT_Marketplace_Terms_And_Conditions.docx.pdf"
                target="_blank"
                style={{ color: "#2FA4FF", textDecoration: "underline" }}
              >
                {library.TERM_AND_CONDITIONS}.
              </a>
            </Typography>
          </Box>
        </Box>
      </ClickAwayListener>
    </CustomDrawer>
  );
}
