import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { Button, Divider, Grid, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { _addToken } from "../../onchain/onchain";
import { formatAddress, formatNumberWithDecimal } from "../../settings/format";
import { _getWalletLogout } from "../../store/actions/userActions";
import CopyComponent from "../common/CopyComponent";

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

const LoggedComponent = () => {
  const { user, setting } = useSelector((state) => state);
  const { onChainBalances, walletAddress } = user;
  const dispatch = useDispatch();
  const { library } = setting;

  const _handleLogout = () => {
    dispatch(_getWalletLogout());
  };

  return (
    <>
      <Box
        pl={3}
        pr={3}
        mt={2}
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex">
          <AccountCircleIcon />{" "}
          <Typography ml={1}>{library.MY_WALLET}</Typography>
        </Box>
        <CopyComponent content={`${walletAddress}`}>
          {formatAddress(`${walletAddress}`, 5)}
        </CopyComponent>
      </Box>
      <Divider />
      <Box mt={3} mb={3} pl={3} pr={3}>
        <Box
          style={{ border: "1px solid var(--border-color)" }}
          borderRadius="12px"
        >
          {onChainBalances &&
            onChainBalances.map((item, index) => (
              <WalletOption
                key={index}
                sx={{
                  borderBottom:
                    index < onChainBalances.length - 1
                      ? "1px solid var(--border-color)"
                      : "unset",
                  borderTopLeftRadius: index === 0 ? 10 : 0,
                  borderTopRightRadius: index === 0 ? 10 : 0,
                  borderBottomLeftRadius:
                    index === onChainBalances.length - 1 ? 10 : 0,
                  borderBottomRightRadius:
                    index === onChainBalances.length - 1 ? 10 : 0,
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
                          src={`/images/coins/${item.symbol}.png`}
                          style={{ height: 24 }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">
                          {formatNumberWithDecimal(item.onChainBalance)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <small>{item.asset}</small>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {index > 0 && (
                  <InstallButton
                    onClick={() => {
                      _addToken({
                        tokenAddress: item.contractAddress,
                        tokenSymbol: item.symbol,
                        tokenDecimals: item.decimals,
                        tokenImage: `https://marketplace.infinityangel.io/images/coins/${item.symbol}.png`,
                      });
                    }}
                  >
                    <Typography variant="body2">{library.ADD}</Typography>
                  </InstallButton>
                )}
              </WalletOption>
            ))}
        </Box>
      </Box>
      <Box pl={3} pr={3} pb={3}>
        {/* <MenuItem
          onClick={() => {
            history.push("/pre-sale/statistic");
            _onClose();
          }}
        >
          <AccessTimeIcon />
          <Box ml={2}> {library.VESTING_SCHEDULE}</Box>
        </MenuItem> */}
        <MenuItem onClick={_handleLogout}>
          <ExitToAppOutlinedIcon /> <Box ml={2}>{library.LOGOUT}</Box>
        </MenuItem>
      </Box>
    </>
  );
};

export default LoggedComponent;
