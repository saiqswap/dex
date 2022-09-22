import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import React from "react";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const styleBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function ConfirmChangeChain({ open, _onClose, _onAccept }) {
  return (
    <Modal open={open} onClose={_onClose} sx={style}>
      <Box className="modal-confirm-change-chain-bg">
        <Typography variant="h6" className="custom-font">
          Confirm change chain
        </Typography>
        <Divider className="mb-20" />
        <Box
          display={"flex"}
          justifyContent={"center"}
          className="custom-font"
          mb={3}
        >
          <Typography>Do you want to change chain</Typography>
        </Box>
        <Box sx={styleBtn}>
          <Button
            sx={{ marginRight: "10px" }}
            className="btn-submit"
            onClick={() => _onAccept()}
          >
            Ok
          </Button>
          <Button
            sx={{ marginLeft: "10px" }}
            className="btn-cancel"
            onClick={() => _onClose()}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
