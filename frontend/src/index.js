import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Context from "./context/Context";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Context>
      <GoogleOAuthProvider clientId="724322629696-jrd8rbdfe6acmml0bsnnpmtkcmsvlajn.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>{" "}
    </Context>{" "}
  </BrowserRouter>
);

reportWebVitals();
