export interface ToolDef {
  id: string;
  name: string;
  icon: string;
  discipline: string;
  description: string;
  shortcut?: string;
}

export const toolDefinitions: ToolDef[] = [
  // Architecture
  {
    id: "Wall",
    name: "Wall",
    icon: "Square",
    discipline: "Architecture",
    description: "Draw straight walls by clicking start and end points",
    shortcut: "W",
  },
  {
    id: "ArcWall",
    name: "Arc Wall",
    icon: "CircleDot",
    discipline: "Architecture",
    description: "Draw curved walls defined by three points",
  },
  {
    id: "Floor",
    name: "Floor",
    icon: "LayoutGrid",
    discipline: "Architecture",
    description: "Define a floor plate by drawing a polygon",
  },
  {
    id: "Roof",
    name: "Roof",
    icon: "Home",
    discipline: "Architecture",
    description: "Draw a roof with configurable slope and overhang",
  },
  {
    id: "Door",
    name: "Door",
    icon: "DoorOpen",
    discipline: "Architecture",
    description: "Place a door in any wall with configurable size",
  },
  {
    id: "Window",
    name: "Window",
    icon: "AppWindow",
    discipline: "Architecture",
    description: "Place a window in any wall with sill height control",
  },
  {
    id: "Stair",
    name: "Stair",
    icon: "MoveUp",
    discipline: "Architecture",
    description: "Place a staircase between levels",
  },
  {
    id: "Ramp",
    name: "Ramp",
    icon: "TrendingUp",
    discipline: "Architecture",
    description: "Place a sloped ramp between levels",
  },
  {
    id: "Component",
    name: "Component",
    icon: "Package",
    discipline: "Architecture",
    description: "Open the component library and place a family",
  },
  {
    id: "Rooms",
    name: "Rooms",
    icon: "LayoutDashboard",
    discipline: "Architecture",
    description: "Detect enclosed spaces and calculate areas",
  },
  {
    id: "CurtainWall",
    name: "Curtain Wall",
    icon: "Columns",
    discipline: "Architecture",
    description: "Place a glass curtain wall system on a face",
  },
  // Structure
  {
    id: "Column",
    name: "Column",
    icon: "ArrowUpFromLine",
    discipline: "Structure",
    description: "Place a structural column extending between levels",
  },
  {
    id: "Beam",
    name: "Beam",
    icon: "Minus",
    discipline: "Structure",
    description: "Draw a structural beam between two points",
  },
  {
    id: "ArcBeam",
    name: "Arc Beam",
    icon: "GitBranch",
    discipline: "Structure",
    description: "Draw a curved structural beam",
  },
  {
    id: "Slab",
    name: "Slab",
    icon: "Square",
    discipline: "Structure",
    description: "Draw a structural slab polygon",
  },
  {
    id: "Brace",
    name: "Brace",
    icon: "Slash",
    discipline: "Structure",
    description: "Place a diagonal structural brace",
  },
  {
    id: "Footing",
    name: "Footing",
    icon: "Anchor",
    discipline: "Structure",
    description: "Place a foundation footing at a column base",
  },
  // MEP
  {
    id: "Duct",
    name: "Duct",
    icon: "Wind",
    discipline: "MEP",
    description: "Draw HVAC ductwork between two points",
  },
  {
    id: "Pipe",
    name: "Pipe",
    icon: "Pipette",
    discipline: "MEP",
    description: "Draw plumbing or fire suppression pipe",
  },
  {
    id: "CableTray",
    name: "Cable Tray",
    icon: "Cable",
    discipline: "MEP",
    description: "Draw electrical cable routing trays",
  },
  {
    id: "Equipment",
    name: "Equipment",
    icon: "Cpu",
    discipline: "MEP",
    description: "Place MEP equipment from the library",
  },
  {
    id: "Fitting",
    name: "Fitting",
    icon: "GitMerge",
    discipline: "MEP",
    description: "Place duct or pipe fittings",
  },
  // Parts
  {
    id: "Extrusion",
    name: "Extrusion",
    icon: "Box",
    discipline: "Parts",
    description: "Draw a 2D profile and extrude into a 3D solid",
  },
  {
    id: "Revolve",
    name: "Revolve",
    icon: "RefreshCw",
    discipline: "Parts",
    description: "Draw a 2D profile and revolve around an axis",
  },
  {
    id: "Sweep",
    name: "Sweep",
    icon: "Waves",
    discipline: "Parts",
    description: "Sweep a profile along a path",
  },
  {
    id: "BoxTool",
    name: "Box",
    icon: "Cuboid",
    discipline: "Parts",
    description: "Place a parametric box primitive",
  },
  {
    id: "Cylinder",
    name: "Cylinder",
    icon: "Cylinder",
    discipline: "Parts",
    description: "Place a parametric cylinder primitive",
  },
  {
    id: "Sphere",
    name: "Sphere",
    icon: "Circle",
    discipline: "Parts",
    description: "Place a parametric sphere primitive",
  },
  // Annotation
  {
    id: "Annotate",
    name: "Annotate",
    icon: "MessageSquare",
    discipline: "Annotation",
    description: "Place a pinned text annotation in the model",
  },
  {
    id: "Dimension",
    name: "Dimension",
    icon: "Ruler",
    discipline: "Annotation",
    description: "Place a linear dimension between two points",
    shortcut: "Di",
  },
  {
    id: "TextLabel",
    name: "Text Label",
    icon: "Type",
    discipline: "Annotation",
    description: "Place a text annotation at a point",
    shortcut: "T",
  },
  {
    id: "SectionCut",
    name: "Section Cut",
    icon: "Scissors",
    discipline: "Annotation",
    description: "Define a section cut line through the model",
  },
  {
    id: "SectionTool",
    name: "Section",
    icon: "Scissors",
    discipline: "Annotation",
    description: "Place a named section cut for documentation",
  },
  {
    id: "Measure",
    name: "Measure",
    icon: "Ruler",
    discipline: "Annotation",
    description: "Measure distance between two points",
    shortcut: "M",
  },
];

export const actionDefinitions = [
  {
    id: "undo",
    name: "Undo",
    description: "Undo last action",
    shortcut: "Cmd+Z",
  },
  {
    id: "redo",
    name: "Redo",
    description: "Redo last undone action",
    shortcut: "Cmd+Shift+Z",
  },
  {
    id: "selectAll",
    name: "Select All",
    description: "Select all elements",
    shortcut: "Cmd+A",
  },
  {
    id: "delete",
    name: "Delete",
    description: "Delete selected elements",
    shortcut: "Del",
  },
  {
    id: "panel_layers",
    name: "Layers Panel",
    description: "Open layers panel",
  },
  {
    id: "panel_browser",
    name: "Project Browser",
    description: "Open project browser",
  },
  {
    id: "panel_components",
    name: "Component Library",
    description: "Open component library",
  },
  {
    id: "panel_simulation",
    name: "Simulations",
    description: "Open simulation panel",
  },
  {
    id: "panel_documentation",
    name: "Documentation",
    description: "Open documentation panel",
  },
  {
    id: "panel_cost",
    name: "Cost Estimator",
    description: "Open cost estimator",
  },
  {
    id: "panel_plugin",
    name: "Plugin Editor",
    description: "Open plugin/scripting editor",
  },
  {
    id: "render_wireframe",
    name: "Wireframe Mode",
    description: "Switch to wireframe render mode",
  },
  {
    id: "render_shaded",
    name: "Shaded Mode",
    description: "Switch to shaded render mode",
  },
  {
    id: "render_rendered",
    name: "Rendered Mode",
    description: "Switch to full PBR render mode",
  },
];
