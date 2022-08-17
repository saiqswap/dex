import {
  Backdrop,
  Box,
  Container,
  Fade,
  Grid,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CustomToast } from "../../settings";
import {
  ACCESS_TOKEN_KEY,
  GOOGLE_SIGN_IN_CLIENT_KEY,
  SCOPES_KEY,
} from "../../settings/constants";
import {
  ENDPOINT_LOGIN_WITH_GOOGLE,
  ENDPOINT_POST_USER_LOGIN,
} from "../../settings/endpoint";
import { checkEmail, checkEmpty } from "../../settings/validates";
import { _getNewProfile } from "../../store/actions/userActions";
import { post, put } from "../../utils/api";
import { setAccessToken } from "../../utils/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outline: "none",
};

export default function LoginPopup({ open, _handleClose }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [emailOtp, setEmailOtp] = useState("");
  const { setting, user } = useSelector((state) => state);
  const { library } = setting;
  const { walletAddress, walletSignature } = user;
  const dispatch = useDispatch();

  const _updateAddress = () => {
    put(
      `/user/address`,
      {
        signature: walletSignature,
        message: "This is sign message",
        address: walletAddress,
      },
      (data) => {
        setAccessToken(data.accessToken);
        dispatch(_getNewProfile());
        _handleClose();
      },
      (error) => {
        toast.error(`Login fail. ${error.msg}`);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(SCOPES_KEY);
      }
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getReCaptcha = useCallback(async (successCallback) => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("login");
    if (successCallback) successCallback(token);
  });

  const _handleRegister = (e) => {
    e.preventDefault();
    let tempFieldError = [];
    if (checkEmpty(email)) {
      tempFieldError.push({
        field: "email",
        error: library.PLEASE_ENTER_EMAIL,
      });
    } else {
      if (checkEmail(email)) {
        tempFieldError.push({
          field: "email",
          error: library.INVALID_EMAIL,
        });
      }
    }
    if (checkEmpty(emailOtp)) {
      tempFieldError.push({
        field: "emailOtp",
        error: library.PLEASE_ENTER_OTP,
      });
    }
    //#endregion
    if (tempFieldError.length > 0) {
    } else {
      getReCaptcha((reCaptcha) => {
        const param = {
          email,
          otp: emailOtp,
          reCaptcha,
        };

        post(
          ENDPOINT_POST_USER_LOGIN,
          param,
          (data) => {
            setAccessToken(data.accessToken);
            _updateAddress();
          },
          (error) => {
            CustomToast("error", library[error.code]);
          }
        );
      });
    }
  };

  const _handleLoginByGoogle = (e) => {
    getReCaptcha((reCaptcha) => {
      const referral = localStorage.getItem("referral");
      const param = {
        googleAccessToken: e.accessToken,
        otp: emailOtp,
        reCaptcha,
        referralId: referral ? referral : null,
      };
      post(
        ENDPOINT_LOGIN_WITH_GOOGLE,
        param,
        (data) => {
          setAccessToken(data.accessToken);
          _updateAddress();
        },
        (error) => {
          CustomToast("error", library[error.code]);
        }
      );
    });
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      //   onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style} className="login-form">
          <Container style={{ maxWidth: 500 }} align="center">
            <form noValidate onSubmit={_handleRegister}>
              <Paper style={{ padding: 50 }}>
                <Grid container spacing={2} align="left">
                  <Grid item xs={12}>
                    <Typography variant="h5" align="center" className="mb-10">
                      {library.LOGIN}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} align="center">
                    <small>
                      {library.REGISTER_CONDITION}{" "}
                      <Link to="#">{library.TERM_AND_CONDITIONS}</Link>{" "}
                      {library.AND} <Link to="#">{library.PRIVACY_POLICY}</Link>
                      .
                    </small>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <GoogleLogin
                        clientId={GOOGLE_SIGN_IN_CLIENT_KEY}
                        render={(renderProps) => (
                          <Box
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            mt={2}
                            sx={{
                              backgroundColor: "var(--primary-color)",
                              borderRadius: 1,
                              cursor: "pointer",
                            }}
                            display="flex"
                            p={0.3}
                            alignItems="center"
                          >
                            <Box
                              p={1}
                              sx={{
                                borderRadius: 1,
                                backgroundColor: "#fff",
                              }}
                            >
                              <img
                                src="/images/google-logo.png"
                                alt=""
                                width={40}
                                style={{
                                  backgroundColor: "#fff",
                                }}
                              />
                            </Box>
                            <Box flex={1} textAlign="center">
                              <Typography fontWeight={600}>
                                Sign in with Google
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        buttonText="Login"
                        onSuccess={_handleLoginByGoogle}
                        onFailure={(e) => console.log(e)}
                        cookiePolicy={"single_host_origin"}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </form>
          </Container>
        </Box>
      </Fade>
    </Modal>
  );
}
