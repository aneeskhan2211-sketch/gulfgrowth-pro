import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import type * as THREE from "three";
import { NON_PLACEMENT_TOOLS, toolDefaults } from "../../data/toolDefaults";
import { toolDefinitions } from "../../data/toolDefinitions";
import { useStore } from "../../store/useStore";
import type { ViewMode } from "../../store/useStore";
import { applyWallJoins } from "../../utils/wallJoins";
import { MeridianHouseScene } from "./MeridianHouse";
import { PlacementLayer } from "./PlacementLayer";
import { PlanViewOverlay } from "./PlanViewOverlay";

function Lights({ renderMode }: { renderMode: string }) {
  return (
    <>
      <ambientLight intensity={renderMode === "rendered" ? 0.5 : 0.8} />
      <directionalLight
        position={[20, 30, 15]}
        intensity={renderMode === "rendered" ? 1.5 : 1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {renderMode === "rendered" && (
        <>
          <pointLight
            position={[-10, 20, -10]}
            intensity={0.5}
            color="#a0c0ff"
          />
          <hemisphereLight args={["#c8d8ff", "#404850", 0.6]} />
        </>
      )}
    </>
  );
}

function CameraSetup({ viewMode }: { viewMode: ViewMode }) {
  const { camera } = useThree();

  useEffect(() => {
    if (viewMode === "3d") {
      camera.position.set(30, 20, 30);
      camera.up.set(0, 1, 0);
      (camera as any).fov = 50;
      camera.updateProjectionMatrix?.();
    } else if (viewMode === "plan") {
      camera.up.set(0, 0, -1);
      camera.position.set(0, 60, 0);
      camera.lookAt(0, 0, 0);
    } else if (viewMode === "front") {
      camera.up.set(0, 1, 0);
      camera.position.set(0, 6, 60);
      camera.lookAt(0, 6, 0);
    } else if (viewMode === "right") {
      camera.up.set(0, 1, 0);
      camera.position.set(60, 6, 0);
      camera.lookAt(0, 6, 0);
    } else if (viewMode === "section") {
      camera.up.set(0, 1, 0);
      camera.position.set(-60, 6, 0);
      camera.lookAt(0, 6, 0);
    }
    camera.updateProjectionMatrix?.();
  }, [viewMode, camera]);

  return null;
}

function CameraController() {
  const { camera } = useThree();
  const preset = useStore((s) =>
    s.cameraPresets.find((p) => p.id === "perspective"),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional init-only camera setup
  useEffect(() => {
    if (preset) camera.position.set(...preset.position);
  }, []);

  return null;
}

function MeasureTool({
  active,
  onMeasure,
}: { active: boolean; onMeasure: (dist: number) => void }) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  const handleClick = (e: any) => {
    if (!active) return;
    const pt = e.point.clone();
    const newPoints = [...points, pt];
    if (newPoints.length === 2) {
      onMeasure(newPoints[0].distanceTo(newPoints[1]));
      setPoints([]);
    } else {
      setPoints(newPoints);
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: 3D canvas mesh, not a DOM element
    <mesh position={[0, -100, 0]} onClick={handleClick}>
      <boxGeometry args={[1000, 0.01, 1000]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

const viewLabels: Record<ViewMode, string> = {
  "3d": "3D Viewport",
  plan: "Plan View",
  front: "Front Elevation",
  right: "Right Elevation",
  section: "Section View",
};

export function Viewport() {
  const renderMode = useStore((s) => s.renderMode);
  const viewMode = useStore((s) => s.viewMode);
  const activeTool = useStore((s) => s.activeTool);
  const activeLevel = useStore((s) => s.activeLevel);
  const levels = useStore((s) => s.levels);
  const selectElements = useStore((s) => s.selectElements);
  const clearSelection = useStore((s) => s.clearSelection);
  const addElement = useStore((s) => s.addElement);
  const elements = useStore((s) => s.elements);
  const pushHistory = useStore((s) => s.pushHistory);
  const updateLevel = useStore((s) => s.updateLevel);
  const [measureDist, setMeasureDist] = useState<number | null>(null);

  const isPlacementMode =
    !NON_PLACEMENT_TOOLS.has(activeTool) && !!toolDefaults[activeTool];

  const isOrtho = viewMode !== "3d";

  const orthoPos: [number, number, number] =
    viewMode === "plan"
      ? [0, 60, 0]
      : viewMode === "front"
        ? [0, 6, 60]
        : viewMode === "section"
          ? [-60, 6, 0]
          : [60, 6, 0]; // right

  const handleSelectElement = (id: string, addToSelection: boolean) => {
    selectElements([id], addToSelection);
  };

  const handlePlace = (
    pos: [number, number, number],
    hostedWallId?: string,
  ) => {
    const defaults = toolDefaults[activeTool];
    if (!defaults) return;

    const level = levels.find((l) => l.name === activeLevel);
    const elevation = level?.elevation ?? 0;

    const toolDef = toolDefinitions.find((t) => t.id === activeTool);
    const name = `${defaults.type} ${Date.now().toString(36).slice(-4).toUpperCase()}`;

    const newElement = {
      id: crypto.randomUUID(),
      type: defaults.type,
      discipline: defaults.discipline,
      level: activeLevel,
      layer: defaults.layer,
      position: [
        pos[0],
        pos[1] + elevation + defaults.dimensions.height / 2,
        pos[2],
      ] as [number, number, number],
      dimensions: { ...defaults.dimensions },
      material: { ...defaults.material },
      name,
      selected: false,
      ifcType: defaults.ifcType,
      hostedWallId,
      properties: {},
    };

    const adjustedElement = applyWallJoins(newElement, elements);
    addElement(adjustedElement);
    pushHistory(`Place ${toolDef?.name ?? defaults.type}`);

    if (level) {
      updateLevel(level.id, { elementCount: (level.elementCount ?? 0) + 1 });
    }
  };

  const bg = "#1a2028";

  return (
    <div
      className="relative w-full h-full"
      style={{
        background: bg,
        cursor: isPlacementMode ? "crosshair" : "default",
      }}
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{ background: "rgba(0,0,0,0.5)", color: "#A8B1BC" }}
        >
          {viewLabels[viewMode]}
        </span>
        {isPlacementMode && (
          <span
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ background: "rgba(47,125,255,0.85)", color: "#fff" }}
          >
            Placing: {toolDefinitions.find((t) => t.id === activeTool)?.name}
          </span>
        )}
      </div>

      {measureDist !== null && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span
            className="px-3 py-1 rounded text-xs font-medium"
            style={{ background: "rgba(47,125,255,0.9)", color: "#fff" }}
          >
            Distance: {measureDist.toFixed(2)}m
          </span>
        </div>
      )}

      {/* Plan view SVG annotation overlay */}
      <PlanViewOverlay />

      <Canvas
        key={viewMode}
        shadows={renderMode === "rendered"}
        orthographic={isOrtho}
        camera={
          isOrtho
            ? { near: 0.1, far: 1000, zoom: 8, position: orthoPos }
            : { fov: 50, near: 0.1, far: 1000 }
        }
        gl={{ antialias: true }}
        onPointerMissed={() => {
          if (!isPlacementMode) clearSelection();
        }}
        style={{ background: bg }}
      >
        <color attach="background" args={[bg]} />
        {!isOrtho && <fog attach="fog" args={[bg, 80, 200]} />}
        {!isOrtho && <CameraController />}
        <CameraSetup viewMode={viewMode} />
        <Lights renderMode={renderMode} />
        {renderMode === "rendered" && !isOrtho && (
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>
        )}
        {renderMode !== "wireframe" && (
          <gridHelper
            args={
              isOrtho
                ? [60, 120, "#2A3340", "#1E2630"]
                : [60, 60, "#2A3340", "#242B35"]
            }
          />
        )}
        <MeridianHouseScene onSelectElement={handleSelectElement} />
        {activeTool === "Measure" && (
          <MeasureTool active={true} onMeasure={(d) => setMeasureDist(d)} />
        )}
        {isPlacementMode && (
          <PlacementLayer toolId={activeTool} onPlace={handlePlace} />
        )}
        <OrbitControls
          makeDefault
          minDistance={3}
          maxDistance={150}
          enableDamping
          dampingFactor={0.08}
          enabled={!isPlacementMode}
          enableRotate={viewMode === "3d"}
          {...(viewMode === "plan"
            ? { maxPolarAngle: 0, minPolarAngle: 0 }
            : {})}
        />
      </Canvas>
    </div>
  );
}
