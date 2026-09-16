import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/**
 * Point d'entrée — BrowserRouter et tous les Providers sont désormais
 * gérés dans App.jsx pour une meilleure cohésion.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
