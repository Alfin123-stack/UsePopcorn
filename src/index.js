import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App-v2";

import StarRating from "./StarRating";

function Test() {
  const [rating, setRating] = useState(0);
  return (
    <div>
      <StarRating maxRating={10} onSetRating={setRating} />
      <p>this movie is rated by {rating} stars</p>
    </div>
  );
}

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
