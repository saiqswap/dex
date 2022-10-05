import {
  Box,
  Button,
  Card,
  Stack,
  Stepper,
  styled,
  Typography,
} from "@mui/material";

export const CustomContainer = styled(Box)(() => ({
  marginTop: 50,
}));
export const CustomCard = styled(Card)(({ theme }) => ({
  height: "100%",
  width: "100%",
  minHeight: "50vh",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  boxShadow: "none",
  padding: "2rem",
  position: "relative",
  backdropFilter: "blur(20px)",
  // zIndex: 99,
  [theme.breakpoints.down("sm")]: {
    padding: "0px 1rem 0px 0px",
  },
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
    padding: "20px",
  },
  "&:before": {
    content: '""',
    width: "2px",
    height: "100%",
    background: "var(--border-color)",
    position: "absolute",
    top: 0,
    left: "5.5rem",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
export const CustomStep = styled(Stepper)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    marginLeft: "-1rem",
    "& .MuiStepContent-root": {
      position: "relative",
      paddingBottom: "2rem",
    },
  },
  "& .MuiStepConnector-root": {
    height: "100px",
    [theme.breakpoints.down("md")]: {
      width: "150vw",
      marginLeft: "-10vw",
      background: "var(--border-color)",
      height: "10px",
      marginBottom: "20px",
    },
  },
  "& .MuiStepLabel-iconContainer svg": {
    width: "50px",
    height: "50px",
    color: "var(--border-color)",
    position: "relative",
    zIndex: 100,
    border: "3px solid var(--border-color)",
    borderRadius: "100px",
    "& text": {
      fill: "var(--main-color)",
      fontWeight: "bold",
    },
  },
  "& .MuiStepConnector-line": {
    opacity: 0,
  },
  "& .MuiStepLabel-labelContainer": {
    paddingLeft: "1rem",
  },
  "& .MuiStepContent-root": {
    paddingLeft: "6rem",
    borderLeft: "none",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "0px",
    },
  },
  "& .MuiStepLabel-root": {
    [theme.breakpoints.down("md")]: {
      marginLeft: "0px",
    },
  },
  "& .MuiStepLabel-iconContainer": {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));
export const FieldLabel = styled(Typography)({
  width: 120,
});
export const CustomButton = styled(Button)({
  padding: "0 30px",
  width: 200,
  textTransform: "uppercase",
});
export const CustomStack = ({ children }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="flex-start"
    color="#fff"
    flexWrap={"wrap"}
  >
    {children}
  </Stack>
);
export const CountdownStack = ({ children }) => (
  <Stack
    sx={{
      background: "rgba(255,255,255,0.1)",
      width: "60px",
      height: "60px",
      color: "#fff",
      borderRadius: "10px",
    }}
    justifyContent="center"
  >
    {children}
  </Stack>
);
