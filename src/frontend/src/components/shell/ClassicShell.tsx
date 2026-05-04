import { Toaster } from "@/components/ui/sonner";
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Layers,
  Package,
  X,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";
import { ClashDetectionPanel } from "../panels/ClashDetectionPanel";
import { ComponentLibrary } from "../panels/ComponentLibrary";
import { CostEstimator } from "../panels/CostEstimator";
import { DocumentationPanel } from "../panels/DocumentationPanel";
import { LayersPanel } from "../panels/LayersPanel";
import { MaterialLibraryPanel } from "../panels/MaterialLibraryPanel";
import { PluginPanel } from "../panels/PluginPanel";
import { ProjectBrowser } from "../panels/ProjectBrowser";
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
import { HintBar } from "./HintBar";
import { PresentationMode } from "./PresentationMode";
import { RevisionManager } from "./RevisionManager";
import { TopBar } from "./TopBar";

function LeftSidebarTabIcon({
  id,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  id: string;
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`sidebar.${id}.tab`}
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-0.5 py-2 w-full transition-colors ${
        active
          ? "text-blue-400 bg-secondary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      }`}
    >
      <Icon size={14} />
      <span className="text-[9px]">{label}</span>
    </button>
  );
}

type RightTabId =
  | "properties"
  | "simulation"
  | "documentation"
  | "costEstimator"
  | "plugin";

