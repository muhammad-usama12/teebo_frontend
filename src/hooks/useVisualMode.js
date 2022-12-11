import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // "Replace = true" replaces most recent mode
  const transition = (mode, replace = false) => {
    let newHistory = [...history];

    if (replace) {
      newHistory.pop(newHistory[newHistory.length - 1]);
      newHistory.push(mode);
      setHistory(newHistory);
      setMode(mode)
    } else {
      newHistory.push(mode);
      setHistory(newHistory)
      setMode(mode);
    }
  };

  const back = () => {
    if (history.length > 1) {
      let newHistory = [...history]
      newHistory.pop(mode);
      setHistory(newHistory);
      setMode(newHistory[newHistory.length - 1]);
    }
  };

  return { mode, transition, back };
}