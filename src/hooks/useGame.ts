import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame 必須在 GameProvider 內使用");
  }
  return context;
}