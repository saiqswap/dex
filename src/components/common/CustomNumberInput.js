import { styled, TextField } from "@mui/material";
import React from "react";

const CustomInput = styled(TextField)(({ theme }) => ({
  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "input[type=number]": {
    "-moz-appearance": "textfield",
  },
}));

export default function CustomNumberInput(props) {
  return (
    <CustomInput
      type="number"
      onKeyDown={(e) => {
        if (["-", "+", "e"].includes(e.key)) {
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
