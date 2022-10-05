import { Box, Link, styled } from "@mui/material";
import React from "react";

const CustomImage = styled("img")(({ theme }) => ({
  borderRadius: "10px",
  width: "100%",
}));

export default function ListingAds() {
  return (
    <Link
      href="https://www.huobi.com/support/en-us/detail/64917986150142"
      target="_blank"
    >
      <Box
        sx={{
          display: "inline-block",
          maxWidth: 400,
        }}
      >
        <CustomImage src="/images/banner/listing-banner.png" />
      </Box>
    </Link>
  );
}
