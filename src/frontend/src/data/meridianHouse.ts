import type { BuildingElement, Discipline } from "../store/useStore";

function makeId(prefix: string, floor: number, idx: number): string {
  return `${prefix}_${floor}_${idx}`;
}

function getIfcType(type: string): string {
  switch (type) {
    case "Floor":
    case "Slab":
      return "IfcSlab";
    case "Roof":
      return "IfcRoof";
    case "Wall":
      return "IfcWall";
    case "Column":
      return "IfcColumn";
    case "Beam":
      return "IfcBeam";
    case "Window":
      return "IfcWindow";
    case "Door":
      return "IfcDoor";
    case "Stair":
      return "IfcStair";
    case "Curtain Wall":
    case "CurtainWall":
      return "IfcCurtainWall";
    case "Duct":
      return "IfcDuctSegment";
    default:
      return "IfcBuildingElementProxy";
  }
}

function getClassification(type: string): string {
  switch (type) {
    case "Wall":
    case "Curtain Wall":
    case "CurtainWall":
      return "A-2010 Walls";
    case "Floor":
    case "Slab":
      return "A-3120 Floor Construction";
    case "Column":
      return "A-2320 Columns";
    case "Beam":
      return "A-2330 Beams";
    case "Window":
      return "B-2010 Exterior Windows";
    case "Door":
      return "B-2020 Exterior Doors";
    case "Stair":
      return "C-1010 Stairs";
    case "Roof":
      return "A-3110 Roof Construction";
    default:
      return "";
  }
}

