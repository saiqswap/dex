import React from "react";
import './style.scss'

const CustomBox = ({ style, children }) => {
  return (
    <div className="custom-box" style={style}>
      <div className="top-left"></div>
      <div className="top-right"></div>
      <div className="bottom-left"></div>
      <div className="bottom-right"></div>
      {children}
    </div>
  );
};

export default CustomBox;
