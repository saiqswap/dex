import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box, ClickAwayListener, Drawer, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomButton } from "../common/CustomButton";
import ChoseWalletModal from "./ChoseWalletModal";
import LoggedComponent from "./LoggedComponent";

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

const MyWallet = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state);
  const { walletAddress } = user;

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "unset";
    };
  }, [open]);

  const _handleClick = () => {
    setOpen(true);
  };

  const _onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <CustomButton
        sx={{
          textTransform: "unset!important",
          minWidth: "unset!important",
        }}
        onClick={_handleClick}
      >
        <AccountBalanceWalletIcon />
      </CustomButton>
      <CustomDrawer anchor={"right"} open={open} onClose={_onClose}>
        <ClickAwayListener onClickAway={_onClose}>
          <Box mt={10}>
            {walletAddress ? (
              <LoggedComponent _onClose={_onClose} />
            ) : (
              <ChoseWalletModal />
            )}
          </Box>
        </ClickAwayListener>
      </CustomDrawer>
    </>
  );
};

export default MyWallet;
