import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSpreadsheet, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";

type DisciplineFilter = "All" | "Architecture" | "Structure" | "MEP";

interface QTORow {
  type: string;
  discipline: string;
  count: number;
  area: number;
  volume: number;
  weight: number;
}

export function QuantityTakeoffPanel() {
  const showQuantityTakeoff = useStore((s) => s.showQuantityTakeoff);
  const togglePanel = useStore((s) => s.togglePanel);
  const elements = useStore((s) => s.elements);

  const [filter, setFilter] = useState<DisciplineFilter>("All");

  if (!showQuantityTakeoff) return null;

  // Group elements by type
  const grouped = new Map<string, QTORow>();
  for (const el of elements) {
    const existing = grouped.get(el.type);
    const w = el.dimensions.width ?? 1;
    const h = el.dimensions.height ?? 1;
    const l = el.dimensions.length ?? 1;
    const area = el.dimensions.area ?? w * l;
    const volume = el.dimensions.volume ?? w * h * l;
    const weight = volume * 2.4; // concrete density t/m³

    if (existing) {
      existing.count += 1;
      existing.area += area;
      existing.volume += volume;
      existing.weight += weight;
    } else {
      grouped.set(el.type, {
        type: el.type,
        discipline: el.discipline,
        count: 1,
        area,
        volume,
        weight,
      });
    }
  }

  const rows = Array.from(grouped.values()).filter(
    (r) => filter === "All" || r.discipline === filter,
  );

  function exportCSV() {
    const header =
      "Type,Discipline,Count,Area (m²),Volume (m³),Est. Weight (t)\n";
    const body = Array.from(grouped.values())
      .map(
        (r) =>
          `${r.type},${r.discipline},${r.count},${r.area.toFixed(2)},${r.volume.toFixed(2)},${r.weight.toFixed(2)}`,
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FrameWorks_QTO.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const DISCIPLINES: DisciplineFilter[] = [
    "All",
    "Architecture",
    "Structure",
    "MEP",
  ];

  return (
    <div
      data-ocid="qto_panel.panel"
      className="fixed right-0 top-0 h-full z-50 flex flex-col"
      style={{
        width: 400,
        background: "#1A1F26",
        borderLeft: "1px solid #3A424D",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid #3A424D" }}
      >
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-foreground">
            Quantity Takeoff
          </span>
        </div>
        <button
          type="button"
          data-ocid="qto_panel.close_button"
          onClick={() => togglePanel("quantityTakeoff")}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Discipline filter tabs */}
      <div
        className="flex flex-shrink-0"
        style={{ borderBottom: "1px solid #3A424D" }}
      >
        {DISCIPLINES.map((d) => (
          <button
            type="button"
            key={d}
            data-ocid={`qto_panel.${d.toLowerCase()}_filter.tab`}
            onClick={() => setFilter(d)}
            className={`flex-1 py-1.5 text-[10px] font-medium transition-colors ${
              filter === d
                ? "text-foreground border-b-2 border-b-blue-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Table header */}
        <div
          className="grid flex-shrink-0 px-3 py-1.5"
          style={{
            gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 1.2fr",
            borderBottom: "1px solid #3A424D",
            background: "#141820",
          }}
        >
          {["Type", "Count", "Area m²", "Vol m³", "Weight t"].map((h) => (
            <span
              key={h}
              className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>

        {elements.length === 0 ? (
          <div
            data-ocid="qto_panel.empty_state"
            className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-6"
          >
            <FileSpreadsheet size={32} className="text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              Place elements to see quantities
            </p>
            <p className="text-[10px] text-muted-foreground/50">
              Use the modeling tools to add walls, slabs, columns and more.
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-[10px] text-muted-foreground">
              No {filter} elements found.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="divide-y" style={{ borderColor: "#2A303A" }}>
              {rows.map((row, i) => (
                <div
                  key={row.type}
                  data-ocid={`qto_panel.item.${i + 1}`}
                  className="grid px-3 py-2 hover:bg-white/5 transition-colors"
                  style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 1.2fr" }}
                >
                  <span className="text-[11px] text-foreground font-medium truncate">
                    {row.type}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {row.count}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {row.area.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {row.volume.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {row.weight.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ borderTop: "1px solid #3A424D", background: "#141820" }}
      >
        <span className="text-[10px] text-muted-foreground">
          {elements.length} element{elements.length !== 1 ? "s" : ""} total
        </span>
        <button
          type="button"
          data-ocid="qto_panel.export_csv.button"
          onClick={exportCSV}
          disabled={elements.length === 0}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-medium transition-colors"
          style={{
            background: elements.length === 0 ? "#374151" : "#2F7DFF",
            color: elements.length === 0 ? "#9CA3AF" : "#fff",
          }}
        >
          <FileSpreadsheet size={10} />
          Export CSV
        </button>
      </div>
    </div>
  );
}
