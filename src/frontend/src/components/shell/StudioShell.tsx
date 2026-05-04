import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import {
  Box,
  ChevronDown,
  Command,
  Contrast,
  HelpCircle,
  LayoutTemplate,
  X,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";
import { ClashDetectionPanel } from "../panels/ClashDetectionPanel";
import { CostEstimator } from "../panels/CostEstimator";
import { DocumentationPanel } from "../panels/DocumentationPanel";
import { MaterialLibraryPanel } from "../panels/MaterialLibraryPanel";
import { PluginPanel } from "../panels/PluginPanel";
import { PropertiesPanel } from "../panels/PropertiesPanel";
import { QuantityTakeoffPanel } from "../panels/QuantityTakeoffPanel";
import { SchedulesPanel } from "../panels/SchedulesPanel";
import { SheetManagerPanel } from "../panels/SheetManagerPanel";
import { SimulationPanel } from "../panels/SimulationPanel";
import { SymbolLibraryPanel } from "../panels/SymbolLibraryPanel";
import { ToolPalette } from "../panels/ToolPalette";
import { CommandPalette } from "../ui/CommandPalette";
import { OnboardingTour } from "../ui/OnboardingTour";
import { Viewport } from "../viewport/Viewport";
import { BottomLevelBar } from "./BottomLevelBar";
import { PresentationMode } from "./PresentationMode";
import { RevisionManager } from "./RevisionManager";

type StudioPanelId =
  | "simulation"
  | "documentation"
  | "costEstimator"
  | "plugin"
  | "properties";

export function StudioShell() {
  const setShellMode = useStore((s) => s.setShellMode);
  const renderMode = useStore((s) => s.renderMode);
  const setRenderMode = useStore((s) => s.setRenderMode);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const highContrast = useStore((s) => s.highContrast);
  const setHighContrast = useStore((s) => s.setHighContrast);
  const togglePanel = useStore((s) => s.togglePanel);
  const showSimulation = useStore((s) => s.showSimulation);
  const showDocumentation = useStore((s) => s.showDocumentation);
  const showCostEstimator = useStore((s) => s.showCostEstimator);
  const showPlugin = useStore((s) => s.showPlugin);
  const selectedElementIds = useStore((s) => s.selectedElementIds);

  const anySecondaryOpen =
    showSimulation || showDocumentation || showCostEstimator || showPlugin;

  const openPanels: Array<{ id: StudioPanelId; label: string }> = [
    ...(showSimulation
      ? [{ id: "simulation" as StudioPanelId, label: "Simulate" }]
      : []),
    ...(showDocumentation
      ? [{ id: "documentation" as StudioPanelId, label: "Docs" }]
      : []),
    ...(showCostEstimator
      ? [{ id: "costEstimator" as StudioPanelId, label: "Cost" }]
      : []),
    ...(showPlugin
      ? [{ id: "plugin" as StudioPanelId, label: "Scripts" }]
      : []),
    ...(!anySecondaryOpen && selectedElementIds.size > 0
      ? [{ id: "properties" as StudioPanelId, label: "Properties" }]
      : []),
  ];

  const hasRightPanel = openPanels.length > 0;
  const [activeStudioTab, setActiveStudioTab] =
    useState<StudioPanelId>("simulation");

  const resolvedActiveTab: StudioPanelId = openPanels.some(
    (p) => p.id === activeStudioTab,
  )
    ? activeStudioTab
    : (openPanels[0]?.id ?? "simulation");

  function handleCloseStudioTab(id: StudioPanelId) {
    if (id !== "properties") togglePanel(id);
    const remaining = openPanels.filter((p) => p.id !== id);
    if (remaining.length > 0) setActiveStudioTab(remaining[0].id);
  }

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden ${highContrast ? "high-contrast" : ""}`}
    >
      <div className="absolute inset-0">
        <Viewport />
      </div>

      {/* Floating top bar */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg z-10"
        style={{
          background: "rgba(31,36,43,0.92)",
          border: "1px solid #3A424D",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box size={14} style={{ color: "#2F7DFF" }} />
        <span className="text-xs font-semibold text-foreground">
          Meridian House
        </span>
        <div className="w-px h-4 bg-border mx-1" />

        <div className="flex items-center rounded overflow-hidden border border-border">
          {(["wireframe", "shaded", "rendered"] as const).map((rm) => (
            <button
              type="button"
              key={rm}
              onClick={() => setRenderMode(rm)}
              className={`px-2 py-0.5 text-[10px] transition-colors ${
                renderMode === rm
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {rm.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center rounded overflow-hidden border border-border">
          {(
            [
              { id: "3d", label: "3D" },
              { id: "plan", label: "Plan" },
              { id: "front", label: "Elev" },
              { id: "right", label: "Side" },
              { id: "section", label: "Sect" },
            ] as const
          ).map((v) => (
            <button
              type="button"
              key={v.id}
              data-ocid={`studio.view_${v.id}.button`}
              onClick={() => setViewMode(v.id)}
              className={`px-2 py-0.5 text-[10px] transition-colors ${
                viewMode === v.id
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShellMode("classic")}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-muted-foreground hover:text-foreground border border-border transition-colors"
        >
          <LayoutTemplate size={11} /> Classic
        </button>

        <button
          type="button"
          onClick={() => togglePanel("commandPalette")}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          title="Command Palette"
        >
          <Command size={12} />
        </button>

        <button
          type="button"
          onClick={() => setHighContrast(!highContrast)}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          title="Toggle high contrast"
        >
          <Contrast size={12} />
        </button>

        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("fw_restart_tour"))
          }
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          title="Restart tour"
        >
          <HelpCircle size={12} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] text-muted-foreground hover:text-foreground border border-border transition-colors"
            >
              Panels <ChevronDown size={9} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-xs"
              onClick={() => {
                togglePanel("simulation");
                setActiveStudioTab("simulation");
              }}
            >
              Simulation
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => {
                togglePanel("documentation");
                setActiveStudioTab("documentation");
              }}
            >
              Documentation
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => {
                togglePanel("costEstimator");
                setActiveStudioTab("costEstimator");
              }}
            >
              Cost Estimator
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => {
                togglePanel("plugin");
                setActiveStudioTab("plugin");
              }}
            >
              Plugin Editor
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => togglePanel("clashPanel")}
            >
              Clash Detection
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => togglePanel("quantityTakeoff")}
            >
              Quantity Takeoff
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => togglePanel("sheetManager")}
            >
              Sheet Manager
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => togglePanel("presentation")}
            >
              Presentation Mode
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => togglePanel("materialLibrary")}
            >
              Material Library
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => togglePanel("revisionManager")}
            >
              Revision Manager
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Left tool strip */}
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-lg overflow-hidden"
        style={{
          width: 60,
          background: "rgba(31,36,43,0.92)",
          border: "1px solid #3A424D",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto">
          <ToolPalette compact />
        </div>
      </div>

      {/* Right panel */}
      {hasRightPanel && (
        <div
          className="absolute right-3 top-16 bottom-12 z-10 rounded-lg overflow-hidden flex flex-col"
          style={{
            width: 280,
            background: "rgba(31,36,43,0.96)",
            border: "1px solid #3A424D",
            backdropFilter: "blur(8px)",
          }}
        >
          {openPanels.length > 1 && (
            <div className="flex border-b border-border/60 overflow-x-auto flex-shrink-0">
              {openPanels.map((panel) => (
                <div key={panel.id} className="flex items-center">
                  <button
                    type="button"
                    data-ocid={`studio_panel.${panel.id}.tab`}
                    onClick={() => setActiveStudioTab(panel.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium whitespace-nowrap transition-colors ${
                      resolvedActiveTab === panel.id
                        ? "text-white border-b-2 border-b-blue-400"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {panel.label}
                    {panel.id !== "properties" && (
                      <button
                        type="button"
                        data-ocid={`studio_panel.${panel.id}.close_button`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseStudioTab(panel.id);
                        }}
                        className="rounded-sm p-0.5 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        aria-label={`Close ${panel.label} panel`}
                      >
                        <X size={8} />
                      </button>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {resolvedActiveTab === "properties" && <PropertiesPanel />}
            {resolvedActiveTab === "simulation" && showSimulation && (
              <SimulationPanel
                onClose={() => handleCloseStudioTab("simulation")}
              />
            )}
            {resolvedActiveTab === "documentation" && showDocumentation && (
              <DocumentationPanel
                onClose={() => handleCloseStudioTab("documentation")}
              />
            )}
            {resolvedActiveTab === "costEstimator" && showCostEstimator && (
              <CostEstimator
                onClose={() => handleCloseStudioTab("costEstimator")}
              />
            )}
            {resolvedActiveTab === "plugin" && showPlugin && (
              <PluginPanel onClose={() => handleCloseStudioTab("plugin")} />
            )}
          </div>
        </div>
      )}

      {/* Bottom level bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <BottomLevelBar />
      </div>

      <CommandPalette />
      <OnboardingTour />
      <ClashDetectionPanel />
      <QuantityTakeoffPanel />
      <SchedulesPanel />
      <SheetManagerPanel />
      <PresentationMode />
      <MaterialLibraryPanel />
      <SymbolLibraryPanel />
      <RevisionManager />
      <Toaster />
    </div>
  );
}
