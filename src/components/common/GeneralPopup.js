import { Close } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Container,
  Fade,
  IconButton,
  Modal,
  styled,
} from "@mui/material";
import React, { useEffect } from "react";

const CustomContainer = styled(Box)(({ theme }) => ({
  overflow: "auto",
  maxHeight: 600,
  padding: theme.spacing(4),
}));
const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  minWidth: "unset!important",
  marginTop: "0px!important",
  background: "rgba(255, 255, 255, 0.1)!important",
  zIndex: 9999,
}));
const CustomBox = styled(Box)(({ theme }) => ({
  minWidth: "300px",
  width: "calc(100vw - 30px)",
  maxWidth: 900,
  background: "rgba(165, 226, 255, 0.3)",
  zIndex: 999,
  borderRadius: "15px",
  margin: "auto",
  minHeight: "400px",
  backdropFilter: "blur(60px)",
  border: "1px solid rgba(255, 255, 255, 0.09)",
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
}));

export default function GeneralPopup({
  open,
  onClose,
  children,
  noFollowClickOutside,
  disabled,
}) {
  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [open]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={noFollowClickOutside && onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{ zIndex: 9999 }}
    >
      <Fade in={open}>
        <CustomBox>
          <CloseButton onClick={onClose} size="small" disabled={disabled}>
            <Close />
          </CloseButton>
          <CustomContainer className="buy-box-confirm" align="center">
            {children}
          </CustomContainer>
        </CustomBox>
      </Fade>
    </Modal>
  );
}
