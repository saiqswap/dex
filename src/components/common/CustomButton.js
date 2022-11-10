import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";

export const CustomButton = styled(Button)(({ theme }) => ({
  minHeight: "45px",
  display: "flex",
  padding: " 0px 40px",
  color: "#fff!important",
  borderRadius: "7px !important",
  background: "rgba(255, 255, 255, 0.1) !important",
  fontFamily: "Orbitron !important",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2) !important",
  },
  "&:disabled": {
    opacity: 0.6,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    width: "100%",
  },
}));

export const CustomLoadingButton = styled(LoadingButton)(({ theme }) => ({
  minHeight: "45px",
  display: "flex",
  padding: " 0px 40px",
  color: "#fff!important",
  borderRadius: "7px !important",
  background: "rgba(255, 255, 255, 0.1) !important",
  fontFamily: "Orbitron !important",
  textTransform: "uppercase!important",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2) !important",
  },
  "&:disabled": {
    opacity: 0.6,
  },
  [theme.breakpoints.down("sm")]: {
    // fontSize: "0.7rem",
    width: "100%",
  },
}));
