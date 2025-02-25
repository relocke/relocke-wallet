import ReLockeIcon from "../../icons/relocke-icon";
import React, { useEffect, useState, useTransition } from "react";
import LogoutIcon from "../../icons/logout";
import CopyToClipBoardButton from "../../components/CopyToClipboard";
import ShieldIcon from "../../icons/shield-icon";
import InfoHover from "../../components/InfoHover";
import DeleteIcon from "../../icons/delete-icon";
import Modal, { ModalButton, ModalProvider } from "../../components/Modal";
import Form from "../../components/Form/index";
import NewKeyIcon from "../../icons/add-new-key-icon";
import Input from "../../components/Input";
import Center from "../../components/Center";
import FormButton from "../../components/FormButton";
import Button from "../../components/Button";
import TickIconWithCircle from "../../icons/tick-icon-with-circle";
import useWallet from "./hooks";
import style from "./index.module.css";
import HoverDiv from "../../components/HoverDiv";

export default function WalletPage() {
  const wallet = useWallet();

  return (
    <div className={style.container}>
      <nav>
        <div>
          <ReLockeIcon />
          <p className={style.walletKeysText}>Wallet Keys</p>
        </div>

        <ModalProvider>
          <ModalButton className={style.btn}>
            <ShieldIcon />
          </ModalButton>
          <Modal>
            {wallet.success && (
              <div className={style.successContainer}>
                <TickIconWithCircle />
                <span>{wallet.success}</span>
              </div>
            )}
            <div className={style.modalContainer}>
              <ModalButton>X</ModalButton>
              <div>
                <h1>Update Wallet Password</h1>
                <Form action={wallet.handleUpdatePassword}>
                  <Input
                    name="password"
                    placeholder="Current password"
                    type="password"
                    required
                  />
                  <Input
                    minLength={6}
                    required
                    name="new-password"
                    placeholder="Enter new password"
                    type="password"
                    onChange={(e) => wallet.setPassword(e.target.value)}
                  />
                  <Input
                    minLength={6}
                    required
                    name="repeate-password"
                    placeholder="Repeate password"
                    onChange={(e) => {
                      if (e.target.value == wallet.password)
                        e.target.setCustomValidity("");
                      else e.target.setCustomValidity("Passwords do not match");
                    }}
                    type="password"
                  />
                  <FormButton>Update password</FormButton>
                </Form>
              </div>
            </div>
          </Modal>
        </ModalProvider>
        <Button onClick={wallet.handleLogout} className={style.btn}>
          <LogoutIcon />
        </Button>
      </nav>
      <Center>
        <main>
          {!wallet.public_keys?.length && (
            <div className={style.noKeyMessage}>
              <p>Your wallet currently has no private keys added.</p>
            </div>
          )}
          <ul className={style.keyList}>
            {wallet.public_keys?.map((key) => (
              <li key={key}>
                <span>{key}</span>
                <div>
                  <InfoHover message="Copy to clipboard">
                    <CopyToClipBoardButton code={key} />
                  </InfoHover>
                  <button
                    onClick={() => wallet.handleDelete(key)}
                    className={style.deleteBtn}
                  >
                    <InfoHover message="Delete key">
                      <DeleteIcon />
                    </InfoHover>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>

        <div className={style.addKeyContainer}>
          <Form action={wallet.insertKey}>
            <Input
              className={style.privateKeyInput}
              type="password"
              placeholder="Enter new private Key"
              name="wif_private_key"
              required
            />
            <button type="submit">
              <NewKeyIcon />
            </button>
          </Form>
        </div>
      </Center>
    </div>
  );
}
