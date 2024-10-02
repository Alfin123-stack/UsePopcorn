import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./apps/App-v3";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      messages={["Sangat buruk", "buruk", "lumayan", "bagus", "sangat bagus"]}
    />
    <StarRating color="red" size={14} defaultRating={4} />
    <Test /> */}
  </React.StrictMode>
);
