import type { ReactNode } from "react";
import { useRef } from "react";
import type * as THREE from "three";
import type { BuildingElement } from "../../store/useStore";
import { useStore } from "../../store/useStore";

interface MeshElementProps {
  element: BuildingElement;
  renderMode: string;
  onSelect: (id: string, addToSelection: boolean) => void;
}

function MeshElement({ element, renderMode, onSelect }: MeshElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { position, dimensions, material, type, selected } = element;
  const color = selected ? "#2F7DFF" : material.color;
  const opacity = material.opacity;
  const transparent = opacity < 1;

  let geometry: ReactNode;
  if (type === "Column") {
    geometry = <cylinderGeometry args={[0.25, 0.25, dimensions.height, 8]} />;
  } else if (type === "Stair") {
    geometry = (
      <boxGeometry
        args={[dimensions.width, dimensions.height, dimensions.length]}
      />
    );
  } else {
    const w = dimensions.width > 0 ? dimensions.width : 0.3;
    const h = dimensions.height > 0 ? dimensions.height : 0.3;
    const l = dimensions.length > 0 ? dimensions.length : 0.3;
    geometry = <boxGeometry args={[w, h, l]} />;
  }

  let mat: ReactNode;
  if (renderMode === "wireframe") {
    mat = (
      <meshBasicMaterial color={selected ? "#2F7DFF" : "#6B7A8D"} wireframe />
    );
  } else if (renderMode === "shaded") {
    mat = (
      <meshLambertMaterial
        color={color}
        transparent={transparent}
        opacity={opacity}
      />
    );
  } else {
    mat = (
      <meshPhysicalMaterial
        color={color}
        roughness={material.roughness}
        metalness={material.metalness}
        transparent={transparent}
        opacity={opacity}
      />
    );
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: 3D mesh click is a canvas interaction, not a DOM element
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id, e.shiftKey);
      }}
      castShadow
      receiveShadow
    >
      {geometry}
      {mat}
    </mesh>
  );
}

export function MeridianHouseScene({
  onSelectElement,
}: { onSelectElement: (id: string, addToSelection: boolean) => void }) {
  const elements = useStore((s) => s.elements);
  const renderMode = useStore((s) => s.renderMode);
  const layers = useStore((s) => s.layers);
  const visibleLayers = new Set(
    layers.filter((l) => l.visible).map((l) => l.name),
  );

  return (
    <group>
      {elements
        .filter((el) => visibleLayers.has(el.layer))
        .map((el) => (
          <MeshElement
            key={el.id}
            element={el}
            renderMode={renderMode}
            onSelect={onSelectElement}
          />
        ))}
    </group>
  );
}
