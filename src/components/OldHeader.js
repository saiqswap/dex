import {
  Box,
  Button,
  ClickAwayListener,
  Container,
  Grid,
  Hidden,
  Typography,
} from "@mui/material";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// import { domain } from "../onchain/testnet-config";
import { domain } from "../onchain/mainnet-config";
import {
  prefix,
  provider,
  _changeChain,
  _connectToMetamaskWallet,
} from "../onchain/onchain";
import { CAPTCHA_KEY, LOGIN_MESSAGE } from "../settings/constants";
import {
  _getBalance,
  _getMyItems,
  _getNewProfile,
} from "../store/actions/userActions";
import { ADD_WALLET_ADDRESS, ADD_WALLET_SIGNATURE } from "../store/constants";
import { post } from "../utils/api";
import { isLoggedIn, logoutReturnTo, setAccessToken } from "../utils/auth";
import LoggedComponent from "./header/LoggedComponent";
import ChoseWalletModal from "./header/ChoseWalletModal";
import ConfirmChangeChain from "./header/ConfirmChangeChain";
import LoginPopup from "./header/LoginPopup";
import SubMenu from "./header/SubMenu";
import SignPopup from "./header/SignPopup";
import { toast } from "react-toastify";

const menus = [
  // {
  //   title: "HOME",
  //   url: ["/"],
  // },
  // {
  //   title: "MINTING",
  //   url: ["/minting-box"],
  // },
  // {
  //   title: "MARKETPLACE",
  //   url: ["/marketplace"],
  // },
  // {
  //   title: "BOXES",
  //   url: ["/boxes"],
  // },
  // {
  //   title: "SUMMON",
  //   url: ["/summon"],
  //   isLogged: true,
  // },
  // {
  //   title: "R - I",
  //   url: [
  //     "/research-institute/R-I",
  //     "/research-institute/slot",
  //     "/research-institute/history",
  //   ],
  //   isLogged: true,
  // },
];

function Header() {
  const { user, setting } = useSelector((state) => state);
  const location = useLocation();
  const { information, walletAddress, walletName } = user;
  const dispatch = useDispatch();
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [pathname, setPathname] = useState("");
  const [showChoseWallet, setShowChoseWallet] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const { library } = setting;

  useEffect(() => {
    if (location) setPathname(location.pathname);
  }, [location]);

  useEffect(() => {
    if (information && provider && walletAddress) {
      dispatch(_getBalance(walletAddress, provider));
    }
  }, [walletAddress, dispatch, information]);

  useEffect(() => {
    if (information && !walletAddress) {
      _connectToMetamaskWallet(
        localStorage.getItem("wallet"),
        (address) => {
          dispatch({
            type: ADD_WALLET_ADDRESS,
            payload: address,
          });
        },
        dispatch
      );
    }
  }, [dispatch, information, walletAddress]);

  // check profile address === account logged metamask
  useEffect(() => {
    if (information && walletAddress) {
      if (
        information.address !== walletAddress ||
        walletAddress === "UNKNOWN"
      ) {
        logoutReturnTo();
      }
    }
  }, [information, walletAddress]);

  const _checkSignature = async () => {
    let signature = window.localStorage.getItem("signature");
    if (!signature) {
      const data = `0x${Buffer.from(LOGIN_MESSAGE, "utf8").toString("hex")}`;
      signature = await prefix.request({
        method: "personal_sign",
        params: [data, walletAddress],
      });
    }
    dispatch({
      type: ADD_WALLET_SIGNATURE,
      payload: signature,
    });
    _loginBySignature(signature);
  };

  const _loginBySignature = async (signature) => {
    window.localStorage.setItem("signature", signature);
    post(
      `/user/login-by-signature`,
      {
        signature,
        message: "This is sign message",
        address: walletAddress,
        reCaptcha: "development",
      },
      (data) => {
        setAccessToken(data.accessToken);
        dispatch(_getNewProfile());
        dispatch(_getBalance(walletAddress, provider));
        dispatch(_getMyItems());
      },
      (error) => {
        setAccountNotFound(true);
        toast.error(error.msg);
      }
    );
  };

  const _openChoseWallet = () => setShowChoseWallet(true);
  const _closeChoseWallet = () => setShowChoseWallet(false);

  //Handle change chain
  const getPrefix = (walletName) => {
    if (walletName === "bitkeep") {
      return window.bitkeep.ethereum;
    } else if (walletName === "metamask") {
      return window.ethereum;
    } else {
      return null;
    }
  };
  const _closeModalConfirm = () => {
    setShowModalConfirm(false);
  };
  const _onAccept = () => {
    _changeChain();
    setShowModalConfirm(false);
  };

  useEffect(() => {
    if (walletName) {
      const prefixLocal = getPrefix(localStorage.getItem("wallet"));
      if (prefixLocal) {
        prefixLocal.on("chainChanged", (newNetwork) => {
          if (newNetwork && Number(newNetwork) !== domain.chainId && provider) {
            setShowModalConfirm(true);
          }
        });
      }
    }
  }, [walletName]);

  useEffect(() => {
    if (walletName) {
      const prefixLocal = getPrefix(localStorage.getItem("wallet"));
      if (
        prefixLocal &&
        Number(prefixLocal.networkVersion) !== domain.chainId
      ) {
        setShowModalConfirm(true);
      }
    }
  }, [walletName]);

  return (
    <>
      <div
        id="header"
        onClick={(e) => {
          // console.log(e.target.id);
          if (!e.target.id) {
            _closeChoseWallet();
          }
        }}
      >
        <Container>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Link to="/" className="logo-web">
                <img src="/logo.png" alt="" />
              </Link>
            </Grid>
            <Hidden mdDown>
              <Grid
                item
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ height: 80 }}
              >
                {menus.map(
                  (item, index) =>
                    (!item.isLogged || (item.isLogged && isLoggedIn())) && (
                      <Link
                        to={item.url[0]}
                        key={index}
                        className={`nav-link ${
                          item.url.includes(pathname) && "active"
                        }`}
                      >
                        <Typography
                          variant="body1"
                          className="custom-font"
                          fontWeight={600}
                        >
                          {library[item.title]}
                        </Typography>
                      </Link>
                    )
                )}
              </Grid>
            </Hidden>
            <Grid
              item
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box display="flex">
                {information && <LoggedComponent information={information} />}
                {!information &&
                  (walletAddress && walletAddress !== "UNKNOWN" ? (
                    <Button
                      className="custom-btn custom-font"
                      onClick={_loginBySignature}
                      style={{ fontSize: 12 }}
                    >
                      LOGIN
                    </Button>
                  ) : (
                    <Button
                      className="custom-btn custom-font"
                      style={{ padding: "0 30px", fontSize: 12 }}
                      onClick={_openChoseWallet}
                      id="connect-wallet"
                    >
                      CONNECT WALLET
                    </Button>
                  ))}
                <SubMenu />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>

      <GoogleReCaptchaProvider reCaptchaKey={CAPTCHA_KEY} language={"en"}>
        <LoginPopup
          open={accountNotFound}
          _handleClose={() => setAccountNotFound(false)}
        />
      </GoogleReCaptchaProvider>
      <ChoseWalletModal open={showChoseWallet} _onClose={_closeChoseWallet} />
      <ConfirmChangeChain
        open={showModalConfirm}
        _onClose={_closeModalConfirm}
        _onAccept={_onAccept}
      />
      <SignPopup open={false} />
    </>
  );
}

export default Header;
