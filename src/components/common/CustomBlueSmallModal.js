import { Close } from "@mui/icons-material";
import { Backdrop, Box, Fade, IconButton, Modal, styled } from "@mui/material";
import React from "react";

const CustomBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  background: "rgba(165, 226, 255, 0.3)!important",
  outline: "none",
  textAlign: "center",
  maxWidth: 400,
  minWidth: 290,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  padding: theme.spacing(5),
  backdropFilter: "blur(60px)",
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    padding: theme.spacing(4),
    width: "100%!important",
  },
}));

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: 0,
  right: 0,
  minWidth: "unset!important",
  marginTop: "0px!important",
  background: "transparent!important",
  borderColor: "transparent!important",
});

export default function CustomBlueSmallModal({
  open,
  isShowCloseButton = false,
  _close,
  children,
  p = 0,
}) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{ zIndex: 999999 }}
    >
      <Fade in={open}>
        <CustomBox>
          {isShowCloseButton && (
            <CloseButton onClick={_close}>
              <Close />
            </CloseButton>
          )}
          {children}
        </CustomBox>
      </Fade>
    </Modal>
  );
}
