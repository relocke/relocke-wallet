import { app, BrowserWindow } from "electron";
import * as path from "path";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Enable Node integration (use with caution)
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    // Load the Vite dev server URL in development
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    // In production, load the built index.html from the renderer build folder
    win.loadFile(path.join(__dirname, "renderer/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
