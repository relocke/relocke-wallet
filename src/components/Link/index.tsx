import React from "react";
import styles from "./index.module.css";

export default function Link({ children, className = "", ...props }) {
  return (
    <a {...props} className={[styles.link, className].join(" ")}>
      {children}
    </a>
  );
}
