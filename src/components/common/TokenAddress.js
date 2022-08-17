import { Box } from "@mui/system";
import React from "react";
import { formatAddress, _linkToBlockChain } from "../../settings/format";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

export default function TokenAddress({ tokenAddress, tokenId }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      style={{
        textTransform: "none",
        borderRadius: 100,
        backgroundColor: "var(--main-color)",
        padding: "10px 20px",
        width: "fit-content",
      }}
    >
      <a
        href={_linkToBlockChain(`/token/${tokenAddress}?a=${tokenId}`)}
        target="_blank"
        rel="noreferrer"
      >
        {formatAddress(tokenAddress) + "_" + tokenId}
      </a>
      <Box mr={1} ml={1}>
        <span>|</span>
      </Box>
      <CopyToClipboard
        text={tokenAddress + "_" + tokenId}
        onCopy={() => toast("Copied")}
      >
        <ContentCopyIcon style={{ fontSize: "1rem", cursor: "pointer" }} />
      </CopyToClipboard>
    </Box>
  );
}
