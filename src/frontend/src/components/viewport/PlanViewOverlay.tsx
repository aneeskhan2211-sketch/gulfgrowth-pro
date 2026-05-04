import { useCallback, useRef, useState } from "react";
import type { PlanAnnotation } from "../../store/useStore";
import { useStore } from "../../store/useStore";

const COLS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const SVG_TO_METERS = 0.05;

// SVG coordinate helpers
const W = 800;
const H = 600;
const padX = 40;
const padY = 40;

/** Convert world x to SVG x */
function worldToSvgX(worldX: number): number {
  return W / 2 + worldX * 4;
}
/** Convert world z to SVG y */
function worldToSvgY(worldZ: number): number {
  return H / 2 - worldZ * 4;
}

export function PlanViewOverlay() {
  const viewMode = useStore((s) => s.viewMode);
  const elements = useStore((s) => s.elements);
  const activeTool = useStore((s) => s.activeTool);
  const activeLevel = useStore((s) => s.activeLevel);
  const annotations = useStore((s) => s.annotations);
  const addAnnotation = useStore((s) => s.addAnnotation);
  const deleteAnnotation = useStore((s) => s.deleteAnnotation);
  const clearAnnotations = useStore((s) => s.clearAnnotations);
  const setActiveTool = useStore((s) => s.setActiveTool);

  const [pendingDimPoint, setPendingDimPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pendingText, setPendingText] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [textInputValue, setTextInputValue] = useState("");
  const [smartDimsMode, setSmartDimsMode] = useState(false);
  const [smartFirstClick, setSmartFirstClick] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const isAnnotationMode =
    activeTool === "Dimension" || activeTool === "TextNote";

  const getSVGCoords = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (W / rect.width),
      y: (e.clientY - rect.top) * (H / rect.height),
    };
  }, []);

  /** Find element whose SVG bounding rect contains the click point */
  function findElementAtSVGPoint(svgX: number, svgY: number): string | null {
    for (const el of elements) {
      const ex = worldToSvgX(el.position[0]);
      const ey = worldToSvgY(el.position[2]);
      const hw = (el.dimensions.width * 4) / 2;
      const hl = (el.dimensions.length * 4) / 2;
      if (
        svgX >= ex - hw &&
        svgX <= ex + hw &&
        svgY >= ey - hl &&
        svgY <= ey + hl
      ) {
        return el.id;
      }
    }
    return null;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: findElementAtSVGPoint is a stable inline fn
  const handleSVGClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isAnnotationMode) return;
      const { x, y } = getSVGCoords(e);

      if (activeTool === "Dimension") {
        // Smart dims mode: click on elements to create associative dims
        if (smartDimsMode) {
          const hitId = findElementAtSVGPoint(x, y);
          if (!hitId) return;
          if (!smartFirstClick) {
            setSmartFirstClick(hitId);
          } else {
            const elA = elements.find((el) => el.id === smartFirstClick);
            const elB = elements.find((el) => el.id === hitId);
            if (!elA || !elB) {
              setSmartFirstClick(null);
              return;
            }
            const ax = worldToSvgX(elA.position[0]);
            const ay = worldToSvgY(elA.position[2]);
            const bx = worldToSvgX(elB.position[0]);
            const by = worldToSvgY(elB.position[2]);
            const dx = bx - ax;
            const dy = by - ay;
            const dist = Math.sqrt(dx * dx + dy * dy) * SVG_TO_METERS;
            const annotation: PlanAnnotation = {
              id: `dim_${Date.now()}`,
              type: "dimension",
              x1: ax,
              y1: ay,
              x2: bx,
              y2: by,
              label: `${dist.toFixed(1)}m`,
              elementAId: smartFirstClick,
              elementBId: hitId,
            };
            addAnnotation(annotation);
            setSmartFirstClick(null);
          }
          return;
        }

        // Manual dimension
        if (!pendingDimPoint) {
          setPendingDimPoint({ x, y });
        } else {
          const dx = x - pendingDimPoint.x;
          const dy = y - pendingDimPoint.y;
          const dist = Math.sqrt(dx * dx + dy * dy) * SVG_TO_METERS;
          const annotation: PlanAnnotation = {
            id: `dim_${Date.now()}`,
            type: "dimension",
            x1: pendingDimPoint.x,
            y1: pendingDimPoint.y,
            x2: x,
            y2: y,
            label: `${dist.toFixed(1)}m`,
          };
          addAnnotation(annotation);
          setPendingDimPoint(null);
        }
      } else if (activeTool === "TextNote") {
        setPendingText({ x, y });
        setTextInputValue("");
      }
    },
    [
      activeTool,
      pendingDimPoint,
      isAnnotationMode,
      getSVGCoords,
      addAnnotation,
      smartDimsMode,
      smartFirstClick,
      elements,
    ],
  );

  const commitTextNote = useCallback(() => {
    if (pendingText && textInputValue.trim()) {
      addAnnotation({
        id: `note_${Date.now()}`,
        type: "textnote",
        x: pendingText.x,
        y: pendingText.y,
        text: textInputValue.trim(),
      });
    }
    setPendingText(null);
    setTextInputValue("");
  }, [pendingText, textInputValue, addAnnotation]);

  if (viewMode !== "plan") return null;

  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const floorElements = elements.filter(
    (el) => el.type === "Floor" || el.type === "Slab",
  );

  // Wall elements on active level for plan view rendering
  const wallElements = elements.filter(
    (el) =>
      (el.type === "Wall" ||
        el.type === "Curtain Wall" ||
        el.type === "CurtainWall") &&
      el.level === activeLevel,
  );

  // Door and window elements on active level
  const openingElements = elements.filter(
    (el) =>
      (el.type === "Door" || el.type === "Window") && el.level === activeLevel,
  );

  /** Resolve dimension endpoints, accounting for associative dims */
  function resolveDimEndpoints(ann: PlanAnnotation): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label: string;
  } | null {
    if (ann.elementAId && ann.elementBId) {
      const elA = elements.find((el) => el.id === ann.elementAId);
      const elB = elements.find((el) => el.id === ann.elementBId);
      if (!elA || !elB) return null;
      const ax = worldToSvgX(elA.position[0]);
      const ay = worldToSvgY(elA.position[2]);
      const bx = worldToSvgX(elB.position[0]);
      const by = worldToSvgY(elB.position[2]);
      const dx = bx - ax;
      const dy = by - ay;
      const dist = Math.sqrt(dx * dx + dy * dy) * SVG_TO_METERS;
      return { x1: ax, y1: ay, x2: bx, y2: by, label: `${dist.toFixed(1)}m` };
    }
    if (
      ann.x1 !== undefined &&
      ann.y1 !== undefined &&
      ann.x2 !== undefined &&
      ann.y2 !== undefined
    ) {
      return {
        x1: ann.x1,
        y1: ann.y1,
        x2: ann.x2,
        y2: ann.y2,
        label: ann.label ?? "",
      };
    }
    return null;
  }

  return (
    <div
      className={`absolute inset-0 z-10 ${isAnnotationMode ? "" : "pointer-events-none"}`}
      style={{
        cursor: isAnnotationMode
          ? activeTool === "Dimension"
            ? "crosshair"
            : "text"
          : undefined,
      }}
    >
      {/* Annotation toolbar */}
      {isAnnotationMode && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-lg z-20"
          style={{
            background: "rgba(15,20,30,0.9)",
            border: "1px solid rgba(74,158,255,0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <button
            type="button"
            data-ocid="annotation.dimension.button"
            onClick={() => {
              setActiveTool("Dimension");
              setPendingDimPoint(null);
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
              activeTool === "Dimension"
                ? "bg-blue-500 text-white"
                : "text-blue-300 hover:bg-blue-500/20"
            }`}
          >
            ↔ Dimension
          </button>
          <button
            type="button"
            data-ocid="annotation.textnote.button"
            onClick={() => {
              setActiveTool("TextNote");
              setPendingDimPoint(null);
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
              activeTool === "TextNote"
                ? "bg-blue-500 text-white"
                : "text-blue-300 hover:bg-blue-500/20"
            }`}
          >
            T Text Note
          </button>

          {activeTool === "Dimension" && (
            <button
              type="button"
              data-ocid="annotation.smart_dims.toggle"
              onClick={() => {
                setSmartDimsMode((v) => !v);
                setSmartFirstClick(null);
                setPendingDimPoint(null);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                smartDimsMode
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-400 hover:bg-emerald-500/20"
              }`}
              title="Smart Dims: click two elements to create associative dimension"
            >
              ⛓ Smart
            </button>
          )}

          <div className="w-px h-4 bg-white/20" />
          {pendingDimPoint && !smartDimsMode && (
            <span className="text-[9px] text-blue-300 px-1">
              Click second point…
            </span>
          )}
          {smartDimsMode && (
            <span className="text-[9px] text-emerald-300 px-1">
              {smartFirstClick
                ? "Click second element…"
                : "Click first element…"}
            </span>
          )}
          <button
            type="button"
            data-ocid="annotation.clear.button"
            onClick={() => {
              clearAnnotations();
              setPendingDimPoint(null);
              setSmartFirstClick(null);
            }}
            className="px-2 py-1 rounded text-[10px] text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Clear All
          </button>
          <button
            type="button"
            data-ocid="annotation.exit.button"
            onClick={() => {
              setActiveTool("Select");
              setPendingDimPoint(null);
              setPendingText(null);
              setSmartFirstClick(null);
              setSmartDimsMode(false);
            }}
            className="px-2 py-1 rounded text-[10px] text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            ✕ Exit
          </button>
        </div>
      )}

      {/* Inline text input for TextNote */}
      {pendingText && (
        <div
          className="absolute z-30 pointer-events-auto"
          style={{
            left: `${(pendingText.x / W) * 100}%`,
            top: `${(pendingText.y / H) * 100}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="flex items-center gap-1 p-1 rounded shadow-lg"
            style={{
              background: "rgba(15,20,30,0.95)",
              border: "1px solid #4A9EFF",
            }}
          >
            <input
              data-ocid="annotation.textnote.input"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTextNote();
                if (e.key === "Escape") {
                  setPendingText(null);
                  setTextInputValue("");
                }
              }}
              placeholder="Enter note…"
              className="bg-transparent text-blue-200 text-[11px] outline-none w-28 placeholder:text-blue-400/40"
              // biome-ignore lint/a11y/noAutofocus: annotation input needs immediate focus
              autoFocus
            />
            <button
              type="button"
              onClick={commitTextNote}
              className="text-blue-400 text-[10px] hover:text-white transition-colors px-1"
            >
              ✓
            </button>
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Plan view annotation overlay"
        preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
        onClick={handleSVGClick}
        onKeyDown={(e) => e.key === "Enter" && handleSVGClick(e as any)}
      >
        {COLS.map((col, i) => {
          const x = padX + (i / (COLS.length - 1)) * innerW;
          return (
            <g key={`col-top-${col}`}>
              <circle
                cx={x}
                cy={padY - 14}
                r={9}
                fill="none"
                stroke="#4A9EFF"
                strokeOpacity={0.5}
                strokeWidth={0.8}
              />
              <text
                x={x}
                y={padY - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="#A0C4FF"
                fillOpacity={0.75}
              >
                {col}
              </text>
              <line
                x1={x}
                y1={padY - 4}
                x2={x}
                y2={padY + 8}
                stroke="#4A9EFF"
                strokeOpacity={0.3}
                strokeWidth={0.6}
              />
            </g>
          );
        })}
        {COLS.map((col, i) => {
          const x = padX + (i / (COLS.length - 1)) * innerW;
          return (
            <g key={`col-bot-${col}`}>
              <circle
                cx={x}
                cy={H - padY + 14}
                r={9}
                fill="none"
                stroke="#4A9EFF"
                strokeOpacity={0.5}
                strokeWidth={0.8}
              />
              <text
                x={x}
                y={H - padY + 18}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="#A0C4FF"
                fillOpacity={0.75}
              >
                {col}
              </text>
              <line
                x1={x}
                y1={H - padY - 8}
                x2={x}
                y2={H - padY + 4}
                stroke="#4A9EFF"
                strokeOpacity={0.3}
                strokeWidth={0.6}
              />
            </g>
          );
        })}
        {ROWS.map((row, i) => {
          const y = padY + (i / (ROWS.length - 1)) * innerH;
          return (
            <g key={`row-left-${row}`}>
              <circle
                cx={padX - 14}
                cy={y}
                r={9}
                fill="none"
                stroke="#4A9EFF"
                strokeOpacity={0.5}
                strokeWidth={0.8}
              />
              <text
                x={padX - 14}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="#A0C4FF"
                fillOpacity={0.75}
              >
                {row}
              </text>
              <line
                x1={padX + 4}
                y1={y}
                x2={padX - 4}
                y2={y}
                stroke="#4A9EFF"
                strokeOpacity={0.3}
                strokeWidth={0.6}
              />
            </g>
          );
        })}
        {ROWS.map((row, i) => {
          const y = padY + (i / (ROWS.length - 1)) * innerH;
          return (
            <g key={`row-right-${row}`}>
              <circle
                cx={W - padX + 14}
                cy={y}
                r={9}
                fill="none"
                stroke="#4A9EFF"
                strokeOpacity={0.5}
                strokeWidth={0.8}
              />
              <text
                x={W - padX + 14}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="#A0C4FF"
                fillOpacity={0.75}
              >
                {row}
              </text>
              <line
                x1={W - padX - 4}
                y1={y}
                x2={W - padX + 4}
                y2={y}
                stroke="#4A9EFF"
                strokeOpacity={0.3}
                strokeWidth={0.6}
              />
            </g>
          );
        })}

        <line
          x1={padX}
          y1={H - 14}
          x2={W - padX}
          y2={H - 14}
          stroke="#4A9EFF"
          strokeOpacity={0.55}
          strokeWidth={0.8}
        />
        <line
          x1={padX}
          y1={H - 18}
          x2={padX}
          y2={H - 10}
          stroke="#4A9EFF"
          strokeOpacity={0.55}
          strokeWidth={0.8}
        />
        <line
          x1={W - padX}
          y1={H - 18}
          x2={W - padX}
          y2={H - 10}
          stroke="#4A9EFF"
          strokeOpacity={0.55}
          strokeWidth={0.8}
        />
        <text
          x={W / 2}
          y={H - 4}
          textAnchor="middle"
          fontSize={9}
          fill="#A0C4FF"
          fillOpacity={0.7}
        >
          ~40m
        </text>
        <line
          x1={14}
          y1={padY}
          x2={14}
          y2={H - padY}
          stroke="#4A9EFF"
          strokeOpacity={0.55}
          strokeWidth={0.8}
        />
        <line
          x1={10}
          y1={padY}
          x2={18}
          y2={padY}
          stroke="#4A9EFF"
          strokeOpacity={0.55}
          strokeWidth={0.8}
        />
        <line
          x1={10}
          y1={H - padY}
          x2={18}
          y2={H - padY}
          stroke="#4A9EFF"
          strokeOpacity={0.55}
          strokeWidth={0.8}
        />
        <text
          x={6}
          y={H / 2}
          textAnchor="middle"
          fontSize={9}
          fill="#A0C4FF"
          fillOpacity={0.7}
          transform={`rotate(-90, 6, ${H / 2})`}
        >
          ~30m
        </text>

        <g transform={`translate(${padX + 4}, ${H - padY - 10})`}>
          <rect
            x={0}
            y={0}
            width={40}
            height={5}
            fill="#4A9EFF"
            fillOpacity={0.55}
          />
          <rect
            x={40}
            y={0}
            width={40}
            height={5}
            fill="none"
            stroke="#4A9EFF"
            strokeOpacity={0.55}
            strokeWidth={0.8}
          />
          <text x={0} y={-3} fontSize={8} fill="#A0C4FF" fillOpacity={0.7}>
            0
          </text>
          <text x={36} y={-3} fontSize={8} fill="#A0C4FF" fillOpacity={0.7}>
            10m
          </text>
          <text x={76} y={-3} fontSize={8} fill="#A0C4FF" fillOpacity={0.7}>
            20m
          </text>
          <text x={0} y={14} fontSize={8} fill="#A0C4FF" fillOpacity={0.6}>
            1:100
          </text>
        </g>

        <g transform={`translate(${W - padX - 16}, ${padY + 12})`}>
          <line
            x1={0}
            y1={18}
            x2={0}
            y2={-18}
            stroke="#4A9EFF"
            strokeOpacity={0.7}
            strokeWidth={1.2}
          />
          <polygon
            points="0,-22 -5,-12 5,-12"
            fill="#4A9EFF"
            fillOpacity={0.75}
          />
          <text
            x={0}
            y={30}
            textAnchor="middle"
            fontSize={10}
            fill="#A0C4FF"
            fillOpacity={0.8}
            fontWeight="bold"
          >
            N
          </text>
          <circle
            cx={0}
            cy={0}
            r={22}
            fill="none"
            stroke="#4A9EFF"
            strokeOpacity={0.3}
            strokeWidth={0.7}
          />
        </g>

        {/* Wall elements with door/window openings */}
        {wallElements.map((wall) => {
          const wx = worldToSvgX(wall.position[0]);
          const wy = worldToSvgY(wall.position[2]);
          const ww = wall.dimensions.width * 4;
          const wl = wall.dimensions.length * 4;
          // Walls are rendered as thin rectangles in plan; width=long side, length=thickness
          const rectW = Math.max(ww, 2);
          const rectH = Math.max(wl, 2);
          const rectX = wx - rectW / 2;
          const rectY = wy - rectH / 2;

          // Find hosted openings (doors/windows) in this wall
          const hosted = openingElements.filter(
            (o) => o.hostedWallId === wall.id,
          );

          return (
            <g key={`wall-${wall.id}`}>
              {/* Wall body */}
              <rect
                x={rectX}
                y={rectY}
                width={rectW}
                height={rectH}
                fill="#8090A8"
                fillOpacity={0.55}
                stroke="#A0B4CC"
                strokeOpacity={0.8}
                strokeWidth={0.8}
              />
              {/* Opening gaps for doors/windows */}
              {hosted.map((opening) => {
                const ox = worldToSvgX(opening.position[0]);
                const openW = opening.dimensions.width * 4;
                const gapW = openW;
                const gapX = ox - gapW / 2;
                const gapY = rectY - 1;
                const gapH = rectH + 2;
                return (
                  <g key={`opening-${opening.id}`}>
                    <rect
                      x={gapX}
                      y={gapY}
                      width={gapW}
                      height={gapH}
                      fill="#1a2028"
                      fillOpacity={1}
                    />
                    {opening.type === "Door" &&
                      (() => {
                        const x1 = ox - openW / 2;
                        const x2 = ox + openW / 2;
                        const doorPath = `M ${x1} ${wy} L ${x1} ${wy - openW} A ${openW} ${openW} 0 0 1 ${x2} ${wy}`;
                        return (
                          <path
                            d={doorPath}
                            fill="none"
                            stroke="#C8D8F0"
                            strokeOpacity={0.7}
                            strokeWidth={0.8}
                          />
                        );
                      })()}
                    {opening.type === "Window" && (
                      <line
                        x1={gapX}
                        y1={wy}
                        x2={gapX + gapW}
                        y2={wy}
                        stroke="#88CCFF"
                        strokeOpacity={0.8}
                        strokeWidth={1.5}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {floorElements.map((el) => {
          const svgX = worldToSvgX(el.position[0]);
          const svgY = worldToSvgY(el.position[2]);
          const area = el.dimensions.area
            ? el.dimensions.area.toFixed(1)
            : (el.dimensions.width * el.dimensions.length).toFixed(1);
          return (
            <g key={`room-${el.id}`}>
              <text
                x={svgX}
                y={svgY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fill="#A0C4FF"
                fillOpacity={0.65}
              >
                {el.type} — {area} m²
              </text>
            </g>
          );
        })}

        {pendingDimPoint && !smartDimsMode && (
          <circle
            cx={pendingDimPoint.x}
            cy={pendingDimPoint.y}
            r={5}
            fill="#4A9EFF"
            fillOpacity={0.9}
            stroke="white"
            strokeWidth={1}
          />
        )}

        {annotations.map((ann) => {
          if (ann.type === "dimension") {
            const pts = resolveDimEndpoints(ann);
            if (!pts) return null;
            const { x1, y1, x2, y2, label } = pts;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            const isAssociative = !!(ann.elementAId && ann.elementBId);
            return (
              <g
                key={ann.id}
                tabIndex={0}
                aria-label="Delete annotation"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAnnotation(ann.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    deleteAnnotation(ann.id);
                  }
                }}
              >
                <defs>
                  <marker
                    id={`arr-${ann.id}`}
                    markerWidth="6"
                    markerHeight="6"
                    refX="3"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L6,3 L0,6 Z"
                      fill={isAssociative ? "#00FF88" : "#FFD700"}
                    />
                  </marker>
                  <marker
                    id={`arr2-${ann.id}`}
                    markerWidth="6"
                    markerHeight="6"
                    refX="3"
                    refY="3"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M0,0 L6,3 L0,6 Z"
                      fill={isAssociative ? "#00FF88" : "#FFD700"}
                    />
                  </marker>
                </defs>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isAssociative ? "#00FF88" : "#FFD700"}
                  strokeWidth={1.5}
                  strokeOpacity={0.85}
                  strokeDasharray={isAssociative ? "4 2" : undefined}
                  markerStart={`url(#arr2-${ann.id})`}
                  markerEnd={`url(#arr-${ann.id})`}
                />
                <g
                  transform={`translate(${mx}, ${my}) rotate(${angle > 90 || angle < -90 ? angle + 180 : angle})`}
                >
                  <rect
                    x={-18}
                    y={-9}
                    width={36}
                    height={11}
                    fill="rgba(15,20,30,0.85)"
                    rx={2}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    y={-3}
                    fontSize={8}
                    fill={isAssociative ? "#00FF88" : "#FFD700"}
                    fontWeight="bold"
                  >
                    {label}
                  </text>
                </g>
                <circle
                  cx={x1}
                  cy={y1}
                  r={3}
                  fill={isAssociative ? "#00FF88" : "#FFD700"}
                  fillOpacity={0.8}
                />
                <circle
                  cx={x2}
                  cy={y2}
                  r={3}
                  fill={isAssociative ? "#00FF88" : "#FFD700"}
                  fillOpacity={0.8}
                />
              </g>
            );
          }
          if (
            ann.type === "textnote" &&
            ann.x !== undefined &&
            ann.y !== undefined
          ) {
            const textWidth = Math.max(40, (ann.text?.length ?? 0) * 5.5 + 12);
            return (
              <g
                key={ann.id}
                tabIndex={0}
                aria-label="Delete annotation"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAnnotation(ann.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    deleteAnnotation(ann.id);
                  }
                }}
              >
                <rect
                  x={ann.x - textWidth / 2}
                  y={ann.y - 18}
                  width={textWidth}
                  height={14}
                  fill="rgba(15,20,30,0.9)"
                  stroke="#A0C4FF"
                  strokeWidth={0.8}
                  strokeOpacity={0.7}
                  rx={3}
                />
                <polygon
                  points={`${ann.x - 4},${ann.y - 4} ${ann.x + 4},${ann.y - 4} ${ann.x},${ann.y + 2}`}
                  fill="rgba(15,20,30,0.9)"
                  stroke="#A0C4FF"
                  strokeWidth={0.8}
                  strokeOpacity={0.7}
                />
                <text
                  x={ann.x}
                  y={ann.y - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={8}
                  fill="#A0C4FF"
                >
                  {ann.text}
                </text>
                <circle
                  cx={ann.x}
                  cy={ann.y + 2}
                  r={2}
                  fill="#A0C4FF"
                  fillOpacity={0.7}
                />
              </g>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}
