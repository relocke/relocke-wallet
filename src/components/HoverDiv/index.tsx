import React from "react";
import style from "./index.module.css";

export default function HoverDiv({ children, className = "", ...props }) {
  return (
    <div className={[style.container, className].join(" ")} {...props}>
      {children}
    </div>
  );
}
