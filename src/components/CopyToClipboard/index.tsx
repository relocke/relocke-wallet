import React from "react";

import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import CopyIcon from "../../icons/copy-icon";
import TickIcon from "../../icons/tick-icon-with-circle";
import styles from "./styles.module.css";

export default function CopyToClipBoardButton({ code }) {
  const [copied, copyToClipboard] = useCopyToClipboard();

  const handleCopy = () => copyToClipboard(code);

  return (
    <button onClick={handleCopy} type="button" className={styles.btnContainer}>
      {copied ? (
        <TickIcon title="Copied to clipboard" aria-label="Success" />
      ) : (
        <CopyIcon title="Copy to clipboard" aria-label="Copy" />
      )}
    </button>
  );
}
