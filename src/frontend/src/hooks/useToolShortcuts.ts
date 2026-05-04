import { useEffect } from "react";
import { useStore } from "../store/useStore";

const TOOL_SHORTCUTS: Record<string, string> = {
  w: "Wall",
  c: "Column",
  b: "Beam",
  f: "Floor",
  s: "Stair",
  d: "Door",
};

export function useToolShortcuts() {
  const setActiveTool = useStore((s) => s.setActiveTool);
  const selectedElementIds = useStore((s) => s.selectedElementIds);
  const deleteElements = useStore((s) => s.deleteElements);
  const clearSelection = useStore((s) => s.clearSelection);
  const pushHistory = useStore((s) => s.pushHistory);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (
        document.activeElement as HTMLElement
      )?.tagName?.toLowerCase();
      const isInput =
        tag === "input" ||
        tag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable;
      if (isInput) return;

      // Escape → Select
      if (e.key === "Escape") {
        setActiveTool("Select");
        return;
      }

      // Delete / Backspace → delete selected elements
      if (e.key === "Delete" || e.key === "Backspace") {
        const ids = Array.from(selectedElementIds);
        if (ids.length > 0) {
          deleteElements(ids);
          clearSelection();
          pushHistory("Delete elements");
        }
        return;
      }

      // Tool shortcuts — only when no modifier keys held
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const toolId = TOOL_SHORTCUTS[e.key.toLowerCase()];
        if (toolId) {
          e.preventDefault();
          setActiveTool(toolId);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    setActiveTool,
    selectedElementIds,
    deleteElements,
    clearSelection,
    pushHistory,
  ]);
}
