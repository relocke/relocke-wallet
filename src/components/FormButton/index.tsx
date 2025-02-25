import React from "react";
import styles from "./styles.module.css";

export default function FormButton({ children, ...props }) {
  return (
    <button type="submit" className={styles.formbtn} {...props}>
      <small>{children}</small>
    </button>
  );
}
