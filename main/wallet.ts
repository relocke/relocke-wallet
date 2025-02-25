import keytar from "keytar";
import path from "path";
import fs from "fs";
import { app } from "electron";
import { encrypt, decrypt } from "./encryption";
import {
  legacy_to_private_key,
  private_key_to_wif,
  public_key_from_private_wif,
  sign2,
} from "./antelope-ecc.js";

const WALLET_FILE_PATH = path.join(
  app.getPath("userData"),
  "relocke.wallet.json"
);

export function getWallet() {
  return fs.existsSync(WALLET_FILE_PATH)
    ? JSON.parse(fs.readFileSync(WALLET_FILE_PATH, "utf8"))
    : null;
}

/**
 * Handles user unlocking their wallet.
 */
export default function Wallet() {
  let loggedIn = false;
  let wallet = getWallet();

  function storePassword(password: string) {
    const account = "relocke-user";
    return keytar.setPassword("relocke-wallet", account, password);
  }

  async function getPassword(): Promise<string | null> {
    const account = "relocke-user";
    const password = await keytar.getPassword("relocke-wallet", account);
    if (password) return password;
    return null;
  }

  async function Login(password: string) {
    try {
      if (typeof password !== "string")
        throw new Error("Expected password to be string");

      if (password == undefined || password == null || password == "")
        throw new Error("Invalid password");
      const pass = await getPassword();
      if (pass !== password) throw new Error("Invalid password");
      loggedIn = true;
    } catch (err) {
      loggedIn = false;
    }
  }

  function Logout() {
    loggedIn = false;
  }

  function isLoggedIn() {
    return loggedIn;
  }

  async function openWallet() {
    if (!isLoggedIn()) throw new Error("Please login first.");
    if (!wallet) throw new Error("No wallet found, please create one.");
    let decrypted_wallet;
    try {
      const password = (await getPassword()) as string;
      decrypted_wallet = JSON.parse(decrypt({ ...wallet, password }));
    } catch (err) {
      throw new Error("Unable to open wallet");
    }

    if (!decrypted_wallet)
      throw new Error(
        "Unable to open wallet, Invalid password recovered from keytar."
      );
    return decrypted_wallet;
  }

  async function updateWallet(keys: string[]) {
    if (!isLoggedIn()) throw new Error("Please login first.");
    if (!wallet) throw new Error("No wallet found, please create one.");
    const password = (await getPassword()) as string;
    const new_wallet = encrypt(
      JSON.stringify({
        ...keys,
        random_salt: crypto.getRandomValues(new Uint8Array(16)),
      }),
      password
    );

    fs.writeFileSync(WALLET_FILE_PATH, JSON.stringify(new_wallet));
    wallet = new_wallet;
  }

  async function deleteKey(wif_public_key: string) {
    const keys = await openWallet();
    delete keys[wif_public_key];
    updateWallet(keys);
  }

  async function insertKey(wif_private_key: string) {
    let private_key = wif_private_key.startsWith("5")
      ? await private_key_to_wif(legacy_to_private_key(wif_private_key))
      : wif_private_key;
    const public_key = await public_key_from_private_wif(private_key);
    const keys = await openWallet();
    keys[public_key] = private_key;
    updateWallet(keys);
  }

  async function changePassword(password: string, newPassword: string) {
    if (!loggedIn) throw new Error("Please login first.");
    if (!wallet) throw new Error("No wallet found");

    const current_password = await getPassword();
    if (current_password == undefined || current_password == null)
      throw new Error("Invalid stored password.");
    if (current_password !== password) throw new Error("Invalid password.");

    await storePassword(newPassword);

    const decrypted = JSON.parse(decrypt({ ...wallet, password }));
    if (!decrypted) throw new Error("Invalid password.");

    const new_password = await getPassword();
    if (!new_password) throw new Error("Invalid password");

    const new_wallet = encrypt(
      JSON.stringify({
        ...decrypted,
        random_salt: crypto.getRandomValues(new Uint8Array(16)),
      }),
      new_password
    );

    fs.writeFileSync(WALLET_FILE_PATH, JSON.stringify(new_wallet));

    wallet = new_wallet;
  }

  async function createWallet(password: string) {
    if (fs.existsSync(WALLET_FILE_PATH))
      throw new Error("Wallet already exists");
    await storePassword(password);

    const new_wallet = encrypt(
      JSON.stringify({
        random_salt: crypto.getRandomValues(new Uint8Array(16)),
      }),
      password
    );

    fs.writeFileSync(WALLET_FILE_PATH, JSON.stringify(new_wallet));

    wallet = new_wallet;
    loggedIn = true;
  }

  async function getPublicKeys() {
    const keys = await openWallet();
    const public_keys = Object.keys(keys);
    return public_keys;
  }

  async function sign(public_keys: string[], hash: string) {
    if (!loggedIn)
      throw new Error("Please open your wallet before signing transactions.");

    if (!(Array.isArray(public_keys) && public_keys.length))
      throw new Error("Expected public keys to be an array of keys.");

    if (!(typeof hash == "string" && hash?.length == 64))
      throw new Error(
        "hash must be 32 byte (64 character) hexadecimal string."
      );

    const keys = await openWallet();
    let private_keys;
    let message;
    try {
      private_keys = public_keys.map((public_key) => {
        if (!keys?.[public_key]) {
          message = `Wallet does not have the key ${public_key} stored`;
          throw new Error(message);
        }
        return keys[public_key];
      });
    } catch (err) {
      throw new Error(message);
    }
    let signatures;
    try {
      signatures = Promise.all(
        private_keys?.map((wif_private_key) => sign2({ wif_private_key, hash }))
      );
    } catch (err) {
      throw new Error(
        "Failed to generate signatures with the public keys you supplied."
      );
    }

    return signatures;
  }

  return Object.freeze({
    sign,
    createWallet,
    isLoggedIn,
    Login,
    Logout,
    insertKey,
    deleteKey,
    getPublicKeys,
    changePassword,
  });
}
