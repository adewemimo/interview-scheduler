import { useState } from 'react';

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    if (replace) {
      setHistory(prev => [...prev.slice(0, prev.length - 1), newMode]);
    } else {
      setHistory(prev => [...prev, newMode]);
    }
  };

  const back = () => {
    const historyLength = history.length;
    if (historyLength > 1) {
      setMode(history[historyLength - 2]);
      setHistory(history.slice(0, historyLength - 1));
    }
  };

  return {
    mode,
    transition,
    back,
  };
}
