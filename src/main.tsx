import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          color: "#9a0002",
          fontWeight: "bold",
          borderRadius: "6px",
        },
        duration: 3000,
      }}
    />
    <App />
  </StrictMode>
);
