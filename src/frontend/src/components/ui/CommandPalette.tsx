import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { actionDefinitions, toolDefinitions } from "../../data/toolDefinitions";
import { useStore } from "../../store/useStore";

const allCommands = [
  ...toolDefinitions.map((t) => ({
    id: t.id,
    label: t.name,
    description: t.description,
    category: "Tool",
    action: "setTool",
  })),
  ...actionDefinitions.map((a) => ({
    id: a.id,
    label: a.name,
    description: a.description,
    category: "Action",
    action: "action",
  })),
];

export function CommandPalette() {
  const showCommandPalette = useStore((s) => s.showCommandPalette);
  const togglePanel = useStore((s) => s.togglePanel);
  const setActiveTool = useStore((s) => s.setActiveTool);
  const setRenderMode = useStore((s) => s.setRenderMode);
  const [query, setQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showCommandPalette) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setFocusedIndex(0);
    }
  }, [showCommandPalette]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        togglePanel("commandPalette");
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          togglePanel("commandPalette");
        }
      }
      if (e.key === "Escape" && showCommandPalette)
        togglePanel("commandPalette");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showCommandPalette, togglePanel]);

  const filtered = allCommands
    .filter(
      (c) =>
        !query ||
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 12);

  const executeCommand = (cmd: (typeof allCommands)[0]) => {
    if (cmd.action === "setTool") setActiveTool(cmd.id);
    else if (cmd.id.startsWith("render_"))
      setRenderMode(cmd.id.replace("render_", "") as any);
    else if (cmd.id.startsWith("panel_"))
      togglePanel(cmd.id.replace("panel_", ""));
    togglePanel("commandPalette");
  };

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setFocusedIndex(0);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[focusedIndex]) {
        executeCommand(filtered[focusedIndex]);
      }
    }
  }

  if (!showCommandPalette) return null;

  const closeOnEnter = () => togglePanel("commandPalette");

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click-to-close is supplemental to Escape key
    <div
      data-ocid="command_palette.modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={() => togglePanel("commandPalette")}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: inner panel stops propagation */}
      <div
        className="w-full max-w-xl rounded-lg overflow-hidden shadow-2xl"
        style={{ background: "#1F242B", border: "1px solid #3A424D" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search size={14} className="text-muted-foreground" />
          <input
            data-ocid="command_palette.search_input"
            ref={inputRef}
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Search tools, panels, actions..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="button"
            onClick={closeOnEnter}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
          <kbd className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded border border-border">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.map((cmd, i) => (
            <button
              type="button"
              key={cmd.id}
              data-ocid={`command_palette.item.${i + 1}`}
              onClick={() => executeCommand(cmd)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === focusedIndex ? "bg-secondary" : "hover:bg-secondary"
              }`}
            >
              <div className="flex-1">
                <div className="text-sm text-foreground">{cmd.label}</div>
                <div className="text-[10px] text-muted-foreground">
                  {cmd.description}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                {cmd.category}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for "{query}"
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t border-border flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>↵ Select</span>
          <span>↑↓ Navigate</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}
