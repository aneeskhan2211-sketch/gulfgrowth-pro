import { useEffect } from "react";
import { ClassicShell } from "../components/shell/ClassicShell";
import { StudioShell } from "../components/shell/StudioShell";
import { generateMeridianHouse } from "../data/meridianHouse";
import { loadSavedState, useAutoSave } from "../hooks/useAutoSave";
import { useToolShortcuts } from "../hooks/useToolShortcuts";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useStore } from "../store/useStore";

export function AppShell() {
  const shellMode = useStore((s) => s.shellMode);
  const setElements = useStore((s) => s.setElements);
  const setLevels = useStore((s) => s.setLevels);
  const setLayers = useStore((s) => s.setLayers);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional init-only effect
  useEffect(() => {
    const saved = loadSavedState();
    if (saved?.elements?.length) {
      setElements(saved.elements);
      if (saved.levels) setLevels(saved.levels);
      if (saved.layers) setLayers(saved.layers);
    } else {
      setElements(generateMeridianHouse());
    }
  }, []);

  useAutoSave();
  useUndoRedo();
  useToolShortcuts();

  return shellMode === "classic" ? <ClassicShell /> : <StudioShell />;
}
