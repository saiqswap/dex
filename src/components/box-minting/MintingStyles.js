import {
  Box,
  Button,
  LinearProgress,
  Stack,
  styled,
  Typography,
} from "@mui/material";

export const DropRateDetail = styled(Box)(() => ({
  background: "rgba(0, 0, 0, 0.4)",
  padding: "20px",
  borderRadius: "5px",
  marginTop: "0px",
  textAlign: "left",
}));

export const PurchaseBox = styled(Box)({
  boxShadow: "inset 0px 0px 5px #000",
  borderBottom: "1px solid rgba(255, 255, 255, 0.35)",
  borderRight: "1px solid rgba(255, 255, 255, 0.25)",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  borderRadius: "5px",
  padding: "20px",
});

export const SelectAmountButton = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0,0,0,0.5)",
  width: 70,
  padding: theme.spacing(0.5),
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: theme.spacing(1),
}));
export const LinearProgressCustom = styled(LinearProgress)(() => ({
  borderRadius: "10px",
  height: "15px",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  boxShadow: "0 0 10px #F6B323",
  ".MuiLinearProgress-bar": {
    backgroundColor: "#F6B323",
  },
}));

export const BoxItem = styled(Box)(({ theme }) => ({
  background: "rgba(255,255,255,0.05)",
  borderRadius: "5px",
  whiteSpace: "nowrap",
  height: 50,
  width: 50,
  cursor: "pointer",
  display: "flex",
  textAlign: "center",
  img: {
    width: "100%",
    margin: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    height: 40,
    width: 40,
    padding: theme.spacing(0.5),
  },
}));

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
export const BoxTypeLabel = styled(Typography)({
  textTransform: "capitalize",
  fontWeight: 700,
});
export const FieldLabel = styled(Typography)({
  width: 120,
});
export const PriceBox = styled(Box)(({ theme }) => ({
  background: "rgba(255,255,255, 0.05)",
  borderRadius: "5px",
  backdropFilter: "blur(20px)",
  padding: theme.spacing(0.5),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  marginRight: theme.spacing(1),
  // width: 100,
  textAlign: "center",
  cursor: "pointer",
  "&.active": {
    border: "1px solid rgba(255, 255, 255, 0.8)",
  },
}));
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
export const countDownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) => {
  if (completed) {
    return "";
  } else {
    return (
      <Stack direction="row" spacing={1}>
        <CountdownStack>
          <Typography fontSize="1.5rem" textAlign="center">
            {days < 10 ? "0" : ""}
            {days}
          </Typography>
          <Typography fontSize="0.7rem" mt="-0.5rem" textAlign="center">
            days
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="1.5rem" textAlign="center">
            {hours < 10 ? "0" : ""}
            {hours}
          </Typography>
          <Typography fontSize="0.7rem" mt="-0.5rem" textAlign="center">
            hours
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="1.5rem" textAlign="center">
            {minutes < 10 ? "0" : ""}
            {minutes}
          </Typography>
          <Typography fontSize="0.7rem" mt="-0.5rem" textAlign="center">
            min
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="1.5rem" textAlign="center">
            {seconds < 10 ? "0" : ""}
            {seconds}
          </Typography>
          <Typography fontSize="0.7rem" mt="-0.5rem" textAlign="center">
            sec
          </Typography>
        </CountdownStack>
      </Stack>
    );
  }
};
export const CustomButton = styled(Button)({
  padding: "0 30px",
  width: 200,
  textTransform: "uppercase",
});
