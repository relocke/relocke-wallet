import React from "react";
import { createPortal } from "react-dom";

import style from "./index.module.css";

export default function Form({
  children,
  confirm = "",
  action,
  containerRef = document.body,
  ...props
}) {
  const [errorMessage, setErrorMessage] = React.useState("");

  async function handleAction(data: FormData) {
    try {
      setErrorMessage("");
      if (confirm && !window.confirm(confirm)) return;
      action && (await action(data));
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <>
      <form {...props} action={handleAction} className={style.form}>
        {children}
      </form>

      {errorMessage &&
        createPortal(
          <div id={style.absolute}>
            <div className={style.msgContainer}>
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage("")}>X</button>
            </div>
          </div>,
          containerRef
        )}
    </>
  );
}
