import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import CreateNewWallet from "./pages/create-wallet";
import Open from "./pages/open";
import Wallet from "./pages/wallet/index.js";
import DeleteWallet from "./pages/delete-wallet";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Open />} />
        <Route path="/create-wallet" element={<CreateNewWallet />} />
        <Route path="/delete-wallet" element={<DeleteWallet />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
} else {
  console.error("Root element not found");
}
