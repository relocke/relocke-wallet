import { app, BrowserWindow, ipcMain, dialog, protocol } from "electron";
import path from "path";
import Wallet, { getWallet } from "./wallet.js";
import { Request, Response } from "express";
import fs from "fs";
import InstantiateServer from "./instantiate-server.js";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "relocke",
    privileges: {
      secure: true,
      standard: true,
    },
  },
]);

const wallet = Wallet();
const server = InstantiateServer();
let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "src/assets/icons/1024x1024.png"),
    webPreferences: {
      devTools: process.env.NODE_ENV === "development",
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else win.loadFile(path.join(__dirname, "renderer/index.html"));
}

function bringWindowToFront() {
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.show();
    win.focus();
  } else createWindow();
}

server.post("/get-keys", async (req: Request, res: Response) => {
  try {
    if (!win) throw new Error("No window instance found");
    if (!wallet.isLoggedIn()) {
      bringWindowToFront();
      await dialog.showMessageBox(win, {
        type: "info",
        title: "Open wallet",
        message: "Please open your wallet.",
        buttons: ["OK"],
      });

      throw new Error("Wallet needs to be opened before signing transactions.");
    }
    win.setAlwaysOnTop(false);

    if (!req.body)
      throw new Error("Expected public key list and a message digest sha256.");

    const public_keys = await wallet.getPublicKeys();

    res.json({ success: true, public_keys: public_keys.slice(1) });
  } catch (err: unknown) {
    if (err instanceof Error)
      return res.status(400).json({
        success: false,
        message: err.message,
      });

    res.status(500).send({ message: "unknow error has occurred" });
  }
});

server.post("/sign", async (req: Request, res: Response) => {
  bringWindowToFront();
  try {
    if (!win) throw new Error("No window instance found");
    if (!wallet.isLoggedIn()) {
      await dialog.showMessageBox(win, {
        type: "info",
        title: "Open wallet",
        message: "Please open your wallet before trying to sign transactions.",
        buttons: ["OK"],
      });

      throw new Error("Wallet needs to be opened before signing transactions.");
    }

    const { response } = await dialog.showMessageBox(win, {
      type: "question",
      title: "Sign transaction",
      message: "Confirm that you want to sign the transaction.",
      buttons: ["OK", "Cancel"],
      icon: path.join(__dirname, "src/assets/icons/1024x1024.png"),
    });

    win.setAlwaysOnTop(false);
    if (response) throw new Error("User did not accept transaction.");

    if (!req.body)
      throw new Error("Expected public key list and a message digest sha256.");
    const { public_keys, hash } = req.body;
    const signatures = await wallet.sign(public_keys, hash);

    res.json({ success: true, signatures });
  } catch (err: unknown) {
    if (err instanceof Error)
      return res.status(400).json({
        success: false,
        message: err.message,
      });

    res.status(500).send({ message: "unknow error has occurred" });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", bringWindowToFront);
app.whenReady().then(() => {
  protocol.handle("relocke", () => {
    // bringWindowToFront();
    return new Response("Some data", {
      status: 200, // Status code
      headers: { "Content-Type": "text/plain" },
    });
  });

  createWindow();
});

ipcMain.handle("login", async (_event, data) => {
  await wallet.Login(data.password);
  const success = wallet.isLoggedIn();
  return {
    success,
    message: success ? "Successfully opened wallet." : "Failed to authenticate",
  };
});

ipcMain.handle("create-new-wallet", async (_event, data) => {
  try {
    await wallet.createWallet(data.password);
    return { success: true, message: "New wallet successfully created." };
  } catch (err) {
    return { success: false, message: "Unable to create new wallet." };
  }
});

ipcMain.handle("get-wallet", () => {
  const wallet = getWallet();
  return !!wallet;
});

ipcMain.handle("logout", () => {
  wallet.Logout();
  return {
    success: true,
    message: "Successfully logged out!",
  };
});

ipcMain.handle("change-password", async (_event, data) => {
  try {
    if (!data.newPassword) throw new Error("No new password supplied");

    await wallet.changePassword(data.password, data.newPassword);

    return {
      success: true,
      message: "Successfully updated wallet password.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to update wallet password",
    };
  }
});

ipcMain.handle("insert-key", async (_event, data) => {
  try {
    await wallet.insertKey(data.wif_private_key);
    return {
      success: true,
      message: "Successfully updated wallet key.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to add key",
    };
  }
});

ipcMain.handle("delete-key", async (_event, data) => {
  try {
    await wallet.deleteKey(data.wif_public_key);
    return {
      success: true,
      message: "Removed key",
    };
  } catch (err) {
    return {
      success: false,
    };
  }
});

ipcMain.handle("get-public-keys", async (_event) => {
  try {
    const data = await wallet.getPublicKeys();
    return data.filter((x) => x != "random_salt");
  } catch (err) {
    return {
      success: false,
      message: "Failed to retrieve wallet keys",
    };
  }
});

ipcMain.handle("delete-wallet", async (_event) => {
  try {
    const WALLET_FILE_PATH = path.join(
      app.getPath("userData"),
      "relocke.wallet.json"
    );
    fs.unlinkSync(WALLET_FILE_PATH);
    return { success: true, message: "Deleted your wallet." };
  } catch (err) {
    return {
      success: false,
      message: "Failed to delete wallet.",
    };
  }
});

ipcMain.handle("is-open", async (_event) => {
  try {
    return wallet.isLoggedIn();
  } catch (err) {
    return false;
  }
});
