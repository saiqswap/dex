import React from "react";

const AngelGrade = ({ angel }) => {
  return (
    <div className={`angel-grade ${angel.level.toLowerCase()}`}>
      <div className="standing-1"></div>
      <div className="standing-2"></div>
    </div>
  );
};

export default AngelGrade;
