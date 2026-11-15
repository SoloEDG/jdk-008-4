import React from "react";
import { createRoot } from "react-dom/client";
import { Workspace } from "./app/Workspace";
import "./app/styles.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Workspace />
  </React.StrictMode>,
);
