import { Html } from "@react-three/drei";
import { useRef, useState } from "react";
import type * as THREE from "three";
import { toolDefaults } from "../../data/toolDefaults";
import { useStore } from "../../store/useStore";
import { findSnapPoint } from "../../utils/snapEngine";
import type { SnapType } from "../../utils/snapEngine";

interface PlacementLayerProps {
  toolId: string;
  onPlace: (position: [number, number, number], hostedWallId?: string) => void;
}

export function PlacementLayer({ toolId, onPlace }: PlacementLayerProps) {
  const [hoverPos, setHoverPos] = useState<[number, number, number] | null>(
    null,
  );
  const [snapIndicator, setSnapIndicator] = useState<
    [number, number, number] | null
  >(null);
  const [snapType, setSnapType] = useState<SnapType>("Grid");
  const planeRef = useRef<THREE.Mesh>(null);
  const gridSnap = useStore((s) => s.gridSnap);
  const gridSize = useStore((s) => s.gridSize);
  const elements = useStore((s) => s.elements);
  const activeLevel = useStore((s) => s.activeLevel);

  const defaults = toolDefaults[toolId];
  if (!defaults) return null;

  const { dimensions, material } = defaults;
  const w = dimensions.width > 0 ? dimensions.width : 1;
  const h = dimensions.height > 0 ? dimensions.height : 1;
  const l = dimensions.length > 0 ? dimensions.length : 1;

  const ghostColor = material.color;

  const isDoorOrWindow = toolId === "Door" || toolId === "Window";

  function resolveSnap(
    rawX: number,
    rawZ: number,
  ): { sx: number; sz: number; type: SnapType } {
    const result = findSnapPoint(rawX, rawZ, elements, gridSize, gridSnap);
    return { sx: result.point[0], sz: result.point[1], type: result.type };
  }

  /** Find the nearest wall to snap a door/window to */
  function findHostWall(
    sx: number,
    sz: number,
  ): { wallId: string; snappedX: number; snappedZ: number } | null {
    if (!isDoorOrWindow) return null;
    const walls = elements.filter(
      (e) => e.type === "Wall" && e.level === activeLevel,
    );
    let nearest: { wallId: string; snappedX: number; snappedZ: number } | null =
      null;
    let minDist = 3; // 3m threshold
    for (const wall of walls) {
      const wx = wall.position[0];
      const wz = wall.position[2];
      const dx = sx - wx;
      const dz = sz - wz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        // Determine wall orientation: wall runs along X if width > length
        const runsAlongX = wall.dimensions.width > wall.dimensions.length;
        const snappedX = runsAlongX ? sx : wx;
        const snappedZ = runsAlongX ? wz : sz;
        nearest = { wallId: wall.id, snappedX, snappedZ };
      }
    }
    return nearest;
  }

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    const pt = e.point;
    const { sx, sz, type } = resolveSnap(pt.x, pt.z);
    setHoverPos([sx, 0, sz]);
    setSnapType(type);

    if (type !== "Grid") {
      setSnapIndicator([sx, 0.05, sz]);
    } else {
      setSnapIndicator(null);
    }
  };

  const handlePointerLeave = () => {
    setHoverPos(null);
    setSnapIndicator(null);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    const pt = e.point;
    const { sx, sz } = resolveSnap(pt.x, pt.z);

    if (isDoorOrWindow) {
      const hostWall = findHostWall(sx, sz);
      if (hostWall) {
        onPlace([hostWall.snappedX, 0, hostWall.snappedZ], hostWall.wallId);
      } else {
        onPlace([sx, 0, sz]);
      }
    } else {
      onPlace([sx, 0, sz]);
    }
  };

  return (
    <group>
      {/* Invisible intercept plane */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: 3D canvas interaction */}
      <mesh
        ref={planeRef}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Ghost preview mesh */}
      {hoverPos && (
        <mesh position={[hoverPos[0], hoverPos[1] + h / 2, hoverPos[2]]}>
          {defaults.type === "Column" ? (
            <cylinderGeometry args={[w / 2, w / 2, h, 8]} />
          ) : (
            <boxGeometry args={[w, h, l]} />
          )}
          <meshPhysicalMaterial
            color={ghostColor}
            transparent
            opacity={0.45}
            roughness={0.5}
            metalness={0}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Element snap indicator + label */}
      {snapIndicator && (
        <mesh position={snapIndicator}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 12]} />
          <meshBasicMaterial color="#00FF88" />
          {snapType !== "Grid" && (
            <Html
              position={[0, 0.3, 0]}
              center
              style={{ pointerEvents: "none" }}
            >
              <span
                style={{
                  background: "rgba(0,0,0,0.75)",
                  color: "#00FF88",
                  fontSize: 9,
                  fontFamily: "monospace",
                  padding: "1px 4px",
                  borderRadius: 3,
                  whiteSpace: "nowrap",
                }}
              >
                {snapType}
              </span>
            </Html>
          )}
        </mesh>
      )}
    </group>
  );
}
