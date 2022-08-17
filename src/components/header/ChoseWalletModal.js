import { Box, Divider, Modal, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { _connectToMetamaskWallet } from "../../onchain/onchain";
import { ADD_WALLET_ADDRESS } from "../../store/constants";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function ChoseWalletModal({ open, _onClose }) {
  const dispatch = useDispatch();

  const _handleUpdateWalletAddress = (address) => {
    dispatch({
      type: ADD_WALLET_ADDRESS,
      payload: address,
    });
  };

  return (
    <Modal open={open} onClose={_onClose} sx={style}>
      <Box className="modal-bg">
        <Typography variant="h6" className="custom-font">
          Connect Wallet
        </Typography>
        <Divider className="mb-20" />
        <Typography variant="body2" className="mb-20">
          Connect with your available wallet or create new wacllet to join our
          marketplace
        </Typography>
        <Box display="flex">
          <div
            onClick={() => {
              _connectToMetamaskWallet(
                "metamask",
                _handleUpdateWalletAddress,
                dispatch
              );
              _onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,.5)",
              width: "fit-content",
              cursor: "pointer",
              padding: "20px",
              margin: "0 auto",
              clipPath:
                "polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%, 12px 100%,0 calc(100% - 12px),0 12px)",
            }}
          >
            <img
              src="/images/metamask-logo.png"
              alt="logo metamask"
              width="50px"
              height="50px"
            />
            <Typography className="custom-font ml-10">
              Connect with Metamask
            </Typography>
          </div>
          <div
            onClick={() => {
              _connectToMetamaskWallet(
                "bitkeep",
                _handleUpdateWalletAddress,
                dispatch
              );
              _onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,.5)",
              width: "fit-content",
              cursor: "pointer",
              padding: "20px",
              margin: "0 auto",
              clipPath:
                "polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%, 12px 100%,0 calc(100% - 12px),0 12px)",
            }}
          >
            <img
              src="https://play-lh.googleusercontent.com/9ejeZqAJOWzOWMA3T40lKCv93aEolQd-dZ38JXfod8rSoo_mXOncDle5C9FoV8NTegAI"
              alt="logo metamask"
              width="50px"
              height="50px"
            />
            <Typography className="custom-font ml-10">
              Connect with Bitkeep
            </Typography>
          </div>
        </Box>

        <Typography variant="body2" className="mt-20">
          We do not own your private keys and cannot access your funds without
          your confirmation
        </Typography>
        <Typography variant="body2">
          See{" "}
          <a
            href="/docs/Infinity_Angel_NFT_Marketplace_Terms_And_Conditions.docx.pdf"
            target="_blank"
            style={{ color: "#2FA4FF", textDecoration: "underline" }}
          >
            Term and Condition.
          </a>
        </Typography>
      </Box>
    </Modal>
  );
}
