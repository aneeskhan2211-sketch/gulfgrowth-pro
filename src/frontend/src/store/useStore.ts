import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Discipline =
  | "Architecture"
  | "Structure"
  | "MEP"
  | "Parts"
  | "Annotation";
export type RenderMode = "wireframe" | "shaded" | "rendered";
export type ShellMode = "classic" | "studio";
export type ExpertMode = "beginner" | "advanced";
export type ViewMode = "3d" | "plan" | "front" | "right" | "section";

export interface BuildingElement {
  id: string;
  type: string;
  discipline: Discipline;
  level: string;
  layer: string;
  position: [number, number, number];
  dimensions: {
    width: number;
    height: number;
    length: number;
    area?: number;
    volume?: number;
  };
  material: {
    color: string;
    roughness: number;
    metalness: number;
    opacity: number;
  };
  name: string;
  selected: boolean;
  meshRef?: string;
  // BIM data model fields
  ifcType?: string;
  classification?: string;
  properties?: Record<string, string>;
  hostedWallId?: string;
}

export interface Layer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
  discipline: Discipline;
}

export interface Level {
  id: string;
  name: string;
  elevation: number;
  elementCount: number;
}

export interface CameraPreset {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface HistoryEntry {
  elements: BuildingElement[];
  description: string;
}

export interface ClashResult {
  id: string;
  elementAId: string;
  elementBId: string;
  elementAName: string;
  elementBName: string;
  typeA: string;
  typeB: string;
  level: string;
  severity: "hard" | "soft";
}

export interface PlanAnnotation {
  id: string;
  type: "dimension" | "textnote";
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  label?: string;
  x?: number;
  y?: number;
  text?: string;
  // Associative dimension fields
  elementAId?: string;
  elementBId?: string;
}

export interface SavedView {
  id: string;
  name: string;
  viewMode: ViewMode;
  createdAt: number;
}

export interface Revision {
  id: string;
  name: string;
  timestamp: number;
  elementCount: number;
  snapshot: BuildingElement[];
}

interface FrameworksState {
  elements: BuildingElement[];
  selectedElementIds: Set<string>;
  activeTool: string;
  activeLevel: string;
  shellMode: ShellMode;
  expertMode: ExpertMode;
  renderMode: RenderMode;
  viewMode: ViewMode;
  highContrast: boolean;
  layers: Layer[];
  levels: Level[];
  cameraPresets: CameraPreset[];
  showProperties: boolean;
  showLayers: boolean;
  showProjectBrowser: boolean;
  showComponentLibrary: boolean;
  showSimulation: boolean;
  showDocumentation: boolean;
  showCostEstimator: boolean;
  showPlugin: boolean;
  showCommandPalette: boolean;
  showPresentationMode: boolean;
  showClashPanel: boolean;
  showQuantityTakeoff: boolean;
  showSheetManager: boolean;
  showMaterialLibrary: boolean;
  showRevisionManager: boolean;
  showSymbolLibrary: boolean;
  showCloudSave: boolean;
  showSchedules: boolean;
  showBimFilter: boolean;
  activeSimulation: string;
  activePanel: string;
  clashResults: ClashResult[];
  annotations: PlanAnnotation[];
  savedViews: SavedView[];
  revisions: Revision[];
  gridSnap: boolean;
  gridSize: number;
  history: HistoryEntry[];
  historyIndex: number;

