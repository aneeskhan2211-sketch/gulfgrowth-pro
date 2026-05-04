import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { useStore } from "../../store/useStore";

export function BottomLevelBar() {
  const levels = useStore((s) => s.levels);
  const activeLevel = useStore((s) => s.activeLevel);
  const setActiveLevel = useStore((s) => s.setActiveLevel);
  const addLevel = useStore((s) => s.addLevel);
  const deleteLevel = useStore((s) => s.deleteLevel);

  return (
    <div
      className="flex items-center h-9 px-2 border-t border-border flex-shrink-0"
      style={{ background: "oklch(var(--card))", minHeight: 36 }}
    >
      {/* Scrollable level tabs */}
      <div className="flex flex-1 overflow-x-auto items-center gap-0.5 min-w-0">
        {levels.map((level, i) => (
          <DropdownMenu key={level.id}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-ocid={`levels.tab.${i + 1}`}
                onClick={() => setActiveLevel(level.name)}
                className={`flex items-center px-3 h-7 rounded-sm text-xs font-medium flex-shrink-0 transition-colors ${
                  activeLevel === level.name
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                style={
                  activeLevel === level.name ? { background: "#2F7DFF" } : {}
                }
              >
                {level.name}
                <span className="ml-1 text-[9px] opacity-60">
                  {level.elevation >= 0 ? "+" : ""}
                  {level.elevation}m
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="text-xs">
              <DropdownMenuItem
                className="text-xs"
                onClick={() => setActiveLevel(level.name)}
              >
                Set Active
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs text-destructive"
                onClick={() => deleteLevel(level.id)}
              >
                Delete Level
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>

      {/* Always-visible add button */}
      <div className="flex-shrink-0 pl-1 border-l border-border ml-1">
        <button
          type="button"
          data-ocid="levels.add_button"
          onClick={() => {
            const name = `L${levels.length}`;
            addLevel({
              id: `level_${Date.now()}`,
              name,
              elevation: (levels.length - 1) * 4,
              elementCount: 0,
            });
          }}
          title="Add level"
          className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}