export function ClassicShell() {
  const togglePanel = useStore((s) => s.togglePanel);
  const showSimulation = useStore((s) => s.showSimulation);
  const showDocumentation = useStore((s) => s.showDocumentation);
  const showCostEstimator = useStore((s) => s.showCostEstimator);
  const showPlugin = useStore((s) => s.showPlugin);
  const highContrast = useStore((s) => s.highContrast);

  const [leftTab, setLeftTab] = useState<
    "tools" | "layers" | "browser" | "library"
  >("tools");
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeRightTab, setActiveRightTab] =
    useState<RightTabId>("properties");

  // Build tab list dynamically
  const rightTabs: Array<{ id: RightTabId; label: string }> = [
    { id: "properties", label: "Properties" },
    ...(showSimulation
      ? [{ id: "simulation" as RightTabId, label: "Simulate" }]
      : []),
    ...(showDocumentation
      ? [{ id: "documentation" as RightTabId, label: "Docs" }]
      : []),
    ...(showCostEstimator
      ? [{ id: "costEstimator" as RightTabId, label: "Cost" }]
      : []),
    ...(showPlugin ? [{ id: "plugin" as RightTabId, label: "Scripts" }] : []),
  ];

  // If active tab no longer exists, fall back to properties
  const resolvedActiveTab: RightTabId = rightTabs.some(
    (t) => t.id === activeRightTab,
  )
    ? activeRightTab
    : "properties";

  function handleCloseTab(id: RightTabId) {
    if (id !== "properties") {
      togglePanel(id);
      setActiveRightTab("properties");
    }
  }

  function handleOpenTab(id: RightTabId) {
    setActiveRightTab(id);
  }

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden ${
        highContrast ? "high-contrast" : ""
      }`}
    >
      <TopBar />
      <HintBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div
          className="flex flex-shrink-0 overflow-hidden"
          style={{
            width: leftWidth,
            borderRight: "1px solid oklch(var(--border))",
          }}
        >
          {/* Tab icon strip */}
          <div
            className="flex flex-col w-10 flex-shrink-0 border-r border-border"
            style={{ background: "oklch(var(--sidebar))" }}
          >
            <LeftSidebarTabIcon
              id="tools"
              icon={Package}
              label="Tools"
              active={leftTab === "tools"}
              onClick={() => setLeftTab("tools")}
            />
            <LeftSidebarTabIcon
              id="layers"
              icon={Layers}
              label="Layers"
              active={leftTab === "layers"}
              onClick={() => setLeftTab("layers")}
            />
            <LeftSidebarTabIcon
              id="browser"
              icon={FolderOpen}
              label="Browse"
              active={leftTab === "browser"}
              onClick={() => setLeftTab("browser")}
            />
            <LeftSidebarTabIcon
              id="library"
              icon={Package}
              label="Lib"
              active={leftTab === "library"}
              onClick={() => setLeftTab("library")}
            />
          </div>

          {/* Panel content */}
          <div
            className="flex-1 overflow-hidden"
            style={{ background: "oklch(var(--sidebar))" }}
          >
            {leftTab === "tools" && <ToolPalette />}
            {leftTab === "layers" && <LayersPanel />}
            {leftTab === "browser" && <ProjectBrowser />}
            {leftTab === "library" && <ComponentLibrary />}
          </div>
        </div>

        {/* Drag handle for left sidebar resize */}
        <div
          className="w-1 flex-shrink-0 cursor-col-resize hover:bg-primary/40 active:bg-primary/60 transition-colors select-none"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startW = leftWidth;
            const onMove = (ev: MouseEvent) => {
              setLeftWidth(
                Math.min(400, Math.max(220, startW + ev.clientX - startX)),
              );
            };
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        />

        {/* Viewport */}
        <div className="flex-1 overflow-hidden relative">
          <Viewport />
        </div>

        {/* Material Library — inline right panel */}
        <MaterialLibraryPanel />
        <SymbolLibraryPanel />

        {/* Right panel area — always 300px when visible */}
        <div
          className="flex flex-shrink-0 relative transition-all duration-150"
          style={{ width: rightCollapsed ? 12 : 300 }}
        >
          {/* Collapse/expand button */}
          <button
            type="button"
            data-ocid="sidebar.right_collapse.toggle"
            onClick={() => setRightCollapsed((v) => !v)}
            className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 z-10 w-5 h-10 rounded-l flex items-center justify-center border-l border-t border-b border-border transition-colors hover:bg-secondary"
            style={{ background: "oklch(var(--card))" }}
            title={rightCollapsed ? "Open right panel" : "Close right panel"}
          >
            {rightCollapsed ? (
              <ChevronLeft size={10} />
            ) : (
              <ChevronRight size={10} />
            )}
          </button>

          {!rightCollapsed && (
            <div
              className="flex flex-col w-full border-l border-border overflow-hidden"
              style={{ background: "oklch(var(--sidebar))" }}
            >
              {/* Tab header */}
              <div
                className="flex border-b border-border overflow-x-auto flex-shrink-0"
                style={{ background: "oklch(var(--card))" }}
              >
                {rightTabs.map((tab) => (
                  <div key={tab.id} className="flex items-center">
                    <button
                      type="button"
                      data-ocid={`right_panel.${tab.id}.tab`}
                      onClick={() => handleOpenTab(tab.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium whitespace-nowrap transition-colors border-r border-border ${
                        resolvedActiveTab === tab.id
                          ? "text-foreground bg-secondary border-b-2 border-b-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {tab.label}
                      {tab.id !== "properties" && (
                        <button
                          type="button"
                          data-ocid={`right_panel.${tab.id}.close_button`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseTab(tab.id);
                          }}
                          className="ml-0.5 rounded-sm p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                          aria-label={`Close ${tab.label} panel`}
                        >
                          <X size={8} />
                        </button>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto">
                {resolvedActiveTab === "properties" && <PropertiesPanel />}
                {resolvedActiveTab === "simulation" && showSimulation && (
                  <SimulationPanel
                    onClose={() => handleCloseTab("simulation")}
                  />
                )}
                {resolvedActiveTab === "documentation" && showDocumentation && (
                  <DocumentationPanel
                    onClose={() => handleCloseTab("documentation")}
                  />
                )}
                {resolvedActiveTab === "costEstimator" && showCostEstimator && (
                  <CostEstimator
                    onClose={() => handleCloseTab("costEstimator")}
                  />
                )}
                {resolvedActiveTab === "plugin" && showPlugin && (
                  <PluginPanel onClose={() => handleCloseTab("plugin")} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomLevelBar />
      <CommandPalette />
      <OnboardingTour />
      <ClashDetectionPanel />
      <QuantityTakeoffPanel />
      <SchedulesPanel />
      <SheetManagerPanel />
      <PresentationMode />
      <RevisionManager />
      <Toaster />
    </div>
  );
}
