import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import OpenMotion from "./motion/OpenMotion.jsx";
import "./style.css";
createRoot(document.getElementById("root")).render(
  <OpenMotion>
    <App />
  </OpenMotion>,
);

import "./reference.css";

import "./motion/openmotion.css";
