import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import { toast } from "react-toastify";

const CopyBox = ({ content, children }) => {
  const handleCopy = (e) => {
    toast.success("Copped");
  };
  return (
    <CopyToClipboard text={content} onCopy={(value, e) => handleCopy(e)}>
      <span style={{ cursor: "pointer" }}>{children}</span>
    </CopyToClipboard>
  );
};

export default CopyBox;
