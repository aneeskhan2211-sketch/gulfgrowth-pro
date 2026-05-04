import type { BuildingElement } from "../store/useStore";

const WALL_TYPES = new Set(["Wall", "ArcWall", "Curtain Wall"]);
const JOIN_RADIUS = 0.4;

function getEndpoints(el: BuildingElement): Array<[number, number]> {
  const cx = el.position[0];
  const cz = el.position[2];
  const hw = el.dimensions.width / 2;
  const hl = el.dimensions.length / 2;
  return [
    [cx - hw, cz - hl],
    [cx + hw, cz - hl],
    [cx + hw, cz + hl],
    [cx - hw, cz + hl],
  ];
}

export function applyWallJoins(
  newEl: BuildingElement,
  elements: BuildingElement[],
): BuildingElement {
  if (!WALL_TYPES.has(newEl.type)) return newEl;

  const newEndpoints = getEndpoints(newEl);

  let bestDist = JOIN_RADIUS;
  let bestOffset: [number, number] | null = null;
  let sourceEndpointIdx = -1;

  for (const el of elements) {
    if (!WALL_TYPES.has(el.type) || el.id === newEl.id) continue;
    const existingEndpoints = getEndpoints(el);

    for (let ni = 0; ni < newEndpoints.length; ni++) {
      const [nx, nz] = newEndpoints[ni];
      for (const [ex, ez] of existingEndpoints) {
        const dist = Math.sqrt((nx - ex) ** 2 + (nz - ez) ** 2);
        if (dist < bestDist) {
          bestDist = dist;
          bestOffset = [ex - nx, ez - nz];
          sourceEndpointIdx = ni;
        }
      }
    }
  }

  if (bestOffset && sourceEndpointIdx >= 0) {
    return {
      ...newEl,
      position: [
        newEl.position[0] + bestOffset[0],
        newEl.position[1],
        newEl.position[2] + bestOffset[1],
      ],
    };
  }

  return newEl;
}
