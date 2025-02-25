import { contextBridge, ipcRenderer } from "electron";
import { type AuthPassword } from "../src/types/window";

contextBridge.exposeInMainWorld("relockeAPI", {
  sign: (data: { wif_public_key: string; hash: string }) =>
    ipcRenderer.invoke("sign", data),
  newWallet: (data: AuthPassword) =>
    ipcRenderer.invoke("create-new-wallet", data),
  getWallet: () => ipcRenderer.invoke("get-wallet"),
  login: (data: AuthPassword) => ipcRenderer.invoke("login", data),
  logout: () => ipcRenderer.invoke("logout"),
  changePassword: (data: AuthPassword) =>
    ipcRenderer.invoke("change-password", data),
  insertKey: (data: { wif_private_key: string }) =>
    ipcRenderer.invoke("insert-key", data),
  deleteKey: (data: { wif_public_key: string }) =>
    ipcRenderer.invoke("delete-key", data),
  getPublicKeys: () => ipcRenderer.invoke("get-public-keys"),
  deleteWallet: () => ipcRenderer.invoke("delete-wallet"),
  isOpen: () => ipcRenderer.invoke("is-open"),
  signTransaction: () => ipcRenderer.invoke("sign-transaction"),
  addAutherizationKey: () => ipcRenderer.invoke("add-auth-key"),
});
