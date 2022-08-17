import { Skeleton } from "@mui/material";
import React from "react";

export default function UserAvatar({
  src,
  id,
  className,
  size = "small",
  hasLine,
  onClick,
}) {
  const exampleAvatarCount = 15;

  if (id) {
    let imageSrc = src;
    const idString = id.toString();
    if (!src) {
      const lastChar = parseFloat(idString.slice(-2));
      if (lastChar > exampleAvatarCount) {
        const lastChar = parseFloat(idString.slice(-1));
        imageSrc = `/images/avatar/avatar_${lastChar}.png`;
      } else {
        imageSrc = `/images/avatar/avatar_${lastChar}.png`;
      }
    }

    return (
      <div
        className={`user-avatar ${size} ${hasLine ? "line" : null} ${className}`}
        onClick={onClick}
      >
        <img src={imageSrc} alt="user-avatar" />
      </div>
    );
  } else {
    return (
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        className={`user-avatar ${size} ${hasLine ? "line" : null}`}
        onClick={onClick}
      />
    );
  }
}
