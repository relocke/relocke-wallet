import React from "react";
import ReLockeIcon from "../../icons/relocke-icon";
import WarningIcon from "../../icons/warning-icon";
import styles from "./index.module.css";
import HoverDiv from "../../components/HoverDiv";

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <header>
        <ReLockeIcon />
      </header>

      <div className={styles.error}>
        <WarningIcon />
        <p>
          Your wallet has crashed, please restart the application to see if the
          issue resolves.
        </p>
      </div>
    </div>
  );
}
