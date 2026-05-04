import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { Viewport } from "../viewport/Viewport";

const PRESET_VIEW_MAP: Record<string, "3d" | "plan" | "front" | "right"> = {
  perspective: "3d",
  top: "plan",
  front: "front",
  right: "right",
};

export function PresentationMode() {
  const showPresentationMode = useStore((s) => s.showPresentationMode);
  const togglePanel = useStore((s) => s.togglePanel);
  const renderMode = useStore((s) => s.renderMode);
  const setRenderMode = useStore((s) => s.setRenderMode);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const cameraPresets = useStore((s) => s.cameraPresets);
  const savedViews = useStore((s) => s.savedViews);
  const [savedViewIndex, setSavedViewIndex] = useState(0);

  useEffect(() => {
    if (!showPresentationMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        togglePanel("presentation");
        return;
      }
      if (e.key === "ArrowRight") {
        if (savedViews.length > 0) {
          setSavedViewIndex((prev) => {
            const next = (prev + 1) % savedViews.length;
            setViewMode(savedViews[next].viewMode);
            return next;
          });
        } else {
          const idx = cameraPresets.findIndex(
            (p) => PRESET_VIEW_MAP[p.id] === viewMode,
          );
          const next = cameraPresets[(idx + 1) % cameraPresets.length];
          const mapped = PRESET_VIEW_MAP[next.id];
          if (mapped) setViewMode(mapped);
        }
      }
      if (e.key === "ArrowLeft") {
        if (savedViews.length > 0) {
          setSavedViewIndex((prev) => {
            const next = (prev - 1 + savedViews.length) % savedViews.length;
            setViewMode(savedViews[next].viewMode);
            return next;
          });
        } else {
          const idx = cameraPresets.findIndex(
            (p) => PRESET_VIEW_MAP[p.id] === viewMode,
          );
          const next =
            cameraPresets[
              (idx - 1 + cameraPresets.length) % cameraPresets.length
            ];
          const mapped = PRESET_VIEW_MAP[next.id];
          if (mapped) setViewMode(mapped);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    showPresentationMode,
    togglePanel,
    savedViews,
    cameraPresets,
    viewMode,
    setViewMode,
  ]);

  if (!showPresentationMode) return null;

  return (
    <div
      data-ocid="presentation.modal"
      className="fixed inset-0 z-[100]"
      style={{ opacity: 1, transition: "opacity 0.3s ease" }}
    >
      <div className="absolute inset-0">
        <Viewport />
      </div>

      <div className="absolute bottom-16 left-6 pointer-events-none">
        <span className="text-[11px] text-white/30 font-medium tracking-widest uppercase">
          Meridian House
        </span>
      </div>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl"
        style={{
          background: "rgba(20,24,32,0.88)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Render mode */}
        <div className="flex items-center rounded overflow-hidden border border-white/10">
          {(["wireframe", "shaded", "rendered"] as const).map((rm) => (
            <button
              type="button"
              key={rm}
              data-ocid={`presentation.render_${rm}.toggle`}
              onClick={() => setRenderMode(rm)}
              className={`w-7 h-7 flex items-center justify-center text-[10px] font-bold transition-colors ${
                renderMode === rm
                  ? "bg-blue-500 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {rm[0].toUpperCase()}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* View mode */}
        <div className="flex items-center rounded overflow-hidden border border-white/10">
          {(
            [
              { id: "3d", label: "3D" },
              { id: "plan", label: "Plan" },
              { id: "front", label: "Front" },
              { id: "right", label: "Side" },
            ] as const
          ).map((v) => (
            <button
              type="button"
              key={v.id}
              data-ocid={`presentation.view_${v.id}.button`}
              onClick={() => setViewMode(v.id)}
              className={`px-2 h-7 flex items-center justify-center text-[10px] font-medium transition-colors ${
                viewMode === v.id
                  ? "bg-blue-500 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Camera presets — wired correctly */}
        {cameraPresets.map((preset) => (
          <button
            type="button"
            key={preset.id}
            data-ocid={`presentation.camera_${preset.id}.button`}
            onClick={() => {
              const m = PRESET_VIEW_MAP[preset.id];
              if (m) setViewMode(m);
            }}
            className="px-2.5 py-1 rounded text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            {preset.name}
          </button>
        ))}

        {savedViews.length > 0 && (
          <>
            <div className="w-px h-5 bg-white/10" />
            <span className="text-[9px] text-white/30">Views:</span>
            {savedViews.map((sv, idx) => (
              <button
                type="button"
                key={sv.id}
                data-ocid="presentation.saved_view.button"
                onClick={() => {
                  setSavedViewIndex(idx);
                  setViewMode(sv.viewMode);
                }}
                className={`px-2 py-1 rounded text-[10px] transition-colors ${
                  savedViewIndex === idx
                    ? "bg-blue-500/30 text-blue-300"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                {sv.name}
              </button>
            ))}
          </>
        )}

        <div className="w-px h-5 bg-white/10" />

        <button
          type="button"
          data-ocid="presentation.close_button"
          onClick={() => togglePanel("presentation")}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-medium transition-colors"
          style={{ background: "rgba(239,68,68,0.2)", color: "#EF4444" }}
        >
          <X size={11} /> Exit
        </button>
      </div>

      <div className="absolute top-4 right-4 pointer-events-none">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{
            background: "rgba(20,24,32,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Maximize2 size={10} className="text-white/30" />
          <span className="text-[9px] text-white/30">Presentation Mode</span>
          <kbd
            className="text-[9px] px-1 rounded"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            ESC
          </kbd>
          <span className="text-[9px] text-white/20 ml-1">← → navigate</span>
        </div>
      </div>
    </div>
  );
}
