import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { GameProvider } from "./context/GameContext";
import "./styles/index.css";

const container = document.getElementById("root")!;

// index.html 裡放了一段「載入中」的靜態內容，讓程式包還在下載時螢幕上不是一片
// 空白。React 掛載時本來就會清掉容器，這裡明確做一次，不去賭它的內部行為。
container.replaceChildren();

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <GameProvider>
        <App />
      </GameProvider>
    </BrowserRouter>
  </StrictMode>,
);