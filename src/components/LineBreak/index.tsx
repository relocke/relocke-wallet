import React from "react";
import style from "./index.module.css";

export default function LineBreakTitle({ children, className = "", ...props }) {
  return (
    <div className={[style.grid, className].join(" ")} {...props}>
      <span className={style.line} />
      {children && <div>{children}</div>}
      <span className={style.line} />
    </div>
  );
}
