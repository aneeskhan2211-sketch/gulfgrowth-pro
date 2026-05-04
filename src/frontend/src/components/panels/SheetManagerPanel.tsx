import { BookOpen, FilePlus, Printer, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";

interface Sheet {
  id: string;
  title: string;
  discipline: string;
  scale: string;
  date: string;
}

const DEFAULT_SHEETS: Sheet[] = [
  {
    id: "A101",
    title: "Floor Plans",
    discipline: "Architecture",
    scale: "1:100",
    date: "2026-03-25",
  },
  {
    id: "A201",
    title: "Elevations",
    discipline: "Architecture",
    scale: "1:100",
    date: "2026-03-25",
  },
  {
    id: "A301",
    title: "Sections",
    discipline: "Architecture",
    scale: "1:50",
    date: "2026-03-25",
  },
  {
    id: "S101",
    title: "Structural Plans",
    discipline: "Structure",
    scale: "1:100",
    date: "2026-03-25",
  },
  {
    id: "M101",
    title: "MEP Coordination",
    discipline: "MEP",
    scale: "1:100",
    date: "2026-03-25",
  },
];

const DISC_COLORS: Record<string, string> = {
  Architecture: "#4A9EFF",
  Structure: "#FF6B35",
  MEP: "#4CAF50",
};

export function SheetManagerPanel() {
  const showSheetManager = useStore((s) => s.showSheetManager);
  const togglePanel = useStore((s) => s.togglePanel);

  const [sheets, setSheets] = useState<Sheet[]>(DEFAULT_SHEETS);
  const [activeSheetId, setActiveSheetId] = useState<string>("A101");

  if (!showSheetManager) return null;

  const activeSheet = sheets.find((s) => s.id === activeSheetId) ?? sheets[0];

  function addSheet() {
    const newId = `U${String(sheets.length + 1).padStart(3, "0")}`;
    const newSheet: Sheet = {
      id: newId,
      title: "New Sheet",
      discipline: "Architecture",
      scale: "1:100",
      date: new Date().toISOString().slice(0, 10),
    };
    setSheets((prev) => [...prev, newSheet]);
    setActiveSheetId(newId);
  }

  function exportSheet() {
    if (!activeSheet) return;
    toast.info(`Exporting ${activeSheet.id} — ${activeSheet.title}...`, {
      description: `Scale ${activeSheet.scale} · ${activeSheet.discipline}`,
    });
  }

  return (
    <div
      data-ocid="sheets_panel.panel"
      className="fixed right-0 top-0 h-full z-50 flex flex-col"
      style={{
        width: 420,
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
          <BookOpen size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold text-foreground">
            Sheet Manager
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="sheets_panel.add_sheet.button"
            onClick={addSheet}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium transition-colors"
            style={{ background: "#2F7DFF", color: "#fff" }}
          >
            <FilePlus size={10} />
            Add Sheet
          </button>
          <button
            type="button"
            data-ocid="sheets_panel.close_button"
            onClick={() => togglePanel("sheetManager")}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Body — sidebar + canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sheet list sidebar */}
        <div
          className="flex flex-col overflow-y-auto flex-shrink-0"
          style={{ width: 130, borderRight: "1px solid #3A424D" }}
        >
          {sheets.map((sheet, i) => (
            <button
              type="button"
              key={sheet.id}
              data-ocid={`sheets_panel.item.${i + 1}`}
              onClick={() => setActiveSheetId(sheet.id)}
              className={`w-full text-left px-3 py-2.5 transition-colors ${
                activeSheetId === sheet.id
                  ? "bg-blue-600/20 border-l-2 border-l-blue-400"
                  : "border-l-2 border-l-transparent hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: DISC_COLORS[sheet.discipline] ?? "#888",
                  }}
                />
                <span className="text-[10px] font-bold text-foreground">
                  {sheet.id}
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground line-clamp-2">
                {sheet.title}
              </span>
            </button>
          ))}
        </div>

        {/* Sheet canvas area */}
        <div
          className="flex-1 overflow-auto p-4 flex items-start justify-center"
          style={{ background: "#0F1318" }}
        >
          {activeSheet && (
            <div
              data-ocid="sheets_panel.canvas_target"
              className="relative flex-shrink-0"
              style={{
                width: 260,
                height: 340,
                background: "#F5F2EC",
                border: "1px solid #9CA3AF",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              {/* Sheet border lines */}
              <div
                className="absolute"
                style={{
                  top: 8,
                  left: 8,
                  right: 8,
                  bottom: 48,
                  border: "0.5px solid #374151",
                }}
              />

              {/* Sheet content area label */}
              <div
                className="absolute flex flex-col items-center justify-center gap-1"
                style={{ top: 16, left: 16, right: 16, bottom: 56 }}
              >
                <BookOpen size={28} style={{ color: "#9CA3AF" }} />
                <span
                  className="text-[9px] text-center"
                  style={{ color: "#9CA3AF" }}
                >
                  {activeSheet.title}
                  <br />
                  Scale {activeSheet.scale}
                </span>
              </div>

              {/* Title block */}
              <div
                className="absolute left-0 right-0 bottom-0"
                style={{
                  height: 48,
                  borderTop: "1px solid #374151",
                  background: "#EDE8DC",
                  padding: "4px 8px",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="font-bold"
                      style={{ fontSize: 7, color: "#1F2937", lineHeight: 1.3 }}
                    >
                      MERIDIAN HOUSE
                    </p>
                    <p
                      style={{ fontSize: 6, color: "#374151", lineHeight: 1.4 }}
                    >
                      {activeSheet.title}
                    </p>
                    <p
                      style={{ fontSize: 6, color: "#6B7280", lineHeight: 1.4 }}
                    >
                      {activeSheet.discipline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-bold"
                      style={{ fontSize: 8, color: "#1F2937", lineHeight: 1.3 }}
                    >
                      {activeSheet.id}
                    </p>
                    <p
                      style={{ fontSize: 6, color: "#374151", lineHeight: 1.4 }}
                    >
                      {activeSheet.scale}
                    </p>
                    <p
                      style={{ fontSize: 6, color: "#6B7280", lineHeight: 1.4 }}
                    >
                      {activeSheet.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ borderTop: "1px solid #3A424D", background: "#141820" }}
      >
        <span className="text-[10px] text-muted-foreground">
          {sheets.length} sheet{sheets.length !== 1 ? "s" : ""}
        </span>
        <button
          type="button"
          data-ocid="sheets_panel.export.button"
          onClick={exportSheet}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-medium"
          style={{ background: "#2F7DFF", color: "#fff" }}
        >
          <Printer size={10} />
          Export Sheet
        </button>
      </div>
    </div>
  );
}