  setElements: (elements: BuildingElement[]) => void;
  addElement: (element: BuildingElement) => void;
  updateElement: (id: string, updates: Partial<BuildingElement>) => void;
  deleteElements: (ids: string[]) => void;
  selectElements: (ids: string[], addToSelection?: boolean) => void;
  clearSelection: () => void;
  setActiveTool: (tool: string) => void;
  setActiveLevel: (level: string) => void;
  setShellMode: (mode: ShellMode) => void;
  setExpertMode: (mode: ExpertMode) => void;
  setRenderMode: (mode: RenderMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setHighContrast: (val: boolean) => void;
  setLayers: (layers: Layer[]) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  setLevels: (levels: Level[]) => void;
  addLevel: (level: Level) => void;
  updateLevel: (id: string, updates: Partial<Level>) => void;
  deleteLevel: (id: string) => void;
  togglePanel: (panel: string) => void;
  setActiveSimulation: (sim: string) => void;
  setActivePanel: (panel: string) => void;
  setClashResults: (results: ClashResult[]) => void;
  addAnnotation: (annotation: PlanAnnotation) => void;
  deleteAnnotation: (id: string) => void;
  clearAnnotations: () => void;
  addSavedView: (view: SavedView) => void;
  deleteSavedView: (id: string) => void;
  saveRevision: (name: string) => void;
  restoreRevision: (id: string) => void;
  deleteRevision: (id: string) => void;
  setGridSnap: (val: boolean) => void;
  setGridSize: (size: number) => void;
  pushHistory: (description: string) => void;
  undo: () => void;
  redo: () => void;
}

const defaultLayers: Layer[] = [
  {
    id: "l1",
    name: "Architecture",
    color: "#4A9EFF",
    visible: true,
    locked: false,
    discipline: "Architecture",
  },
  {
    id: "l2",
    name: "Structure",
    color: "#FF6B35",
    visible: true,
    locked: false,
    discipline: "Structure",
  },
  {
    id: "l3",
    name: "MEP",
    color: "#4CAF50",
    visible: true,
    locked: false,
    discipline: "MEP",
  },
  {
    id: "l4",
    name: "Parts",
    color: "#9C27B0",
    visible: true,
    locked: false,
    discipline: "Parts",
  },
];

const defaultLevels: Level[] = [
  { id: "b1", name: "B1", elevation: -4, elementCount: 0 },
  { id: "l1", name: "L1", elevation: 0, elementCount: 0 },
  { id: "l2", name: "L2", elevation: 4, elementCount: 0 },
  { id: "l3", name: "L3", elevation: 8, elementCount: 0 },
  { id: "roof", name: "Roof", elevation: 12, elementCount: 0 },
];

const defaultCameraPresets: CameraPreset[] = [
  { id: "top", name: "Top", position: [0, 40, 0], target: [0, 0, 0] },
  { id: "front", name: "Front", position: [0, 10, 40], target: [0, 6, 0] },
  { id: "right", name: "Right", position: [40, 10, 0], target: [0, 6, 0] },
  { id: "perspective", name: "3D", position: [30, 20, 30], target: [0, 6, 0] },
];

function loadRevisions(): Revision[] {
  try {
    const stored = localStorage.getItem("fw_revisions");
    if (stored) return JSON.parse(stored) as Revision[];
  } catch {
    // ignore
  }
  return [];
}

export const useStore = create<FrameworksState>()(
  subscribeWithSelector((set, get) => ({
    elements: [],
    selectedElementIds: new Set(),
    activeTool: "Select",
    activeLevel: "L1",
    shellMode: "classic",
    expertMode: "beginner",
    renderMode: "rendered",
    viewMode: "3d",
    highContrast: false,
    layers: defaultLayers,
    levels: defaultLevels,
    cameraPresets: defaultCameraPresets,
    showProperties: true,
    showLayers: false,
    showProjectBrowser: false,
    showComponentLibrary: false,
    showSimulation: false,
    showDocumentation: false,
    showCostEstimator: false,
    showPlugin: false,
    showCommandPalette: false,
    showPresentationMode: false,
    showClashPanel: false,
    showQuantityTakeoff: false,
    showSheetManager: false,
    showMaterialLibrary: false,
    showRevisionManager: false,
    showSymbolLibrary: false,
    showCloudSave: false,
    showSchedules: false,
    showBimFilter: false,
    activeSimulation: "structural",
    activePanel: "",
    clashResults: [],
    annotations: [],
    savedViews: [],
    revisions: loadRevisions(),
    gridSnap: true,
    gridSize: 0.5,
    history: [],
    historyIndex: -1,

    setElements: (elements) => set({ elements }),
    addElement: (element) =>
      set((s) => ({ elements: [...s.elements, element] })),
    updateElement: (id, updates) =>
      set((s) => ({
        elements: s.elements.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      })),
    deleteElements: (ids) =>
      set((s) => ({ elements: s.elements.filter((e) => !ids.includes(e.id)) })),
    selectElements: (ids, addToSelection = false) =>
      set((s) => ({
        selectedElementIds: addToSelection
          ? new Set([...s.selectedElementIds, ...ids])
          : new Set(ids),
        elements: s.elements.map((e) => ({
          ...e,
          selected: addToSelection
            ? s.selectedElementIds.has(e.id) || ids.includes(e.id)
            : ids.includes(e.id),
        })),
      })),
    clearSelection: () =>
      set((s) => ({
        selectedElementIds: new Set(),
        elements: s.elements.map((e) => ({ ...e, selected: false })),
      })),

    setActiveTool: (tool) => set({ activeTool: tool }),
    setActiveLevel: (level) => set({ activeLevel: level }),
    setShellMode: (mode) => set({ shellMode: mode }),
    setExpertMode: (mode) => set({ expertMode: mode }),
    setRenderMode: (mode) => set({ renderMode: mode }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setHighContrast: (val) => set({ highContrast: val }),

    setLayers: (layers) => set({ layers }),
    updateLayer: (id, updates) =>
      set((s) => ({
        layers: s.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      })),
    setLevels: (levels) => set({ levels }),
    addLevel: (level) => set((s) => ({ levels: [...s.levels, level] })),
    updateLevel: (id, updates) =>
      set((s) => ({
        levels: s.levels.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      })),
    deleteLevel: (id) =>
      set((s) => ({ levels: s.levels.filter((l) => l.id !== id) })),

    togglePanel: (panel) =>
      set((s) => ({
        showProperties:
          panel === "properties" ? !s.showProperties : s.showProperties,
        showLayers: panel === "layers" ? !s.showLayers : s.showLayers,
        showProjectBrowser:
          panel === "projectBrowser"
            ? !s.showProjectBrowser
            : s.showProjectBrowser,
        showComponentLibrary:
          panel === "componentLibrary"
            ? !s.showComponentLibrary
            : s.showComponentLibrary,
        showSimulation:
          panel === "simulation" ? !s.showSimulation : s.showSimulation,
        showDocumentation:
          panel === "documentation"
            ? !s.showDocumentation
            : s.showDocumentation,
        showCostEstimator:
          panel === "costEstimator"
            ? !s.showCostEstimator
            : s.showCostEstimator,
        showPlugin: panel === "plugin" ? !s.showPlugin : s.showPlugin,
        showCommandPalette:
          panel === "commandPalette"
            ? !s.showCommandPalette
            : s.showCommandPalette,
        showPresentationMode:
          panel === "presentation"
            ? !s.showPresentationMode
            : s.showPresentationMode,
        showClashPanel:
          panel === "clashPanel" ? !s.showClashPanel : s.showClashPanel,
        showQuantityTakeoff:
          panel === "quantityTakeoff"
            ? !s.showQuantityTakeoff
            : s.showQuantityTakeoff,
        showSheetManager:
          panel === "sheetManager" ? !s.showSheetManager : s.showSheetManager,
        showMaterialLibrary:
          panel === "materialLibrary"
            ? !s.showMaterialLibrary
            : s.showMaterialLibrary,
        showRevisionManager:
          panel === "revisionManager"
            ? !s.showRevisionManager
            : s.showRevisionManager,
        showSymbolLibrary:
          panel === "symbolLibrary"
            ? !s.showSymbolLibrary
            : s.showSymbolLibrary,
        showCloudSave:
          panel === "cloudSave" ? !s.showCloudSave : s.showCloudSave,
        showBimFilter:
          panel === "bimFilter" ? !s.showBimFilter : s.showBimFilter,
      })),
    setActiveSimulation: (sim) => set({ activeSimulation: sim }),
    setActivePanel: (panel) => set({ activePanel: panel }),
    setClashResults: (results) => set({ clashResults: results }),

    addAnnotation: (annotation) =>
      set((s) => ({ annotations: [...s.annotations, annotation] })),
    deleteAnnotation: (id) =>
      set((s) => ({ annotations: s.annotations.filter((a) => a.id !== id) })),
    clearAnnotations: () => set({ annotations: [] }),

    addSavedView: (view) =>
      set((s) => ({ savedViews: [...s.savedViews, view] })),
    deleteSavedView: (id) =>
      set((s) => ({ savedViews: s.savedViews.filter((v) => v.id !== id) })),

    saveRevision: (name) => {
      const { elements, revisions } = get();
      const rev: Revision = {
        id: `rev_${Date.now()}`,
        name,
        timestamp: Date.now(),
        elementCount: elements.length,
        snapshot: JSON.parse(JSON.stringify(elements)),
      };
      const next = [...revisions, rev];
      localStorage.setItem("fw_revisions", JSON.stringify(next));
      set({ revisions: next });
    },
    restoreRevision: (id) => {
      const { revisions } = get();
      const rev = revisions.find((r) => r.id === id);
      if (rev) set({ elements: JSON.parse(JSON.stringify(rev.snapshot)) });
    },
    deleteRevision: (id) => {
      const next = get().revisions.filter((r) => r.id !== id);
      localStorage.setItem("fw_revisions", JSON.stringify(next));
      set({ revisions: next });
    },

    setGridSnap: (val) => set({ gridSnap: val }),
    setGridSize: (size) => set({ gridSize: size }),

    pushHistory: (description) => {
      const { elements, history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({
        elements: JSON.parse(JSON.stringify(elements)),
        description,
      });
      set({
        history: newHistory.slice(-50),
        historyIndex: newHistory.length - 1,
      });
    },
    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        set({
          elements: history[historyIndex - 1].elements,
          historyIndex: historyIndex - 1,
        });
      }
    },
    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        set({
          elements: history[historyIndex + 1].elements,
          historyIndex: historyIndex + 1,
        });
      }
    },
  })),
);
