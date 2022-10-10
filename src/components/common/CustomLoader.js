import React from "react";
import "../../styles/loader.scss";

const CustomLoader = () => {
  return (
    <div className="custom-lds-spinner lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default CustomLoader;
