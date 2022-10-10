import {
  Box,
  Divider,
  Link,
  Step,
  StepContent,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import { CustomCard, CustomStep } from "./PresaleStyles";

const list = [
  <Typography variant="body1">
    Private Pool: October 4, 12:00–13:00 UTC
  </Typography>,
  <Typography variant="body1">
    Public Pool: October 4, 13:00–14:00 UTC
  </Typography>,
  <Typography variant="body1">TGE: October 2 </Typography>,
  <Typography variant="body1">Listing MEXC: October 5, 7:00 UTC</Typography>,
  <Typography variant="body1">Listing Huobi: October 5, 7:00 UTC</Typography>,
  <Divider
    sx={{
      mt: 2,
      mb: 2,
    }}
  />,
  <Typography variant="h6">Infinity Angel IDO DETAILS 📝</Typography>,
  <Typography variant="body1">
    IDO Location:{" "}
    <Link href="https://nftb.io/launch/" target="_blank">
      https://nftb.io/launch/
    </Link>
  </Typography>,
  <Typography variant="body1">Payment Token: $BUSD</Typography>,
  <Typography variant="body1">Token Symbol: $ING</Typography>,
  <Typography variant="body1">NFTb IDO $ING Price: $0.02</Typography>,
  <Divider
    sx={{
      mt: 2,
      mb: 2,
    }}
  />,

  <Typography variant="body1" color="unset">
    <Link
      href="https://blog.nftb.io/infinity-angel-ido-via-nftb-launchpad-how-it-works-808098a18f5d"
      target="_blank"
    >
      https://blog.nftb.io/infinity-angel-ido-via-nftb-launchpad-how-it-works-808098a18f5d
    </Link>
  </Typography>,
];

export default function PrivateRound() {
  return (
    <Box mt={3}>
      <CustomCard>
        <CustomStep orientation="vertical">
          <Step active={true}>
            <StepContent sx={{ width: "100%", mt: 1 }}>
              {list.map((l, index) => (
                <Fragment key={index}>{l}</Fragment>
              ))}
            </StepContent>
          </Step>
        </CustomStep>
      </CustomCard>
    </Box>
  );
}
