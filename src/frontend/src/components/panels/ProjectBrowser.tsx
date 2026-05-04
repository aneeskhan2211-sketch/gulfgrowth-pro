import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";

export function ProjectBrowser() {
  const elements = useStore((s) => s.elements);
  const selectElements = useStore((s) => s.selectElements);
  const [search, setSearch] = useState("");

  const filtered = elements.filter(
    (e) =>
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase()),
  );

  const byType: Record<string, typeof elements> = {};
  for (const e of filtered) {
    if (!byType[e.type]) byType[e.type] = [];
    byType[e.type].push(e);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="browser.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search elements..."
            className="pl-7 h-7 text-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X size={10} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Object.entries(byType).map(([type, els]) => (
          <div key={type}>
            <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-background sticky top-0">
              {type} ({els.length})
            </div>
            {els.map((el, i) => (
              <button
                type="button"
                key={el.id}
                data-ocid={`browser.item.${i + 1}`}
                onClick={() => selectElements([el.id])}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary transition-colors flex items-center gap-2 ${
                  el.selected ? "text-blue-400 bg-secondary" : "text-foreground"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: el.selected ? "#2F7DFF" : "#4A5568" }}
                />
                <span className="truncate">{el.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {el.level}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
