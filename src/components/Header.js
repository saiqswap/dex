import { Container, Grid, Hidden, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  prefix,
  provider,
  _changeChain,
  _checkLogin,
} from "../onchain/onchain";
import { BLOCKCHAIN, MAIN_MENUS } from "../settings";
import {
  _addPartnerRef,
  _addRef,
  _getOnchainBalance,
  _getNewProfile,
  _getWalletLogout,
  _setWalletAddress,
  _setWalletName,
} from "../store/actions/userActions";
import { post } from "../utils/api";
import { isLoggedIn, setAccessToken } from "../utils/auth";
import ConfirmChangeChain from "./header/ConfirmChangeChain";
import LoggedProfile from "./header/LoggedProfile";
import LoginPopup from "./header/LoginPopup";
import MyWallet from "./header/MyWallet";
import SignPopup from "./header/SignPopup";
import SubMenu from "./header/SubMenu";

function Header() {
  const { user, setting } = useSelector((state) => state);
  const { walletAddress, walletName, walletSignature, information } = user;
  const dispatch = useDispatch();
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const location = useLocation();
  const [pathname, setPathname] = useState("");
  const { library } = setting;
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [showSignPopup, setShowSignPopup] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (walletName) {
      _checkLogin(walletName, (address) => {
        dispatch(_setWalletAddress(address));
        dispatch(_setWalletName(walletName));
      });
    }
  }, [dispatch, walletName]);

  useEffect(() => {
    if (walletAddress) {
      dispatch(_getOnchainBalance(walletAddress, provider));
      if (Number(prefix.networkVersion) !== BLOCKCHAIN.domain.chainId) {
        setShowModalConfirm(true);
      }
      prefix.on("accountsChanged", (address) => {
        dispatch(_setWalletAddress(address[0]));
      });
      prefix.on("chainChanged", (newNetwork) => {
        if (Number(newNetwork) !== BLOCKCHAIN.domain.chainId) {
          setShowModalConfirm(true);
        }
      });
    }
  }, [dispatch, walletAddress]);

  const _closeModalConfirm = () => {
    setShowModalConfirm(false);
    dispatch(_getWalletLogout());
  };

  const _onAccept = () => {
    _changeChain(() => setShowModalConfirm(false));
  };

  useEffect(() => {
    dispatch(_addRef());
    dispatch(_addPartnerRef());
    if (isLoggedIn()) {
      dispatch(_getNewProfile());
    }
  }, [dispatch, walletAddress]);

  useEffect(() => {
    if (location) setPathname(location.pathname);
  }, [location]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getReCaptcha = async (successCallback) => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }
    const token = await executeRecaptcha("login");
    if (successCallback) successCallback(token);
  };

  useEffect(() => {
    if (walletSignature) {
      _loginBySignature(walletSignature);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletSignature]);

  const _loginBySignature = async (signature) => {
    getReCaptcha((reCaptcha) => {
      post(
        `/user/login-by-signature`,
        {
          signature,
          message: "This is sign message",
          address: walletAddress,
          reCaptcha,
        },
        (data) => {
          setAccessToken(data.accessToken);
          dispatch(_getNewProfile());
        },
        (error) => {
          if (error.code === "ACCOUNT_NOTFOUND") {
            setAccountNotFound(true);
          }
        }
      );
    });
  };

  return (
    <>
      <div id="header">
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
                {MAIN_MENUS.map(
                  (item, index) =>
                    (!item.isLogged || (item.isLogged && information)) && (
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
              <LoggedProfile _handleSignClick={() => setShowSignPopup(true)} />
              <MyWallet />
              <SubMenu />
            </Grid>
          </Grid>
        </Container>{" "}
      </div>
      <LoginPopup
        open={accountNotFound}
        _handleClose={() => setAccountNotFound(false)}
      />
      <SignPopup
        open={showSignPopup}
        _onClose={() => setShowSignPopup(false)}
      />
      <ConfirmChangeChain
        open={showModalConfirm}
        _onClose={_closeModalConfirm}
        _onAccept={_onAccept}
      />
    </>
  );
}

export default Header;
