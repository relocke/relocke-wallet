import React from "react";
import ReactDOM from "react-dom/client";
import ReLockeIcon from "./icons/relocke-icon.js";

const App = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <ReLockeIcon />
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
} else {
  console.error("Root element not found");
}
