# ReLocke Wallet

**ReLocke Wallet** is a cross-platform desktop application built with Electron, React, and Vite, enabling secure key storage and transaction signing for Antelope based blockchains.

---

## 📦 Features

- 🔐 Encrypted local wallet storage
- 🔑 Key management (create, import, delete)
- ✍️ Transaction signing with confirmation dialogs
- 🌐 Local Express server for integration
- 🔗 Custom protocol handling (`relocke://`)
- 🪟 macOS, Windows, and Linux support

---

## Installation

### Prebuilt Releases

You can download the latest release for your OS from the [GitHub Releases](https://github.com/relocke/relocke-wallet/releases) page.

- **Windows**: `.exe` installer
- **macOS**: `.dmg` file
- **Linux**: `.AppImage`, `.deb`, or `.rpm`

Simply download and run the installer for your platform.

---

## Development Setup

To set up a development environment:

### 1. Clone the repository

```shell
git clone https://github.com/relocke/relocke-wallet.git
cd relocke-wallet
```

### 2. Install dependencies

```shell
npm install
npm run build
npm run package
```

### 3. Run development

```shell
npm run dev
```

### Troubleshooting

```shell
npm config delete proxy
npm config delete https-proxy
```