export function generateMeridianHouse(): BuildingElement[] {
  const elements: BuildingElement[] = [];
  const floors = [
    { name: "B1", elev: -4 },
    { name: "L1", elev: 0 },
    { name: "L2", elev: 4 },
    { name: "L3", elev: 8 },
    { name: "Roof", elev: 12 },
  ];

  const floorW = 25;
  const floorD = 15;

  // Column grid positions (9 positions: 3x3)
  const colPositions: [number, number][] = [
    [-10, -5],
    [0, -5],
    [10, -5],
    [-10, 0],
    [0, 0],
    [10, 0],
    [-10, 5],
    [0, 5],
    [10, 5],
  ];

  floors.forEach((floor, fi) => {
    const y = floor.elev;
    const slabType = fi === 4 ? "Roof" : "Floor";

    // Floor slab
    elements.push({
      id: makeId("slab", fi, 0),
      type: slabType,
      discipline: "Architecture" as Discipline,
      level: floor.name,
      layer: "Architecture",
      position: [0, y, 0],
      dimensions: {
        width: floorW,
        height: 0.3,
        length: floorD,
        area: floorW * floorD,
        volume: floorW * floorD * 0.3,
      },
      material: {
        color: fi === 4 ? "#8B9BB0" : "#A8B4C0",
        roughness: 0.8,
        metalness: 0.0,
        opacity: 1,
      },
      name: `${floor.name} ${fi === 4 ? "Roof" : "Floor"} Slab`,
      selected: false,
      ifcType: getIfcType(slabType),
      classification: getClassification(slabType),
      properties: {},
    });

    if (fi < 4) {
      // Columns
      colPositions.forEach((cp, ci) => {
        elements.push({
          id: makeId("col", fi, ci),
          type: "Column",
          discipline: "Structure" as Discipline,
          level: floor.name,
          layer: "Structure",
          position: [cp[0], y + 2, cp[1]],
          dimensions: {
            width: 0.5,
            height: 4,
            length: 0.5,
            area: 0.25,
            volume: 1,
          },
          material: {
            color: "#6B7A8D",
            roughness: 0.6,
            metalness: 0.3,
            opacity: 1,
          },
          name: `Column ${floor.name}-${ci + 1}`,
          selected: false,
          ifcType: "IfcColumn",
          classification: "A-2320 Columns",
          properties: {},
        });
      });

      // Beams (horizontal spanning)
      const beamSpans: Array<[[number, number], [number, number]]> = [
        [
          [-10, -5],
          [0, -5],
        ],
        [
          [0, -5],
          [10, -5],
        ],
        [
          [-10, 0],
          [0, 0],
        ],
        [
          [0, 0],
          [10, 0],
        ],
        [
          [-10, 5],
          [0, 5],
        ],
        [
          [0, 5],
          [10, 5],
        ],
        [
          [-10, -5],
          [-10, 5],
        ],
        [
          [0, -5],
          [0, 5],
        ],
        [
          [10, -5],
          [10, 5],
        ],
      ];
      beamSpans.forEach((span, bi) => {
        const [a, b] = span;
        const cx = (a[0] + b[0]) / 2;
        const cz = (a[1] + b[1]) / 2;
        const dx = Math.abs(b[0] - a[0]);
        const dz = Math.abs(b[1] - a[1]);
        const len = Math.sqrt(dx * dx + dz * dz);
        elements.push({
          id: makeId("beam", fi, bi),
          type: "Beam",
          discipline: "Structure" as Discipline,
          level: floor.name,
          layer: "Structure",
          position: [cx, y + 3.75, cz],
          dimensions: {
            width: dx || 0.3,
            height: 0.5,
            length: dz || len,
            area: 0.15 * len,
            volume: 0.15 * len,
          },
          material: {
            color: "#5A6A7A",
            roughness: 0.4,
            metalness: 0.7,
            opacity: 1,
          },
          name: `Beam ${floor.name}-${bi + 1}`,
          selected: false,
          ifcType: "IfcBeam",
          classification: "A-2330 Beams",
          properties: {},
        });
      });

      // Exterior walls (4 sides)
      const wallDefs = [
        {
          pos: [0, y + 2, -floorD / 2] as [number, number, number],
          w: floorW,
          rot: 0,
          name: "South Wall",
        },
        {
          pos: [0, y + 2, floorD / 2] as [number, number, number],
          w: floorW,
          rot: 0,
          name: "North Wall",
        },
        {
          pos: [-floorW / 2, y + 2, 0] as [number, number, number],
          w: floorD,
          rot: 1,
          name: "West Wall",
        },
        {
          pos: [floorW / 2, y + 2, 0] as [number, number, number],
          w: floorD,
          rot: 1,
          name: "East Wall",
        },
      ];
      wallDefs.forEach((w, wi) => {
        elements.push({
          id: makeId("wall", fi, wi),
          type: "Curtain Wall",
          discipline: "Architecture" as Discipline,
          level: floor.name,
          layer: "Architecture",
          position: w.pos,
          dimensions: {
            width: w.w,
            height: 4,
            length: 0.1,
            area: w.w * 4,
            volume: w.w * 4 * 0.1,
          },
          material: {
            color: "#B8D4F0",
            roughness: 0.0,
            metalness: 0.1,
            opacity: 0.35,
          },
          name: `${floor.name} ${w.name}`,
          selected: false,
          ifcType: "IfcCurtainWall",
          classification: "A-2010 Walls",
          properties: {},
        });
      });

      // Doors on L1
      if (floor.name === "L1") {
        elements.push({
          id: "door_main",
          type: "Door",
          discipline: "Architecture" as Discipline,
          level: "L1",
          layer: "Architecture",
          position: [0, 1.1, -7.55],
          dimensions: {
            width: 2,
            height: 2.2,
            length: 0.15,
            area: 4.4,
            volume: 0.66,
          },
          material: {
            color: "#8A9BB0",
            roughness: 0.3,
            metalness: 0.5,
            opacity: 1,
          },
          name: "Main Entrance Door",
          selected: false,
          ifcType: "IfcDoor",
          classification: "B-2020 Exterior Doors",
          properties: {},
          hostedWallId: makeId("wall", 1, 0), // L1 South Wall
        });
      }

      // Windows on each floor
      [-8, -4, 0, 4, 8].forEach((wx, wxi) => {
        elements.push({
          id: makeId("win", fi, wxi),
          type: "Window",
          discipline: "Architecture" as Discipline,
          level: floor.name,
          layer: "Architecture",
          position: [wx, y + 1.8, -7.55],
          dimensions: {
            width: 2,
            height: 1.5,
            length: 0.1,
            area: 3,
            volume: 0.3,
          },
          material: {
            color: "#C8E0FF",
            roughness: 0.0,
            metalness: 0.1,
            opacity: 0.4,
          },
          name: `Window ${floor.name}-${wxi + 1}`,
          selected: false,
          ifcType: "IfcWindow",
          classification: "B-2010 Exterior Windows",
          properties: {},
          hostedWallId: makeId("wall", fi, 0), // South Wall of this floor
        });
      });

      // MEP Ducts on L2+
      if (fi >= 2) {
        [-5, 5].forEach((dz, di) => {
          elements.push({
            id: makeId("duct", fi, di),
            type: "Duct",
            discipline: "MEP" as Discipline,
            level: floor.name,
            layer: "MEP",
            position: [0, y + 3.2, dz],
            dimensions: {
              width: 20,
              height: 0.4,
              length: 0.6,
              area: 12,
              volume: 4.8,
            },
            material: {
              color: "#7CB9A8",
              roughness: 0.5,
              metalness: 0.4,
              opacity: 1,
            },
            name: `HVAC Duct ${floor.name}-${di + 1}`,
            selected: false,
            ifcType: "IfcDuctSegment",
            classification: "",
            properties: {},
          });
        });
      }
    }
  });

  // Stairs
  for (let fi = 0; fi < 4; fi++) {
    elements.push({
      id: `stair_${fi}`,
      type: "Stair",
      discipline: "Architecture" as Discipline,
      level: floors[fi].name,
      layer: "Architecture",
      position: [11, floors[fi].elev + 2, -3],
      dimensions: { width: 2, height: 4, length: 5, area: 10, volume: 40 },
      material: {
        color: "#909AA8",
        roughness: 0.7,
        metalness: 0.0,
        opacity: 1,
      },
      name: `Stair ${floors[fi].name} to ${floors[fi + 1].name}`,
      selected: false,
      ifcType: "IfcStair",
      classification: "C-1010 Stairs",
      properties: {},
    });
  }

  return elements;
}
