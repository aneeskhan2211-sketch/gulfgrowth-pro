import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  BookOpen,
  Bookmark,
  Box,
  ChevronDown,
  Cloud,
  Command,
  Contrast,
  FolderOpen,
  GraduationCap,
  Grid2x2,
  HelpCircle,
  History,
  LayoutTemplate,
  Maximize2,
  MoreHorizontal,
  Palette,
  Save,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCrossTabSync } from "../../hooks/useCrossTabSync";
import type { SavedView, ViewMode } from "../../store/useStore";
import { useStore } from "../../store/useStore";
import { CloudSavePanel } from "../panels/CloudSavePanel";

export function TopBar() {
  const shellMode = useStore((s) => s.shellMode);
  const setShellMode = useStore((s) => s.setShellMode);
  const expertMode = useStore((s) => s.expertMode);
  const setExpertMode = useStore((s) => s.setExpertMode);
  const renderMode = useStore((s) => s.renderMode);
  const setRenderMode = useStore((s) => s.setRenderMode);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const highContrast = useStore((s) => s.highContrast);
  const setHighContrast = useStore((s) => s.setHighContrast);
  const togglePanel = useStore((s) => s.togglePanel);
  const clashResults = useStore((s) => s.clashResults);
  const savedViews = useStore((s) => s.savedViews);
  const addSavedView = useStore((s) => s.addSavedView);
  const deleteSavedView = useStore((s) => s.deleteSavedView);
  const revisions = useStore((s) => s.revisions);
  const gridSnap = useStore((s) => s.gridSnap);
  const gridSize = useStore((s) => s.gridSize);
  const setGridSnap = useStore((s) => s.setGridSnap);
  const setGridSize = useStore((s) => s.setGridSize);
  const [projectTitle, setProjectTitle] = useState("Meridian House");
  const [editingTitle, setEditingTitle] = useState(false);
  const [showViewsPopover, setShowViewsPopover] = useState(false);
  const [showCloudPanel, setShowCloudPanel] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const cloudBtnRef = useRef<HTMLDivElement>(null);
  const { isLive } = useCrossTabSync();
  const { isLoginSuccess } = useInternetIdentity();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        togglePanel("presentation");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePanel]);

  useEffect(() => {
    if (!showViewsPopover) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowViewsPopover(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showViewsPopover]);

  function handleSaveView() {
    const view: SavedView = {
      id: `view_${Date.now()}`,
      name: `View ${savedViews.length + 1}`,
      viewMode: viewMode as ViewMode,
      createdAt: Date.now(),
    };
    addSavedView(view);
    toast.success(`Saved "${view.name}" (${viewMode})`);
  }

  const gridSizes = [0.25, 0.5, 1.0, 2.0];

  // Cloud sync status dot color
  const cloudDotColor = !isLoginSuccess ? "#6B7280" : "#22C55E";

  return (
    <div
      className="flex flex-col border-b border-border flex-shrink-0"
      style={{ background: "oklch(var(--card))" }}
    >
      {/* Tier 1 */}
      <div className="flex items-center justify-between px-3 h-12">
        <div
          className="flex items-center gap-2 select-none"
          style={{ minWidth: 140 }}
        >
          <div
            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "#2F7DFF" }}
          >
            <Box size={14} color="#fff" />
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">
            Frame<span style={{ color: "#2F7DFF" }}>Works</span>
          </span>
        </div>

        <div className="flex-1 flex justify-center px-4">
          {editingTitle ? (
            <input
              data-ocid="topbar.project_title.input"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              className="text-sm font-medium text-foreground bg-transparent border-b border-primary outline-none text-center max-w-xs w-full"
              // biome-ignore lint/a11y/noAutofocus: title field needs focus on edit
              autoFocus
            />
          ) : (
            <button
              type="button"
              data-ocid="topbar.project_title.button"
              onClick={() => setEditingTitle(true)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate max-w-xs"
              title={projectTitle}
            >
              {projectTitle}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {isLive && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-green-400"
              style={{ background: "rgba(34,197,94,0.1)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{" "}
              Live
            </div>
          )}

          <div className="flex items-center rounded overflow-hidden border border-border">
            {(["wireframe", "shaded", "rendered"] as const).map((rm) => (
              <button
                type="button"
                key={rm}
                data-ocid={`topbar.render_${rm}.toggle`}
                onClick={() => setRenderMode(rm)}
                className={`px-2 py-1 text-[10px] transition-colors ${
                  renderMode === rm
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {rm.charAt(0).toUpperCase() + rm.slice(1)}
              </button>
            ))}
          </div>

          <button
            type="button"
            data-ocid="topbar.shell_toggle.toggle"
            onClick={() =>
              setShellMode(shellMode === "classic" ? "studio" : "classic")
            }
            title={`Switch to ${shellMode === "classic" ? "Studio" : "Classic"} shell`}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] border border-border transition-colors ${
              shellMode === "studio"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {shellMode === "classic" ? (
              <LayoutTemplate size={12} />
            ) : (
              <Grid2x2 size={12} />
            )}
            <span>{shellMode === "classic" ? "Studio" : "Classic"}</span>
          </button>

          <button
            type="button"
            data-ocid="topbar.expert_mode.toggle"
            onClick={() =>
              setExpertMode(expertMode === "beginner" ? "advanced" : "beginner")
            }
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] border border-border transition-colors ${
              expertMode === "advanced"
                ? "bg-amber-600/20 border-amber-600/40 text-amber-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {expertMode === "beginner" ? (
              <GraduationCap size={12} />
            ) : (
              <Zap size={12} />
            )}
            <span>{expertMode === "beginner" ? "Beginner" : "Advanced"}</span>
          </button>

          <button
            type="button"
            data-ocid="topbar.command_palette_open"
            onClick={() => togglePanel("commandPalette")}
            title="Command Palette (Cmd+K)"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors"
          >
            <Command size={13} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-ocid="topbar.overflow.button"
                title="More options"
                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <MoreHorizontal size={13} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem
                onClick={() => togglePanel("presentation")}
                className="text-xs"
              >
                <Maximize2 size={11} className="mr-2" /> Presentation Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setHighContrast(!highContrast)}
                className="text-xs"
              >
                <Contrast size={11} className="mr-2" /> High Contrast{" "}
                {highContrast ? "\u2713" : ""}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("fw_restart_tour"))
                }
                className="text-xs"
              >
                <HelpCircle size={11} className="mr-2" /> Restart Tour
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tier 2 */}
      <div className="flex items-center px-3 h-8 border-t border-border gap-1 text-[11px] flex-shrink-0">
        {["File", "Edit", "View", "Collaborate", "Settings"].map((menu) => (
          <DropdownMenu key={menu}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-0.5 px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {menu} <ChevronDown size={9} className="ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="text-xs">
              {menu === "File" && (
                <>
                  <DropdownMenuItem
                    onClick={() => toast.success("Project saved")}
                    className="text-xs"
                  >
                    <Save size={11} className="mr-2" /> Save Project
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs">
                    <FolderOpen size={11} className="mr-2" /> Open Project
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => togglePanel("documentation")}
                    className="text-xs"
                  >
                    Export
                  </DropdownMenuItem>
                </>
              )}
              {menu === "Edit" && (
                <>
                  <DropdownMenuItem className="text-xs">
                    Undo (Ctrl+Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs">
                    Redo (Ctrl+Y)
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs">
                    Select All
                  </DropdownMenuItem>
                </>
              )}
              {menu === "View" && (
                <>
                  <DropdownMenuItem
                    onClick={() => togglePanel("layers")}
                    className="text-xs"
                  >
                    Layers
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => togglePanel("projectBrowser")}
                    className="text-xs"
                  >
                    Project Browser
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => togglePanel("componentLibrary")}
                    className="text-xs"
                  >
                    Component Library
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setRenderMode("wireframe")}
                    className="text-xs"
                  >
                    Wireframe
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRenderMode("rendered")}
                    className="text-xs"
                  >
                    Rendered
                  </DropdownMenuItem>
                </>
              )}
              {menu === "Collaborate" && (
                <>
                  <DropdownMenuItem className="text-xs">
                    Share Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs">
                    Cross-tab Sync: {isLive ? "Active" : "Inactive"}
                  </DropdownMenuItem>
                </>
              )}
              {menu === "Settings" && (
                <>
                  <DropdownMenuItem
                    onClick={() => setHighContrast(!highContrast)}
                    className="text-xs"
                  >
                    High Contrast
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setExpertMode(
                        expertMode === "beginner" ? "advanced" : "beginner",
                      )
                    }
                    className="text-xs"
                  >
                    {expertMode === "beginner"
                      ? "Advanced Mode"
                      : "Beginner Mode"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        <div className="ml-auto flex items-center gap-1">
          {/* View mode switcher */}
          <div className="flex items-center rounded overflow-hidden border border-border">
            {(
              [
                { id: "3d", label: "3D" },
                { id: "plan", label: "Plan" },
                { id: "front", label: "Front" },
                { id: "right", label: "Right" },
                { id: "section", label: "Section" },
              ] as const
            ).map((v) => (
              <button
                type="button"
                key={v.id}
                data-ocid={`topbar.view_${v.id}.button`}
                onClick={() => setViewMode(v.id)}
                className={`px-2 py-0.5 text-[10px] transition-colors ${
                  viewMode === v.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Grid Snap */}
          <button
            type="button"
            data-ocid="topbar.grid_snap.toggle"
            onClick={() => setGridSnap(!gridSnap)}
            title={`Grid snap: ${gridSnap ? "on" : "off"}`}
            className={`p-1 rounded border border-border transition-colors ${
              gridSnap
                ? "text-blue-400 border-blue-500/40 bg-blue-500/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid2x2 size={12} />
          </button>

          {gridSnap && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="topbar.grid_size.select"
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {gridSize}m <ChevronDown size={8} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs min-w-[80px]">
                {gridSizes.map((gs) => (
                  <DropdownMenuItem
                    key={gs}
                    onClick={() => setGridSize(gs)}
                    className={`text-xs ${
                      gridSize === gs ? "text-blue-400 font-medium" : ""
                    }`}
                  >
                    {gs}m
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Saved Views */}
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              data-ocid="topbar.saved_views.button"
              onClick={() => setShowViewsPopover(!showViewsPopover)}
              title="Saved Views"
              className="relative p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors"
            >
              <Bookmark size={12} />
              {savedViews.length > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full text-[8px] text-white flex items-center justify-center"
                  style={{ background: "#2F7DFF" }}
                >
                  {savedViews.length}
                </span>
              )}
            </button>

            {showViewsPopover && (
              <div
                data-ocid="topbar.saved_views.popover"
                className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden shadow-xl"
                style={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  minWidth: 180,
                }}
              >
                <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Saved Views
                  </span>
                  <button
                    type="button"
                    data-ocid="topbar.saved_views.close_button"
                    onClick={() => setShowViewsPopover(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={10} />
                  </button>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  {savedViews.length === 0 && (
                    <p className="text-[10px] text-muted-foreground px-1 py-1">
                      No saved views yet.
                    </p>
                  )}
                  {savedViews.map((v) => (
                    <div key={v.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        data-ocid="topbar.saved_view.button"
                        onClick={() => {
                          setViewMode(v.viewMode);
                          setShowViewsPopover(false);
                        }}
                        className="flex-1 text-left px-2 py-1 rounded text-[10px] text-foreground hover:bg-secondary transition-colors"
                      >
                        <span className="font-medium">{v.name}</span>
                        <span className="ml-1.5 text-muted-foreground">
                          {v.viewMode}
                        </span>
                      </button>
                      <button
                        type="button"
                        data-ocid="topbar.saved_view.delete_button"
                        onClick={() => deleteSavedView(v.id)}
                        className="p-0.5 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete view"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="px-2 pb-2">
                  <button
                    type="button"
                    data-ocid="topbar.save_view.button"
                    onClick={() => {
                      handleSaveView();
                      setShowViewsPopover(false);
                    }}
                    className="w-full px-2 py-1.5 rounded text-[10px] font-medium text-white transition-colors"
                    style={{ background: "#2F7DFF" }}
                  >
                    + Save Current View
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Revision Manager button */}
          <button
            type="button"
            data-ocid="topbar.revision_manager.button"
            onClick={() => togglePanel("revisionManager")}
            title="Revision Manager"
            className="relative p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors"
          >
            <History size={12} />
            {revisions.length > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full text-[8px] text-white flex items-center justify-center"
                style={{ background: "#2F7DFF" }}
              >
                {revisions.length > 9 ? "9+" : revisions.length}
              </span>
            )}
          </button>

          {/* Material Library button */}
          <button
            type="button"
            data-ocid="topbar.material_library.button"
            onClick={() => togglePanel("materialLibrary")}
            title="Material Library"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors"
          >
            <Palette size={12} />
          </button>

          {/* Symbol Library button */}
          <button
            type="button"
            data-ocid="topbar.symbol_library.button"
            onClick={() => togglePanel("symbolLibrary")}
            title="Symbol Library"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors"
          >
            <BookOpen size={12} />
          </button>

          {/* Cloud Save button */}
          <div className="relative" ref={cloudBtnRef}>
            <button
              type="button"
              data-ocid="topbar.cloud_save.button"
              onClick={() => setShowCloudPanel((v) => !v)}
              title="Cloud Save"
              className="relative p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors"
            >
              <Cloud size={12} />
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: cloudDotColor }}
              />
            </button>
            {showCloudPanel && (
              <CloudSavePanel onClose={() => setShowCloudPanel(false)} />
            )}
          </div>

          {[
            { id: "simulation", label: "Simulate" },
            { id: "documentation", label: "Docs" },
            { id: "costEstimator", label: "Cost" },
            { id: "plugin", label: "Scripts" },
            { id: "quantityTakeoff", label: "QTO" },
            { id: "sheetManager", label: "Sheets" },
            { id: "schedules", label: "Sched" },
          ].map((p) => (
            <button
              type="button"
              key={p.id}
              data-ocid={`topbar.${p.id}.button`}
              onClick={() => togglePanel(p.id)}
              className="px-2 py-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {p.label}
            </button>
          ))}

          <button
            type="button"
            data-ocid="topbar.clash.button"
            onClick={() => togglePanel("clashPanel")}
            className="px-2 py-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative"
          >
            Clash
            {clashResults.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center">
                {clashResults.length > 9 ? "9+" : clashResults.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
