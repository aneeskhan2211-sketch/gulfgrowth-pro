import { Palette, X } from "lucide-react";
import { useStore } from "../../store/useStore";

const MATERIALS = [
  {
    id: "concrete",
    name: "Concrete",
    color: "#8a8a8a",
    roughness: 0.9,
    metalness: 0,
    description: "Cast-in-place concrete",
  },
  {
    id: "steel",
    name: "Steel",
    color: "#5a6570",
    roughness: 0.3,
    metalness: 0.9,
    description: "Structural steel",
  },
  {
    id: "glass",
    name: "Glass",
    color: "#a8d8ea",
    roughness: 0.05,
    metalness: 0.1,
    description: "Clear glazing",
  },
  {
    id: "brick",
    name: "Brick",
    color: "#c47a4a",
    roughness: 0.85,
    metalness: 0,
    description: "Clay masonry",
  },
  {
    id: "wood",
    name: "Wood",
    color: "#b5813c",
    roughness: 0.8,
    metalness: 0,
    description: "Structural timber",
  },
  {
    id: "aluminum",
    name: "Aluminum",
    color: "#b8c0c8",
    roughness: 0.2,
    metalness: 0.8,
    description: "Extruded aluminum",
  },
  {
    id: "gypsum",
    name: "Gypsum Board",
    color: "#e8e4dc",
    roughness: 0.95,
    metalness: 0,
    description: "Drywall / plasterboard",
  },
  {
    id: "insulation",
    name: "Insulation",
    color: "#f0c060",
    roughness: 1.0,
    metalness: 0,
    description: "Mineral wool / foam",
  },
];

export function MaterialLibraryPanel() {
  const showMaterialLibrary = useStore((s) => s.showMaterialLibrary);
  const togglePanel = useStore((s) => s.togglePanel);
  const selectedElementIds = useStore((s) => s.selectedElementIds);
  const updateElement = useStore((s) => s.updateElement);

  if (!showMaterialLibrary) return null;

  function applyMaterial(mat: (typeof MATERIALS)[0]) {
    for (const id of selectedElementIds) {
      updateElement(id, {
        material: {
          color: mat.color,
          roughness: mat.roughness,
          metalness: mat.metalness,
          opacity: 1,
        },
      });
    }
  }

  return (
    <div
      data-ocid="material_library.panel"
      className="flex flex-col h-full"
      style={{
        width: 300,
        background: "#1A1F26",
        borderLeft: "1px solid #3A424D",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid #3A424D" }}
      >
        <div className="flex items-center gap-2">
          <Palette size={13} style={{ color: "#2F7DFF" }} />
          <span className="text-xs font-semibold text-foreground">
            Material Library
          </span>
        </div>
        <button
          type="button"
          data-ocid="material_library.close_button"
          onClick={() => togglePanel("materialLibrary")}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {/* Material list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {MATERIALS.map((mat, i) => (
          <button
            key={mat.id}
            type="button"
            data-ocid={`material_library.item.${i + 1}`}
            onClick={() => applyMaterial(mat)}
            disabled={selectedElementIds.size === 0}
            className="w-full flex items-center gap-3 px-2 py-2 rounded text-left transition-colors hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#1F242B" }}
          >
            <div
              className="w-4 h-4 rounded flex-shrink-0"
              style={{
                background: mat.color,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground">
                {mat.name}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {mat.description}
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              {mat.metalness > 0 && (
                <span className="text-[9px] text-yellow-400/70">metal</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-3 py-2 flex-shrink-0"
        style={{ borderTop: "1px solid #3A424D" }}
      >
        {selectedElementIds.size === 0 ? (
          <p className="text-[10px] text-muted-foreground">
            Select elements in the viewport first
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground">
            {selectedElementIds.size} element
            {selectedElementIds.size !== 1 ? "s" : ""} selected — click a
            material to apply
          </p>
        )}
      </div>
    </div>
  );
}
