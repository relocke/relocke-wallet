import React from "react";
import ReLockeIcon from "../../icons/relocke-icon.tsx";
import Form from "../../components/Form/index.tsx";
import Input from "../../components/Input/index.tsx";
import FormButton from "../../components/FormButton/index.tsx";
import { ErrorBoundary } from "react-error-boundary";
import Link from "../../components/Link";
import SettingsIcon from "../../icons/settings-icon.tsx";
import {
  MenuButton,
  MenuDropDown,
  MenuProvider,
} from "../../components/Menu/index.tsx";
import "../../types/window.d.ts";
import "../../types/cssModules.d.ts";
import styles from "./styles.module.css";
import ErrorPage from "../error-page/index.tsx";
import DeleteIcon from "../../icons/delete-icon.tsx";
import appIcon from "../../assets/icons/1024x1024.png";

export default function LoginPage() {
  const [pass, setPass] = React.useState("");
  const [, startTransition] = React.useTransition();
  const [wallet, setWallet] = React.useState(false);

  async function handleLogin(fd: FormData) {
    const password = fd.get("password") as string;
    const data = await window.relockeAPI.login({ password });
    if (!data.success) throw new Error("Invalid password");
    window.location.hash = "#wallet";
  }

  React.useEffect(() => {
    startTransition(async () => {
      if (await window.relockeAPI.isOpen()) window.location.hash = "#wallet";
      else {
        const has_wallet = (await window.relockeAPI.getWallet()) as boolean;
        setWallet(has_wallet);
      }
    });
  }, []);

  async function handleCreateNew(fd: FormData) {
    const password = fd.get("password") as string;
    setPass("");
    const data = await window.relockeAPI.newWallet({ password });
    if (!data.success) throw new Error("Could not create new wallet!");
    setWallet(true);
  }

  return (
    <>
      {wallet && (
        <nav className={styles.nav}>
          <MenuProvider>
            <MenuButton>
              <SettingsIcon />
            </MenuButton>
            <MenuDropDown>
              <Link href="#delete-wallet" className={styles.link}>
                <DeleteIcon />
                <small>Delete&nbsp;wallet</small>
              </Link>
            </MenuDropDown>
          </MenuProvider>
        </nav>
      )}
      <div className={styles.grid}>
        <div>
          <ErrorBoundary fallback={<ErrorPage />}>
            <div className={styles.center}>
              <img
                // src={"/icons/1024x1024.png"}
                src={appIcon}
                className={styles.img}
                alt="ReLocke Wallet Icon"
              />
              <div>
                <ReLockeIcon />
              </div>
            </div>

            {!wallet && (
              <div className={styles.container}>
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
                  <FormButton>Create wallet</FormButton>
                </Form>
              </div>
            )}

            {wallet && (
              <div>
                <div className={styles.container}>
                  <Form action={handleLogin}>
                    <Input
                      onChange={(e) => setPass(e.target.value)}
                      value={pass}
                      required
                      placeholder="Enter wallet password"
                      name="password"
                      type="password"
                      minLength={6}
                    />
                    <FormButton>Open wallet →</FormButton>
                  </Form>
                </div>
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}
