import { Divider, Drawer, Typography } from "@mui/material";
import React from "react";
import PinInput from "react-pin-input";

function GAConfirm({ open, _handleComplete }) {
  return (
    <Drawer anchor={"left"} open={open} className={"custom-modal-vk"}>
      <div
        style={{
          backgroundColor: "#fff",
          padding: 20,
        }}
      >
        <Typography variant="h6">Enter Google Authenticator Code</Typography>
        <Divider className="mt-10" />
        <PinInput
          className="pin-input"
          length={6}
          type="numeric"
          inputMode="number"
          style={{ padding: "20px 0" }}
          onComplete={(value) => {
            _handleComplete(value);
          }}
          autoSelect={true}
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
          focus={true}
        />
      </div>
    </Drawer>
  );
}

export default GAConfirm;
