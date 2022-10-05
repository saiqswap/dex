import { Box, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Title from "../components/box-minting/Title";
import BackgroundComponent from "../components/common/BackgroundComponent";
import { PRE_SALE_TOKEN } from "../settings/constants";
import AddPartnerRef from "../components/common/AddPartnerRef";
import PreSaleList from "../components/pre-sale/PreSaleList";
import { useDispatch, useSelector } from "react-redux";
import { _getPreSaleRoundList } from "../store/actions/preSaleActions";

export default function PresalePage() {
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(_getPreSaleRoundList());
    const timer = setInterval(() => {
      dispatch(_getPreSaleRoundList());
    }, 10000);
    return () => clearInterval(timer);
  }, [dispatch]);

  return (
    <BackgroundComponent>
      <Box mt={5} />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box display="flex" alignItems={"center"}>
          <img src={`/images/coins/ING.png`} alt="ing" height={50} />
          <Title
            variant="h5"
            sx={{ textAlign: "left", fontWeight: 500, ml: 1 }}
          >
            {PRE_SALE_TOKEN} {library.PRE_SALE}
          </Title>
        </Box>
        <Container maxWidth="sm" sx={{ pl: "0px!important", marginLeft: 0 }}>
          <Title
            variant="h3"
            sx={{
              fontWeight: 700,
              textAlign: "left",
              color: "#1588d6",
            }}
          >
            {library.RESALE_SCHEDULE}
          </Title>
        </Container>
        <Title variant="h6">{library.PRESALE_SUB_TITLE}</Title>
        <Typography mt={2} color="#F6B323">
          {PRE_SALE_TOKEN} (BSC)
        </Typography>
        <a
          href="https://bscscan.com/token/0xAe7c682Ba26AD6835B6150FfB35F22Db9987f509"
          target="_blank"
          alt=""
          rel="noreferrer"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography
            sx={{
              cursor: "pointer",
              color: "#fff",
            }}
          >
            {`0xAe7c682Ba26AD6835B6150FfB35F22Db9987f509`}
          </Typography>
        </a>
        <PreSaleList />
      </Container>
      <AddPartnerRef />
    </BackgroundComponent>
  );
}
