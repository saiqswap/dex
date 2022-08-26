import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import "../styles/fire.css";
import "../styles/new-marketplace.scss";

const CustomTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  color: "rgba(255, 255, 255, 0.1)",
  WebkitTextStroke: "1px rgba(255, 255, 255, 0.9)",
  fontFamily: "Orbitron !important",
  cursor: "default",
  transition: "all 0.5s ease-in-out",
  lineHeight: "30px",
  "&:hover": {
    transform: "scaleX(1.05)",
  },
}));

const CustomTitleH1 = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  color: "rgba(255, 255, 255, 0.9)",
  fontFamily: "Orbitron !important",
  cursor: "default",
  transition: "all 0.5s ease-in-out",
  "&:hover": {
    transform: "scaleX(1.05)",
    color: "#fff",
  },
}));

const CustomImage = styled("img")(({ theme }) => ({
  minHeight: 600,
  height: "80vh",
  objectFit: "contain",
}));

const CustomButton = styled(Button)(({ theme }) => ({
  minHeight: "45px",
  width: "200px!important",
  display: "flex",
  padding: " 0px 40px",
  color: "#fff!important",
  borderRadius: "7px !important",
  textTransform: "uppercase!important",
  background: "rgba(255, 255, 255, 0.1) !important",
  fontFamily: "Orbitron !important",
  margin: "auto",
  marginTop: theme.spacing(3),
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2) !important",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    width: "100%!important",
  },
}));

export default function Homepage() {
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  return (
    <Container maxWidth="xl">
      <Box
        id="new-marketplace"
        sx={{
          marginTop: "0!important",
        }}
      >
        <div
          className="bg-main"
          style={{
            background: "url(/images/backgrounds/background.png)",
            height: "100%",
          }}
        ></div>
        <Container>
          <Grid container>
            <Grid item xs={12}>
              <Box
                textAlign="center"
                display="flex"
                justifyContent="center"
                flexDirection="column"
              >
                <CustomImage
                  src={`/images/landinpage/Angel-group.png`}
                  alt="thumbnail"
                  className="animate__animated animate__fadeInRight"
                />
                <Box mt="-120px" sx={{ zIndex: 10 }}>
                  <CustomTitle variant={"h3"}>{library.WELCOME_TO}</CustomTitle>
                  <CustomTitleH1 variant={"h2"}>INFINITY ANGEL</CustomTitleH1>
                </Box>
                <Container maxWidth="md">
                  <Box textAlign="center">
                    <Typography
                      variant="body2"
                      mt={3}
                      sx={{
                        transition: "all 0.5s ease-in-out",
                        cursor: "default",
                        "&:hover": {
                          color: "var(--primary-color)",
                        },
                        zIndex: 1,
                        position: "relative",
                      }}
                    >
                      {library.HOMEPAGE_INTRO}
                    </Typography>
                    <CustomButton
                      component={Link}
                      href="https://infinityangel.io/"
                      target="_blank"
                    >
                      {library.GO_TO_HOMEPAGE}
                    </CustomButton>
                  </Box>
                </Container>
              </Box>
              {[...Array(77).keys()].map((item, index) => (
                <div className="firefly" key={index} />
              ))}
            </Grid>
            {/* <Grid item xs={4}>
              <CustomButton>
                <Facebook fontSize="large" />
                <Typography>Facebook</Typography>
              </CustomButton>
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </Container>
  );
}
