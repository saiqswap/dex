import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const CustomButton = styled(Button)(({ theme }) => ({
  minHeight: "45px",
  display: "flex",
  padding: " 0px 40px",
  color: "#fff!important",
  borderRadius: "7px !important",
  textTransform: "uppercase!important",
  background: "rgba(255, 255, 255, 0.1) !important",
  fontFamily: "Orbitron !important",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.2) !important",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    width: "100%!important",
  },
}));
