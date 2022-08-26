/* eslint-disable no-undef */
import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { GoogleLogin } from "react-google-login";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ACCESS_TOKEN_KEY,
  GOOGLE_SIGN_IN_CLIENT_KEY,
  SCOPES_KEY,
} from "../../settings/constants";
import { ENDPOINT_LOGIN_WITH_GOOGLE } from "../../settings/endpoint";
import {
  _getNewProfile,
  _getWalletLogout,
} from "../../store/actions/userActions";
import { post, put } from "../../utils/api";
import { setAccessToken } from "../../utils/auth";
import { CustomButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";

export default function LoginPopup({ open, _handleClose }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
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

  const _handleLoginByGoogle = (e) => {
    getReCaptcha((reCaptcha) => {
      const referral = localStorage.getItem("referral");
      const param = {
        googleAccessToken: e.accessToken,
        otp: "",
        reCaptcha,
        referralId: referral ? parseFloat(referral) : null,
      };
      post(
        ENDPOINT_LOGIN_WITH_GOOGLE,
        param,
        (data) => {
          setAccessToken(data.accessToken);
          _updateAddress();
        },
        (error) => {
          console.log(error.code);
          toast.error(error.msg);
        }
      );
    });
  };

  const _close = () => {
    dispatch(_getWalletLogout());
    _handleClose();
  };

  return (
    <CustomModal open={open} _close={_close} isShowCloseButton={true}>
      <Grid container spacing={3} align="left">
        <Grid item xs={12}>
          <Box display="flex" pr={2} alignItems="center">
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
            <Typography align="left" ml={2}>
              {library.REGISTER_WITH_GOOGLE}
            </Typography>
          </Box>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <GoogleLogin
            clientId={GOOGLE_SIGN_IN_CLIENT_KEY}
            render={(renderProps) => (
              <CustomButton
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                sx={{
                  m: "auto",
                  mb: 3,
                  minWidth: "200px!important",
                  maxWidth: 300,
                }}
              >
                {library.CONTINUE}
              </CustomButton>
            )}
            buttonText="Login"
            onSuccess={_handleLoginByGoogle}
            onFailure={(e) => console.log(e)}
            cookiePolicy={"single_host_origin"}
          />
        </Grid>
      </Grid>
    </CustomModal>
  );
}
