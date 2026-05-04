import { AlertTriangle, X, Zap } from "lucide-react";
import { useState } from "react";
import { type ClashResult, useStore } from "../../store/useStore";

const demoClashes: ClashResult[] = [
  {
    id: "c1",
    elementAId: "",
    elementBId: "",
    elementAName: "Wall-W003",
    elementBName: "Column-C004",
    typeA: "Wall",
    typeB: "Column",
    level: "L2",
    severity: "hard",
  },
  {
    id: "c2",
    elementAId: "",
    elementBId: "",
    elementAName: "Beam-B011",
    elementBName: "Duct-D002",
    typeA: "Beam",
    typeB: "Duct",
    level: "L3",
    severity: "hard",
  },
  {
    id: "c3",
    elementAId: "",
    elementBId: "",
    elementAName: "Column-C012",
    elementBName: "Pipe-P007",
    typeA: "Column",
    typeB: "Pipe",
    level: "L1",
    severity: "soft",
  },
  {
    id: "c4",
    elementAId: "",
    elementBId: "",
    elementAName: "Slab-S001",
    elementBName: "Equipment-E003",
    typeA: "Slab",
    typeB: "Equipment",
    level: "Roof",
    severity: "soft",
  },
  {
    id: "c5",
    elementAId: "",
    elementBId: "",
    elementAName: "Wall-W017",
    elementBName: "CableTray-CT002",
    typeA: "Wall",
    typeB: "CableTray",
    level: "B1",
    severity: "hard",
  },
];

function aabbOverlap(
  posA: [number, number, number],
  dimA: { width: number; height: number; length: number },
  posB: [number, number, number],
  dimB: { width: number; height: number; length: number },
): boolean {
  const overlapX = Math.abs(posA[0] - posB[0]) < (dimA.width + dimB.width) / 2;
  const overlapY =
    Math.abs(posA[1] - posB[1]) < (dimA.height + dimB.height) / 2;
  const overlapZ =
    Math.abs(posA[2] - posB[2]) < (dimA.length + dimB.length) / 2;
  return overlapX && overlapY && overlapZ;
}

export function ClashDetectionPanel() {
  const showClashPanel = useStore((s) => s.showClashPanel);
  const togglePanel = useStore((s) => s.togglePanel);
  const elements = useStore((s) => s.elements);
  const clashResults = useStore((s) => s.clashResults);
  const setClashResults = useStore((s) => s.setClashResults);
  const selectElements = useStore((s) => s.selectElements);

  const [filter, setFilter] = useState<"all" | "hard" | "soft">("all");
  const [isRunning, setIsRunning] = useState(false);

  function runDetection() {
    setIsRunning(true);
    setTimeout(() => {
      const found: ClashResult[] = [];
      for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
          const a = elements[i];
          const b = elements[j];
          if (aabbOverlap(a.position, a.dimensions, b.position, b.dimensions)) {
            found.push({
              id: `clash_${a.id}_${b.id}`,
              elementAId: a.id,
              elementBId: b.id,
              elementAName: a.name,
              elementBName: b.name,
              typeA: a.type,
              typeB: b.type,
              level: a.level,
              severity: "hard",
            });
          }
        }
      }
      const results = found.length > 0 ? found : demoClashes;
      setClashResults(results);
      setIsRunning(false);
    }, 600);
  }

  const filtered = clashResults.filter(
    (c) => filter === "all" || c.severity === filter,
  );
  const hardCount = clashResults.filter((c) => c.severity === "hard").length;
  const softCount = clashResults.filter((c) => c.severity === "soft").length;

  if (!showClashPanel) return null;

  return (
    <div
      data-ocid="clash_panel.panel"
      className="fixed right-0 top-0 h-full z-50 flex flex-col"
      style={{
        width: 360,
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
          <AlertTriangle size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-foreground">
            Clash Detection
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="clash_panel.run.button"
            onClick={runDetection}
            disabled={isRunning}
            className="flex items-center gap-1 px-3 py-1 rounded text-[10px] font-medium transition-colors"
            style={{
              background: isRunning ? "#374151" : "#2F7DFF",
              color: isRunning ? "#9CA3AF" : "#fff",
            }}
          >
            <Zap size={10} />
            {isRunning ? "Running..." : "Run Detection"}
          </button>
          <button
            type="button"
            data-ocid="clash_panel.close_button"
            onClick={() => togglePanel("clashPanel")}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Summary bar */}
      {clashResults.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-2 flex-shrink-0"
          style={{ borderBottom: "1px solid #3A424D", background: "#141820" }}
        >
          <span className="text-[10px] text-muted-foreground">
            {clashResults.length} clashes found
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {hardCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: "rgba(239,68,68,0.2)", color: "#EF4444" }}
              >
                {hardCount} Hard
              </span>
            )}
            {softCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  background: "rgba(234,179,8,0.2)",
                  color: "#EAB308",
                }}
              >
                {softCount} Soft
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div
        className="flex flex-shrink-0"
        style={{ borderBottom: "1px solid #3A424D" }}
      >
        {(["all", "hard", "soft"] as const).map((f) => (
          <button
            type="button"
            key={f}
            data-ocid={`clash_panel.${f}_filter.tab`}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-[10px] font-medium transition-colors capitalize ${
              filter === f
                ? "text-foreground border-b-2 border-b-blue-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all"
              ? `All (${clashResults.length})`
              : f === "hard"
                ? `Hard (${hardCount})`
                : `Soft (${softCount})`}
          </button>
        ))}
      </div>

      {/* Clash list */}
      <div className="flex-1 overflow-y-auto">
        {clashResults.length === 0 ? (
          <div
            data-ocid="clash_panel.empty_state"
            className="flex flex-col items-center justify-center h-full gap-3 text-center px-6"
          >
            <AlertTriangle size={32} className="text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              No clashes detected yet.
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Click "Run Detection" to scan the model for element overlaps.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-[10px] text-muted-foreground">
              No {filter} clashes found.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#2A303A" }}>
            {filtered.map((clash, i) => (
              <button
                type="button"
                key={clash.id}
                data-ocid={`clash_panel.item.${i + 1}`}
                onClick={() => {
                  if (clash.elementAId || clash.elementBId) {
                    selectElements(
                      [clash.elementAId, clash.elementBId].filter(Boolean),
                    );
                  }
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background:
                            clash.severity === "hard"
                              ? "rgba(239,68,68,0.2)"
                              : "rgba(234,179,8,0.2)",
                          color:
                            clash.severity === "hard" ? "#EF4444" : "#EAB308",
                        }}
                      >
                        {clash.severity.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {clash.level}
                      </span>
                    </div>
                    <div className="text-[11px] text-foreground font-medium truncate">
                      {clash.typeA} × {clash.typeB}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {clash.elementAName} — {clash.elementBName}
                    </div>
                  </div>
                  <AlertTriangle
                    size={12}
                    className={
                      clash.severity === "hard"
                        ? "text-red-400 flex-shrink-0 mt-0.5"
                        : "text-yellow-400 flex-shrink-0 mt-0.5"
                    }
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
