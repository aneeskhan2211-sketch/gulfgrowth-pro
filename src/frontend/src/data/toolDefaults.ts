import type { Discipline } from "../store/useStore";

export interface ToolPlacementDefaults {
  type: string;
  discipline: Discipline;
  layer: string;
  dimensions: { width: number; height: number; length: number; area?: number };
  material: {
    color: string;
    roughness: number;
    metalness: number;
    opacity: number;
  };
  ifcType?: string;
}

export const ANNOTATION_TOOLS = new Set([
  "Annotate",
  "SectionTool",
  "Dimension",
]);
export const NON_PLACEMENT_TOOLS = new Set([
  "Select",
  "Measure",
  "Annotate",
  "SectionTool",
  "Dimension",
]);

export const toolDefaults: Record<string, ToolPlacementDefaults> = {
  // Architecture
  Wall: {
    type: "Wall",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 5, height: 3, length: 0.3 },
    material: { color: "#C8C0B0", roughness: 0.8, metalness: 0, opacity: 1 },
    ifcType: "IfcWall",
  },
  ArcWall: {
    type: "ArcWall",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 5, height: 3, length: 0.3 },
    material: { color: "#C8C0B0", roughness: 0.8, metalness: 0, opacity: 1 },
    ifcType: "IfcWall",
  },
  Floor: {
    type: "Floor",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 6, height: 0.3, length: 6, area: 36 },
    material: { color: "#A8B4C0", roughness: 0.7, metalness: 0, opacity: 1 },
    ifcType: "IfcSlab",
  },
  Roof: {
    type: "Roof",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 8, height: 0.4, length: 8, area: 64 },
    material: { color: "#8B9BB0", roughness: 0.6, metalness: 0, opacity: 1 },
    ifcType: "IfcRoof",
  },
  Door: {
    type: "Door",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 1.0, height: 2.2, length: 0.15 },
    material: { color: "#8A9BB0", roughness: 0.5, metalness: 0.1, opacity: 1 },
    ifcType: "IfcDoor",
  },
  Window: {
    type: "Window",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 1.5, height: 1.2, length: 0.1, area: 1.8 },
    material: { color: "#C8E0FF", roughness: 0.1, metalness: 0, opacity: 0.5 },
    ifcType: "IfcWindow",
  },
  Stair: {
    type: "Stair",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 2, height: 4, length: 5 },
    material: { color: "#909AA8", roughness: 0.7, metalness: 0, opacity: 1 },
    ifcType: "IfcStair",
  },
  Ramp: {
    type: "Ramp",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 2, height: 0.2, length: 6 },
    material: { color: "#A0AA98", roughness: 0.7, metalness: 0, opacity: 1 },
    ifcType: "IfcRamp",
  },
  Component: {
    type: "Component",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 1, height: 1, length: 1 },
    material: { color: "#B0B8C0", roughness: 0.5, metalness: 0, opacity: 1 },
    ifcType: "IfcFurnishingElement",
  },
  Rooms: {
    type: "Rooms",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 4, height: 0.05, length: 4, area: 16 },
    material: { color: "#C8D8E8", roughness: 0.5, metalness: 0, opacity: 0.4 },
    ifcType: "IfcSpace",
  },
  CurtainWall: {
    type: "CurtainWall",
    discipline: "Architecture",
    layer: "Architecture",
    dimensions: { width: 5, height: 3, length: 0.1, area: 15 },
    material: {
      color: "#D0E8FF",
      roughness: 0.05,
      metalness: 0.1,
      opacity: 0.6,
    },
    ifcType: "IfcCurtainWall",
  },
  // Structure
  Column: {
    type: "Column",
    discipline: "Structure",
    layer: "Structure",
    dimensions: { width: 0.5, height: 4, length: 0.5 },
    material: { color: "#6B7A8D", roughness: 0.6, metalness: 0.1, opacity: 1 },
    ifcType: "IfcColumn",
  },
  Beam: {
    type: "Beam",
    discipline: "Structure",
    layer: "Structure",
    dimensions: { width: 5, height: 0.5, length: 0.4 },
    material: { color: "#5A6A7A", roughness: 0.6, metalness: 0.2, opacity: 1 },
    ifcType: "IfcBeam",
  },
  ArcBeam: {
    type: "ArcBeam",
    discipline: "Structure",
    layer: "Structure",
    dimensions: { width: 5, height: 0.5, length: 0.4 },
    material: { color: "#5A6A7A", roughness: 0.6, metalness: 0.2, opacity: 1 },
    ifcType: "IfcBeam",
  },
  Slab: {
    type: "Slab",
    discipline: "Structure",
    layer: "Structure",
    dimensions: { width: 6, height: 0.3, length: 6, area: 36 },
    material: { color: "#A8B4C0", roughness: 0.7, metalness: 0, opacity: 1 },
    ifcType: "IfcSlab",
  },
  Brace: {
    type: "Brace",
    discipline: "Structure",
    layer: "Structure",
    dimensions: { width: 4, height: 0.2, length: 0.2 },
    material: { color: "#607080", roughness: 0.5, metalness: 0.3, opacity: 1 },
    ifcType: "IfcMember",
  },
  Footing: {
    type: "Footing",
    discipline: "Structure",
    layer: "Structure",
    dimensions: { width: 1.2, height: 0.4, length: 1.2 },
    material: { color: "#808A90", roughness: 0.8, metalness: 0, opacity: 1 },
    ifcType: "IfcFooting",
  },
  // MEP
  Duct: {
    type: "Duct",
    discipline: "MEP",
    layer: "MEP",
    dimensions: { width: 4, height: 0.4, length: 0.6 },
    material: { color: "#7CB9A8", roughness: 0.4, metalness: 0.3, opacity: 1 },
    ifcType: "IfcDuctSegment",
  },
  Pipe: {
    type: "Pipe",
    discipline: "MEP",
    layer: "MEP",
    dimensions: { width: 4, height: 0.2, length: 0.2 },
    material: { color: "#A0C8A0", roughness: 0.4, metalness: 0.2, opacity: 1 },
    ifcType: "IfcPipeSegment",
  },
  CableTray: {
    type: "CableTray",
    discipline: "MEP",
    layer: "MEP",
    dimensions: { width: 3, height: 0.15, length: 0.4 },
    material: { color: "#C8B060", roughness: 0.5, metalness: 0.4, opacity: 1 },
    ifcType: "IfcCableCarrierSegment",
  },
  Equipment: {
    type: "Equipment",
    discipline: "MEP",
    layer: "MEP",
    dimensions: { width: 1.2, height: 1.0, length: 0.8 },
    material: { color: "#90A8B8", roughness: 0.5, metalness: 0.2, opacity: 1 },
    ifcType: "IfcFlowTerminal",
  },
  Fitting: {
    type: "Fitting",
    discipline: "MEP",
    layer: "MEP",
    dimensions: { width: 0.4, height: 0.4, length: 0.4 },
    material: { color: "#A8B870", roughness: 0.5, metalness: 0.2, opacity: 1 },
    ifcType: "IfcPipeSegment",
  },
  // Parts
  Extrusion: {
    type: "Extrusion",
    discipline: "Parts",
    layer: "Parts",
    dimensions: { width: 2, height: 2, length: 2 },
    material: { color: "#808090", roughness: 0.5, metalness: 0, opacity: 1 },
    ifcType: "IfcBuildingElementProxy",
  },
  Revolve: {
    type: "Revolve",
    discipline: "Parts",
    layer: "Parts",
    dimensions: { width: 2, height: 2, length: 2 },
    material: { color: "#808090", roughness: 0.5, metalness: 0, opacity: 1 },
    ifcType: "IfcBuildingElementProxy",
  },
  Sweep: {
    type: "Sweep",
    discipline: "Parts",
    layer: "Parts",
    dimensions: { width: 2, height: 2, length: 2 },
    material: { color: "#808090", roughness: 0.5, metalness: 0, opacity: 1 },
    ifcType: "IfcBuildingElementProxy",
  },
  BoxTool: {
    type: "BoxTool",
    discipline: "Parts",
    layer: "Parts",
    dimensions: { width: 2, height: 2, length: 2 },
    material: { color: "#808090", roughness: 0.5, metalness: 0, opacity: 1 },
    ifcType: "IfcBuildingElementProxy",
  },
  Cylinder: {
    type: "Cylinder",
    discipline: "Parts",
    layer: "Parts",
    dimensions: { width: 1, height: 2, length: 1 },
    material: { color: "#808090", roughness: 0.5, metalness: 0, opacity: 1 },
    ifcType: "IfcBuildingElementProxy",
  },
  Sphere: {
    type: "Sphere",
    discipline: "Parts",
    layer: "Parts",
    dimensions: { width: 1, height: 1, length: 1 },
    material: { color: "#808090", roughness: 0.5, metalness: 0, opacity: 1 },
    ifcType: "IfcBuildingElementProxy",
  },
};
