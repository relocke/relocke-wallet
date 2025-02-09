import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>ReLocke</h1>
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
