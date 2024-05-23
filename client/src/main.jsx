import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <CssBaseline />
      {/*the below div will prevent the default behaviour of the right click */}
     <div onContextMenu={(e)=>e.preventDefault()}>
     <App />
     </div>
    </HelmetProvider>
  </React.StrictMode>
);
