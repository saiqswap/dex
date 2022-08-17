import { Backdrop, Container, Fade, Modal, styled } from "@mui/material";
import React, { useEffect } from "react";

const CustomContainer = styled(Container)(() => ({
  minWidth: "300px",
  width: "calc(100vw - 30px)",
  maxWidth: "600px",
  background: "rgba(165, 226, 255, 0.3)",
  zIndex: 999,
  borderRadius: "15px",
  margin: "auto",
  padding: "20px 0px",
  minHeight: "400px",
  backdropFilter: "blur(60px)",
  border: "1px solid rgba(255, 255, 255, 0.09)",
  overflow: "auto",
  maxHeight: 600,
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
        <CustomContainer
          className="buy-box-confirm"
          align="center"
          maxWidth="md"
        >
          {children}
        </CustomContainer>
      </Fade>
    </Modal>
  );
}
