const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
  const { appOutDir, target, electronPlatformName } = context;
  const appPath = appOutDir;

  // For Windows
  if (electronPlatformName === "win32") {
    const regFilePath = path.join(appOutDir, "relocke.reg");
    let regContent = fs.readFileSync(regFilePath, "utf-8");
    regContent = regContent.replace(
      "{appPath}",
      `"${appPath.replace(/\\/g, "\\\\")}"`
    );
    fs.writeFileSync(regFilePath, regContent);
  }

  // For Linux
  if (electronPlatformName === "linux") {
    const desktopFilePath = path.join(appOutDir, "relocke.desktop");
    let desktopContent = fs.readFileSync(desktopFilePath, "utf-8");
    desktopContent = desktopContent.replace("{appPath}", appPath); // Replace with actual app path
    fs.writeFileSync(desktopFilePath, desktopContent);
  }
};
