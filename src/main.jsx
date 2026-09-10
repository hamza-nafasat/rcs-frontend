import "./index.css";
import App from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Handle browser back-forward cache (bfcache) transitions smoothly during dev
if (import.meta.env.DEV && typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {}, { passive: true });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
