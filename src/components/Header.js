import { Button, Container, Grid, Hidden, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// import { domain } from "../onchain/testnet-config";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { domain } from "../onchain/mainnet-config";
import {
  prefix,
  provider,
  _changeChain,
  _checkOldWalletAddress,
  _setProvider,
} from "../onchain/onchain";
import { CAPTCHA_KEY, MAIN_MENUS } from "../settings/constants";
import { _getUserMintingBoxes } from "../store/actions/mintingActions";
import {
  _getBalance,
  _getMyItems,
  _getNewProfile,
  _getWalletLogout,
} from "../store/actions/userActions";
import { post } from "../utils/api";
import { setAccessToken } from "../utils/auth";
import ChoseWalletModal from "./header/ChoseWalletModal";
import ConfirmChangeChain from "./header/ConfirmChangeChain";
import LoggedComponent from "./header/LoggedComponent";
import LoginPopup from "./header/LoginPopup";
import SignPopup from "./header/SignPopup";
import SubMenu from "./header/SubMenu";

function Header() {
  const { user, setting } = useSelector((state) => state);
  const location = useLocation();
  const { information, walletAddress, walletName, walletSignature } = user;
  const dispatch = useDispatch();
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [pathname, setPathname] = useState("");
  const [showChoseWallet, setShowChoseWallet] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const { library } = setting;
  const [showSignPopup, setShowSignPopup] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (information) {
      dispatch(_getMyItems());
      dispatch(_getUserMintingBoxes());
      prefix.on("accountsChanged", () => {
        dispatch(_getWalletLogout());
      });
      prefix.on("chainChanged", (newNetwork) => {
        if (newNetwork && Number(newNetwork) !== domain.chainId && provider) {
          setShowModalConfirm(true);
        }
      });
    }
  }, [dispatch, information]);

  useEffect(() => {
    if (executeRecaptcha) {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.bitkeep !== "undefined"
      ) {
        if (walletName && walletAddress) {
          _setProvider(walletName, () => {
            _checkOldWalletAddress(walletAddress, (check) => {
              if (check && walletSignature) {
                _loginBySignature(walletSignature);
                if (Number(prefix.networkVersion) !== domain.chainId) {
                  setShowModalConfirm(true);
                }
              } else {
                setLoading(false);
              }
            });
          });
        } else {
          setLoading(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, walletName, walletSignature, executeRecaptcha]);

  useEffect(() => {
    if (location) setPathname(location.pathname);
  }, [location]);

  useEffect(() => {
    if (information && provider && walletAddress) {
      dispatch(_getBalance(walletAddress, provider));
    }
  }, [walletAddress, dispatch, information]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getReCaptcha = async (successCallback) => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("login");
    if (successCallback) successCallback(token);
  };

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
          } else {
            dispatch(_getWalletLogout());
          }
        }
      );
    });
  };

  const _openChoseWallet = () => setShowChoseWallet(true);
  const _closeChoseWallet = () => setShowChoseWallet(false);

  const _closeModalConfirm = () => {
    setShowModalConfirm(false);
    dispatch(_getWalletLogout());
  };

  const _onAccept = () => {
    _changeChain();
    setShowModalConfirm(false);
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
              {information && <LoggedComponent information={information} />}
              {!information && !loading && (
                <Button
                  className="custom-btn custom-font"
                  sx={{
                    padding: "0 30px",
                    fontSize: 12,
                    minWidth: "unset!important",
                    p: 0,
                    textTransform: "uppercase!important",
                  }}
                  onClick={_openChoseWallet}
                  id="connect-wallet"
                >
                  <Hidden smDown>
                    <div>{library.CONNECT_WALLET}</div>
                  </Hidden>
                  <Hidden smUp>
                    <AccountBalanceWalletIcon />
                  </Hidden>
                </Button>
              )}
              <SubMenu />
            </Grid>
          </Grid>
        </Container>
      </div>
      <LoginPopup
        open={accountNotFound}
        _handleClose={() => setAccountNotFound(false)}
      />
      ≈{" "}
      <ChoseWalletModal
        open={showChoseWallet}
        _onClose={_closeChoseWallet}
        _successCallback={() => setShowSignPopup(true)}
      />
      <ConfirmChangeChain
        open={showModalConfirm}
        _onClose={_closeModalConfirm}
        _onAccept={_onAccept}
      />
      <SignPopup
        open={showSignPopup}
        _onClose={() => setShowSignPopup(false)}
      />
    </>
  );
}

export default Header;
