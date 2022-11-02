import { styled, TextField } from "@mui/material";
import React from "react";

const CustomInput = styled(TextField)(({ theme }) => ({
  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "input[type=number]": {
    MozAppearance: "textfield",
  },
}));

export default function CustomNumberInput(props) {
  return (
    <CustomInput
      onKeyDown={(e) => {
        if (["-", "+", "e", "E"].includes(e.key)) {
          e.preventDefault();
        }
        if (e.target.value.length === 0 && e.key === ".") {
          e.preventDefault();
        }
      }}
      {...props}
    />
  );
}
