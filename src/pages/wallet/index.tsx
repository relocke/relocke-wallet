import ReLockeIcon from "../../icons/relocke-icon";
import React from "react";
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

const query = /* GraphQL */ `
  mutation (
    $account: name!
    $permission: name! = "active"
    $parent: name! = "owner"
  ) {
    jungle {
      serialize_transaction(
        actions: [
          {
            eosio: {
              updateauth: {
                account: $account
                permission: $permission
                parent: $parent
                auth: {
                  accounts: []
                  keys: [
                    {
                      key: "PUB_K1_6bz9b2rmwB99kmHak87WD3cpE2Eyguk4Dv9nXetDvr1GCoF8ts"
                      weight: 1
                    }
                  ]
                  waits: []
                  threshold: 1
                }
                authorization: { actor: $account }
              }
            }
          }
        ]
      ) {
        transaction_body
        transaction_header
        chain_id
      }
    }
  }
`;

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
            <div className={style.modalContainer}>
              <ModalButton onClick={() => wallet.setSuccess(false)}>
                X
              </ModalButton>

              {wallet.success && (
                <div className={style.changePassContainerSuccess}>
                  <TickIconWithCircle className={style.successTick} />
                  <p className={style.successMsg}>{wallet.success}</p>
                </div>
              )}

              {!wallet.success && (
                <div className={style.changePassContainer}>
                  <div className={style.changePassContainer2}>
                    <h1>Change Wallet Password</h1>
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
                          else
                            e.target.setCustomValidity(
                              "Passwords do not match"
                            );
                        }}
                        type="password"
                      />
                      <FormButton>Update password</FormButton>
                    </Form>
                  </div>
                </div>
              )}
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
              <p>Your wallet currently has no private keys.</p>
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
              placeholder="Add private Key"
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
