import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <App />
      </SWRConfig>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
