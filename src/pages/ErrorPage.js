import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="up-coming-page">
      <Box textAlign="center">
        <Typography variant="h3" className="title" textAlign="center">
          404
        </Typography>
        <Typography variant="h5" mb={2}>
          Oops!
        </Typography>
        <Typography>We're sorry,</Typography>
        <Typography>
          This page you were looking for doesn't exist anymore.
        </Typography>
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
