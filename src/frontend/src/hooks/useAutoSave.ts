import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";

const STORAGE_KEY = "fw_project_state";

export function useAutoSave() {
  const elements = useStore((s) => s.elements);
  const levels = useStore((s) => s.levels);
  const layers = useStore((s) => s.layers);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ elements, levels, layers }),
        );
      } catch {
        // localStorage full
      }
    }, 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [elements, levels, layers]);
}

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}
