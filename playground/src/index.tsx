import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style.css";

const container = document.getElementById("app") as HTMLElement;
createRoot(container).render(<App />);
