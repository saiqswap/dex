import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

export default function SwapPage() {
  return (
    <div className="up-coming-page">
      <Box textAlign="center">
        <Typography variant="h3" className="title" textAlign="center">
          COMING SOON
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={5}
          mb={2}
          px={2}
        >
          <Box display="flex" alignItems="center">
            <img src="/images/coins/INC.png" width="50px" alt="inc" />
            <Typography>INC</Typography>
          </Box>
          <TrendingFlatIcon fontSize="large" />
          <Box display="flex" alignItems="center">
            <img src="/images/coins/ING.png" width="50px" alt="ing" />
            <Typography>ING</Typography>
          </Box>
        </Box>
        <Box>
          <Typography>Opening 16:00 at 18/10/2022 (UTC +9)</Typography>
        </Box>
        <Button
          className="custom-btn"
          sx={{ mt: 5 }}
          component={Link}
          to="/marketplace"
        >
          Back to Marketplace
        </Button>
      </Box>
    </div>
  );
}
