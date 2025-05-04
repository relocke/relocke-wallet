import React, { useState } from "react";
import ReLockeIcon from "../../icons/relocke-icon";
import RelockeLogo from "../../icons/relocke-logo";
import FormButton from "../../components/FormButton";
import Input from "../../components/Input";
import Form from "../../components/Form";

import style from "./index.module.css";

export default function CreateNewWallet() {
  const [pass, setPass] = useState("");

  async function handleCreateNew(fd: FormData) {
    const password = fd.get("password") as string;
    setPass("");
    const data = await window.relockeAPI.newWallet({ password });
    if (!data.success) throw new Error("Could not create new wallet!");
  }

  return (
    <>
      <nav className={style.nav}>
        <div>
          <ReLockeIcon />
        </div>
        <div className={style.flex}>
          <a href="#create-wallet">Create wallet</a>
          <a href="#">Login</a>
        </div>
      </nav>
      <div className={style.container}>
        <div>
          <RelockeLogo />

          <Form action={handleCreateNew}>
            <Input
              minLength={6}
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              required
              placeholder="Enter wallet Password"
              name="password"
              type="password"
            />
            <Input
              autoComplete="off"
              onChange={(e) => {
                e.target.setCustomValidity("");
                if (e.target.value != pass)
                  e.target.setCustomValidity("Passwords do not match!");
              }}
              required
              placeholder="Confirm password"
              name="repeate-pass"
              type="password"
            />
            <FormButton>Create Wallet</FormButton>
          </Form>
        </div>
      </div>
    </>
  );
}
