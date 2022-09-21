// @mui
import { Typography } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";

export default function Title({ children, variant, sx, width, ...other }) {
  var isDesktop = useResponsive("up", "sm");
  return (
    <Typography
      {...other}
      variant={variant ? variant : "h3"}
      sx={{
        // background:
        //   "-webkit-linear-gradient(rgba(0, 200, 151, 0.5), rgba(84, 99, 255, 0.5))",
        // WebkitBackgroundClip: "text",
        // WebkitTextFillColor: "transparent",
        width: width ? width : isDesktop ? "fit-content" : "100%",
        textAlign: "center",
        fontFamily: "Orbitron",
        zIndex: 99,
        position: "relative",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}
