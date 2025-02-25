import React from "react";
import styles from "./styles.module.css";

export default function Input({ className, ...props }: { className: string }) {
  return (
    <input
      {...props}
      autoComplete="off"
      className={[styles.input, className].join(" ")}
    />
  );
}
