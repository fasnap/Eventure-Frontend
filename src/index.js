import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";
import "./interceptor/axios";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="880577925550-1pjg148ot8qt78cdmsqg5m8nak23b8pp.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
