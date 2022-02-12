import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import { App } from "./app";
import { Container } from "inversify";
import { performBind } from "./inversify.config";

performBind(new Container({ defaultScope: "Singleton" }));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
