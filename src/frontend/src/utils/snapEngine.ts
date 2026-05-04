import type { BuildingElement } from "../store/useStore";

export type SnapType = "Endpoint" | "Midpoint" | "Center" | "Grid";

export interface SnapResult {
  point: [number, number];
  type: SnapType;
}

function snapToGrid(val: number, grid: number): number {
  return Math.round(val / grid) * grid;
}

export function findSnapPoint(
  rawX: number,
  rawZ: number,
  elements: BuildingElement[],
  gridSize: number,
  gridSnap: boolean,
): SnapResult {
  const SNAP_RADIUS = 0.8;

  let nearestPoint: [number, number] | null = null;
  let nearestDist = SNAP_RADIUS;
  let nearestType: SnapType = "Grid";

  for (const el of elements) {
    const cx = el.position[0];
    const cz = el.position[2];
    const hw = el.dimensions.width / 2;
    const hl = el.dimensions.length / 2;

    // Endpoints (corners)
    const endpoints: Array<[number, number]> = [
      [cx - hw, cz - hl],
      [cx + hw, cz - hl],
      [cx + hw, cz + hl],
      [cx - hw, cz + hl],
    ];

    // Midpoints (edge midpoints)
    const midpoints: Array<[number, number]> = [
      [cx, cz - hl],
      [cx, cz + hl],
      [cx - hw, cz],
      [cx + hw, cz],
    ];

    // Center
    const center: [number, number] = [cx, cz];

    for (const [ex, ez] of endpoints) {
      const dist = Math.sqrt((rawX - ex) ** 2 + (rawZ - ez) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestPoint = [ex, ez];
        nearestType = "Endpoint";
      }
    }

    for (const [mx, mz] of midpoints) {
      const dist = Math.sqrt((rawX - mx) ** 2 + (rawZ - mz) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestPoint = [mx, mz];
        nearestType = "Midpoint";
      }
    }

    const distCenter = Math.sqrt(
      (rawX - center[0]) ** 2 + (rawZ - center[1]) ** 2,
    );
    if (distCenter < nearestDist) {
      nearestDist = distCenter;
      nearestPoint = center;
      nearestType = "Center";
    }
  }

  if (nearestPoint) {
    return { point: nearestPoint, type: nearestType };
  }

  const activeGrid = gridSnap ? gridSize : 0.001;
  return {
    point: [snapToGrid(rawX, activeGrid), snapToGrid(rawZ, activeGrid)],
    type: "Grid",
  };
}
