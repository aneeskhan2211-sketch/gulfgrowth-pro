import { ChevronDown, ChevronRight, MousePointer } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import { toolDefinitions } from "../../data/toolDefinitions";
import { useStore } from "../../store/useStore";

const DISCIPLINES = ["Architecture", "Structure", "MEP", "Parts", "Annotation"];

function ToolButton({
  tool,
  active,
  onClick,
}: {
  tool: (typeof toolDefinitions)[0];
  active: boolean;
  onClick: () => void;
}) {
  const IconComp = (LucideIcons as any)[tool.icon] || LucideIcons.Square;
  return (
    <button
      type="button"
      data-ocid={`tool.${tool.id.toLowerCase()}.button`}
      onClick={onClick}
      title={tool.description}
      className={`flex flex-col items-center justify-center gap-1 p-2 rounded cursor-pointer transition-colors text-center ${
        active
          ? "bg-blue-600 text-white"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
      style={{ minHeight: 52 }}
    >
      <IconComp size={14} />
      <span className="text-[10px] leading-tight">{tool.name}</span>
    </button>
  );
}

export function ToolPalette({ compact = false }: { compact?: boolean }) {
  const activeTool = useStore((s) => s.activeTool);
  const setActiveTool = useStore((s) => s.setActiveTool);
  const expertMode = useStore((s) => s.expertMode);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (d: string) => setCollapsed((p) => ({ ...p, [d]: !p[d] }));

  const filteredDisciplines =
    expertMode === "beginner" ? ["Architecture", "Structure"] : DISCIPLINES;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "oklch(var(--sidebar))" }}
    >
      <div className="p-2 border-b border-border">
        <button
          type="button"
          data-ocid="tool.select.button"
          onClick={() => setActiveTool("Select")}
          title="Select tool (click to select elements)"
          className={`flex items-center justify-center gap-2 w-full p-2 rounded transition-colors ${
            activeTool === "Select"
              ? "bg-blue-600 text-white"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <MousePointer size={14} />
          {!compact && <span className="text-[11px]">Select</span>}
        </button>
      </div>

      {filteredDisciplines.map((discipline) => {
        const tools = toolDefinitions.filter(
          (t) => t.discipline === discipline,
        );
        const isCollapsed = collapsed[discipline];
        return (
          <div key={discipline} className="border-b border-border">
            <button
              type="button"
              className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => toggle(discipline)}
            >
              <span>{discipline}</span>
              {isCollapsed ? (
                <ChevronRight size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>
            {!isCollapsed && (
              <div
                className={`grid gap-1 p-2 ${compact ? "grid-cols-1" : "grid-cols-2"}`}
              >
                {tools.map((tool) => (
                  <ToolButton
                    key={tool.id}
                    tool={tool}
                    active={activeTool === tool.id}
                    onClick={() => setActiveTool(tool.id)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
