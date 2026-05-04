import { NON_PLACEMENT_TOOLS } from "../../data/toolDefaults";
import { toolDefinitions } from "../../data/toolDefinitions";
import { useStore } from "../../store/useStore";

export function HintBar() {
  const activeTool = useStore((s) => s.activeTool);
  const expertMode = useStore((s) => s.expertMode);

  if (expertMode !== "beginner") return null;

  const tool = toolDefinitions.find((t) => t.id === activeTool);
  const isPlacing = !NON_PLACEMENT_TOOLS.has(activeTool) && !!tool;

  const hint = isPlacing
    ? `Click in the 3D viewport to place ${tool?.name}. Press Esc to cancel.`
    : (tool?.description ??
      "Click an element to select it. Use the tool palette on the left to start drawing.");

  return (
    <div
      className="flex items-center h-7 flex-shrink-0 px-4 border-b border-border text-[11px] text-muted-foreground"
      style={{ background: "oklch(0.16 0.009 230)" }}
    >
      <span
        className="font-medium mr-2"
        style={{ color: isPlacing ? "#60A5FA" : "#6B9BD2" }}
      >
        {activeTool === "Select" ? "Select" : (tool?.name ?? activeTool)}:
      </span>
      {isPlacing ? (
        <span style={{ color: "#93C5FD", fontWeight: 500 }}>{hint}</span>
      ) : (
        <span className="truncate">{hint}</span>
      )}
    </div>
  );
}
