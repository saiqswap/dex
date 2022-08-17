import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { Grid, Popover, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { GoogleLogout } from "react-google-login";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { GOOGLE_SIGN_IN_CLIENT_KEY } from "../../settings/constants";
import { formatAddress, formatAmount } from "../../settings/format";
import { logout } from "../../utils/auth";
import UserAvatar from "../common/UserAvatar";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import BallotIcon from "@mui/icons-material/Ballot";

const LoggedComponent = ({ information }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state);
  const { balances, walletAddress } = user;
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(anchorEl === null ? event.currentTarget : null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <UserAvatar
        src={information.avatarImage}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
        id={information.id}
        size="header"
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onBlur={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box pt={3} pb={3} pr={2} pl={2}>
          <Box p={2}>Email: {information.email}</Box>
          <Box p={2}>
            {walletAddress && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  {localStorage.getItem("wallet") &&
                  localStorage.getItem("wallet") === "bitkeep"
                    ? "Bitkeep"
                    : "Metamask"}
                  :{" "}
                </Typography>
                <CopyToClipboard
                  text={`${walletAddress}`}
                  onCopy={() => toast.success("copped")}
                >
                  <Box
                    sx={{
                      alignItems: "center",
                      backgroundColor: "transparent",
                      borderRadius: "50px",
                      border: "1px solid var(--border-color)",
                      color: "#ffffff",
                      display: "flex",
                      justifyContent: "center",
                      lineHeight: "28px",
                      margin: "0px 0px 0px 10px",
                      padding: " 5px 15px",
                      textAlign: "center",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "#1976d2",
                      },
                    }}
                    className="ml-10"
                  >
                    {formatAddress(walletAddress, 5)}
                  </Box>
                </CopyToClipboard>
              </div>
            )}
          </Box>
          <Box
            p={2}
            style={{ border: "1px solid var(--border-color)" }}
            borderRadius="12px"
            minWidth={300}
          >
            {balances &&
              balances.map((item, index) => (
                <Box key={index} mt={2} mb={2}>
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
                            style={{ height: 44 }}
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
                </Box>
              ))}
          </Box>

          <Box
            p={1}
            display="flex"
            alignItems="center"
            onClick={() => {
              history.push("/profile/account");
              setAnchorEl(null);
            }}
            sx={{ cursor: "pointer" }}
          >
            <AccountCircleOutlinedIcon /> <Box ml={2}>My Profile</Box>
          </Box>
          <Box
            p={1}
            display="flex"
            alignItems="center"
            onClick={() => {
              history.push("/profile/my-items?type=angel");
              setAnchorEl(null);
            }}
            sx={{ cursor: "pointer" }}
          >
            <BallotIcon /> <Box ml={2}>My Items</Box>
          </Box>
          <GoogleLogout
            clientId={GOOGLE_SIGN_IN_CLIENT_KEY}
            buttonText="Logout"
            onLogoutSuccess={logout}
            render={(renderProps) => (
              <Box
                p={1}
                display="flex"
                alignItems="center"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                sx={{
                  cursor: "pointer",
                }}
              >
                <ExitToAppOutlinedIcon /> <Box ml={2}>Logout</Box>
              </Box>
            )}
          />
        </Box>
      </Popover>
    </>
  );
};

export default LoggedComponent;
