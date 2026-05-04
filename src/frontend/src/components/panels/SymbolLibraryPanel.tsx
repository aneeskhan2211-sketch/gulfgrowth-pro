import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";

interface Symbol {
  id: string;
  name: string;
  size: string;
  toolId: string;
  icon: React.ReactNode;
}

interface Category {
  id: string;
  label: string;
  symbols: Symbol[];
}

function DoorSingleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="28"
        width="28"
        height="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <rect
        x="4"
        y="6"
        width="2"
        height="24"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <rect
        x="4"
        y="6"
        width="14"
        height="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <path
        d="M6 8 A14 14 0 0 1 18 28"
        stroke="#4A9EFF"
        strokeWidth="1"
        strokeDasharray="2 1"
        fill="none"
      />
    </svg>
  );
}

function DoorDoubleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="2"
        y="28"
        width="32"
        height="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <rect
        x="2"
        y="6"
        width="2"
        height="24"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <rect
        x="32"
        y="6"
        width="2"
        height="24"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <path
        d="M4 8 A12 12 0 0 1 16 28"
        stroke="#4A9EFF"
        strokeWidth="1"
        strokeDasharray="2 1"
        fill="none"
      />
      <path
        d="M32 8 A12 12 0 0 0 20 28"
        stroke="#4A9EFF"
        strokeWidth="1"
        strokeDasharray="2 1"
        fill="none"
      />
    </svg>
  );
}

function DoorSlidingIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="2"
        y="28"
        width="32"
        height="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <rect
        x="2"
        y="8"
        width="18"
        height="20"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <rect
        x="8"
        y="17"
        width="6"
        height="2"
        stroke="#4A9EFF"
        strokeWidth="1"
      />
      <line
        x1="20"
        y1="10"
        x2="34"
        y2="10"
        stroke="#4A9EFF"
        strokeWidth="1"
        strokeDasharray="2 1"
      />
      <line
        x1="20"
        y1="26"
        x2="34"
        y2="26"
        stroke="#4A9EFF"
        strokeWidth="1"
        strokeDasharray="2 1"
      />
    </svg>
  );
}

function DoorBifoldIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="2"
        y="28"
        width="32"
        height="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <line x1="2" y1="8" x2="18" y2="28" stroke="#4A9EFF" strokeWidth="1.2" />
      <line
        x1="18"
        y1="8"
        x2="2"
        y2="28"
        stroke="#4A9EFF"
        strokeWidth="1"
        strokeDasharray="3 1"
      />
      <line x1="18" y1="8" x2="34" y2="28" stroke="#4A9EFF" strokeWidth="1.2" />
      <line
        x1="34"
        y1="8"
        x2="18"
        y2="28"
        stroke="#4A9EFF"
        strokeWidth="1"
        strokeDasharray="3 1"
      />
    </svg>
  );
}

function WindowFixedIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="12"
        width="28"
        height="12"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <line x1="18" y1="12" x2="18" y2="24" stroke="#4A9EFF" strokeWidth="1" />
      <line
        x1="4"
        y1="18"
        x2="32"
        y2="18"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        strokeDasharray="2 1"
      />
    </svg>
  );
}

function WindowCasementIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="12"
        width="28"
        height="12"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <line x1="18" y1="12" x2="18" y2="24" stroke="#4A9EFF" strokeWidth="1" />
      <path
        d="M18 18 L4 13"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        strokeDasharray="2 1"
      />
      <path
        d="M18 18 L32 13"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        strokeDasharray="2 1"
      />
    </svg>
  );
}

function WindowBayIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <polyline
        points="4,18 10,12 26,12 32,18 26,24 10,24 4,18"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <line
        x1="10"
        y1="12"
        x2="10"
        y2="24"
        stroke="#4A9EFF"
        strokeWidth="0.8"
      />
      <line
        x1="26"
        y1="12"
        x2="26"
        y2="24"
        stroke="#4A9EFF"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function WindowSkylightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="6"
        y="8"
        width="24"
        height="20"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <line x1="6" y1="18" x2="30" y2="18" stroke="#4A9EFF" strokeWidth="0.8" />
      <line x1="18" y1="8" x2="18" y2="28" stroke="#4A9EFF" strokeWidth="0.8" />
      <rect
        x="9"
        y="11"
        width="6"
        height="6"
        stroke="#4A9EFF"
        strokeWidth="0.6"
        fill="none"
      />
    </svg>
  );
}

function StairStraightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="28"
        width="28"
        height="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={4 + i * 5}
          y1={28 - i * 4}
          x2={4 + (i + 1) * 5}
          y2={28 - i * 4}
          stroke="#4A9EFF"
          strokeWidth="1.2"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`v${i}`}
          x1={4 + (i + 1) * 5}
          y1={28 - i * 4}
          x2={4 + (i + 1) * 5}
          y2={28 - (i + 1) * 4}
          stroke="#4A9EFF"
          strokeWidth="1.2"
        />
      ))}
      <line x1={29} y1={8} x2={32} y2={8} stroke="#4A9EFF" strokeWidth="1.2" />
    </svg>
  );
}

function StairLIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={4 + i * 4}
          y1={28 - i * 4}
          x2={4 + (i + 1) * 4}
          y2={28 - i * 4}
          stroke="#4A9EFF"
          strokeWidth="1.2"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <line
          key={`v${i}`}
          x1={4 + (i + 1) * 4}
          y1={28 - i * 4}
          x2={4 + (i + 1) * 4}
          y2={28 - (i + 1) * 4}
          stroke="#4A9EFF"
          strokeWidth="1.2"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <line
          key={`h${i}`}
          x1={16}
          y1={16 - i * 4}
          x2={16 + (i + 1) * 4}
          y2={16 - i * 4}
          stroke="#4A9EFF"
          strokeWidth="1.2"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <line
          key={`vv${i}`}
          x1={16 + (i + 1) * 4}
          y1={16 - i * 4}
          x2={16 + (i + 1) * 4}
          y2={16 - (i + 1) * 4}
          stroke="#4A9EFF"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

function StairSpiralIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <circle
        cx="18"
        cy="18"
        r="12"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <circle
        cx="18"
        cy="18"
        r="3"
        stroke="#4A9EFF"
        strokeWidth="1"
        fill="none"
      />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={18 + 3 * Math.cos(rad)}
            y1={18 + 3 * Math.sin(rad)}
            x2={18 + 12 * Math.cos(rad)}
            y2={18 + 12 * Math.sin(rad)}
            stroke="#4A9EFF"
            strokeWidth="0.8"
          />
        );
      })}
    </svg>
  );
}

function StairEscalatorIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="4"
        width="28"
        height="28"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <line x1="4" y1="28" x2="32" y2="4" stroke="#4A9EFF" strokeWidth="1.2" />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={4 + i * 7}
          y1={28 - i * 7}
          x2={4 + (i + 1) * 7}
          y2={28 - i * 7}
          stroke="#4A9EFF"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function FixtureSinkIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="6"
        y="8"
        width="24"
        height="20"
        rx="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <ellipse
        cx="18"
        cy="18"
        rx="7"
        ry="5"
        stroke="#4A9EFF"
        strokeWidth="1"
        fill="none"
      />
      <line
        x1="18"
        y1="13"
        x2="18"
        y2="11"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function FixtureToiletIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="10"
        y="6"
        width="16"
        height="8"
        rx="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <ellipse
        cx="18"
        cy="23"
        rx="10"
        ry="9"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <ellipse
        cx="18"
        cy="23"
        rx="6"
        ry="5"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

function FixtureShowerIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="4"
        width="28"
        height="28"
        rx="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <circle
        cx="18"
        cy="18"
        r="5"
        stroke="#4A9EFF"
        strokeWidth="1"
        fill="none"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={18 + 6 * Math.cos(rad)}
            y1={18 + 6 * Math.sin(rad)}
            x2={18 + 9 * Math.cos(rad)}
            y2={18 + 9 * Math.sin(rad)}
            stroke="#4A9EFF"
            strokeWidth="0.8"
          />
        );
      })}
    </svg>
  );
}

function FixtureBathtubIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="8"
        width="28"
        height="20"
        rx="3"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <circle
        cx="9"
        cy="13"
        r="3"
        stroke="#4A9EFF"
        strokeWidth="1"
        fill="none"
      />
      <ellipse
        cx="20"
        cy="19"
        rx="9"
        ry="5"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

function FurnitureDeskIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="10"
        width="28"
        height="16"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <rect
        x="6"
        y="12"
        width="12"
        height="12"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        fill="none"
      />
      <rect
        x="20"
        y="12"
        width="10"
        height="5"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

function FurnitureChairIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="8"
        y="14"
        width="20"
        height="14"
        rx="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <rect
        x="8"
        y="8"
        width="20"
        height="8"
        rx="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <line
        x1="10"
        y1="28"
        x2="10"
        y2="32"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
      <line
        x1="26"
        y1="28"
        x2="26"
        y2="32"
        stroke="#4A9EFF"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function FurnitureBedIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="4"
        y="8"
        width="28"
        height="20"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <rect
        x="4"
        y="8"
        width="28"
        height="7"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        fill="none"
      />
      <ellipse
        cx="12"
        cy="11"
        rx="4"
        ry="2"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        fill="none"
      />
      <ellipse
        cx="24"
        cy="11"
        rx="4"
        ry="2"
        stroke="#4A9EFF"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

function FurnitureSofaIcon() {
  return (
    <svg
      aria-hidden="true"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect
        x="6"
        y="16"
        width="24"
        height="12"
        rx="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <rect
        x="6"
        y="10"
        width="24"
        height="8"
        rx="2"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <rect
        x="4"
        y="16"
        width="4"
        height="12"
        rx="1"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
      <rect
        x="28"
        y="16"
        width="4"
        height="12"
        rx="1"
        stroke="#4A9EFF"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

const CATEGORIES: Category[] = [
  {
    id: "doors",
    label: "Doors",
    symbols: [
      {
        id: "door-single",
        name: "Single Door",
        size: "900mm",
        toolId: "Wall",
        icon: <DoorSingleIcon />,
      },
      {
        id: "door-double",
        name: "Double Door",
        size: "1800mm",
        toolId: "Wall",
        icon: <DoorDoubleIcon />,
      },
      {
        id: "door-sliding",
        name: "Sliding Door",
        size: "1500mm",
        toolId: "Wall",
        icon: <DoorSlidingIcon />,
      },
      {
        id: "door-bifold",
        name: "Bi-fold Door",
        size: "1200mm",
        toolId: "Wall",
        icon: <DoorBifoldIcon />,
      },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    symbols: [
      {
        id: "win-fixed",
        name: "Fixed Window",
        size: "1200mm",
        toolId: "Wall",
        icon: <WindowFixedIcon />,
      },
      {
        id: "win-casement",
        name: "Casement Window",
        size: "900mm",
        toolId: "Wall",
        icon: <WindowCasementIcon />,
      },
      {
        id: "win-bay",
        name: "Bay Window",
        size: "2400mm",
        toolId: "Wall",
        icon: <WindowBayIcon />,
      },
      {
        id: "win-skylight",
        name: "Skylight",
        size: "900×900mm",
        toolId: "Floor",
        icon: <WindowSkylightIcon />,
      },
    ],
  },
  {
    id: "stairs",
    label: "Stairs",
    symbols: [
      {
        id: "stair-straight",
        name: "Straight Run",
        size: "1000mm",
        toolId: "Stair",
        icon: <StairStraightIcon />,
      },
      {
        id: "stair-l",
        name: "L-Shape",
        size: "1200mm",
        toolId: "Stair",
        icon: <StairLIcon />,
      },
      {
        id: "stair-spiral",
        name: "Spiral",
        size: "ø1200mm",
        toolId: "Column",
        icon: <StairSpiralIcon />,
      },
      {
        id: "stair-escalator",
        name: "Escalator",
        size: "1000mm",
        toolId: "Stair",
        icon: <StairEscalatorIcon />,
      },
    ],
  },
  {
    id: "fixtures",
    label: "Fixtures",
    symbols: [
      {
        id: "fix-sink",
        name: "Sink",
        size: "600×500mm",
        toolId: "Column",
        icon: <FixtureSinkIcon />,
      },
      {
        id: "fix-toilet",
        name: "WC",
        size: "360×680mm",
        toolId: "Column",
        icon: <FixtureToiletIcon />,
      },
      {
        id: "fix-shower",
        name: "Shower",
        size: "900×900mm",
        toolId: "Column",
        icon: <FixtureShowerIcon />,
      },
      {
        id: "fix-bathtub",
        name: "Bathtub",
        size: "750×1700mm",
        toolId: "Slab",
        icon: <FixtureBathtubIcon />,
      },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    symbols: [
      {
        id: "furn-desk",
        name: "Desk",
        size: "1600×800mm",
        toolId: "Slab",
        icon: <FurnitureDeskIcon />,
      },
      {
        id: "furn-chair",
        name: "Chair",
        size: "600×600mm",
        toolId: "Column",
        icon: <FurnitureChairIcon />,
      },
      {
        id: "furn-bed",
        name: "Double Bed",
        size: "1500×2000mm",
        toolId: "Slab",
        icon: <FurnitureBedIcon />,
      },
      {
        id: "furn-sofa",
        name: "3-Seat Sofa",
        size: "2000×900mm",
        toolId: "Beam",
        icon: <FurnitureSofaIcon />,
      },
    ],
  },
];

export function SymbolLibraryPanel() {
  const showSymbolLibrary = useStore((s) => s.showSymbolLibrary);
  const togglePanel = useStore((s) => s.togglePanel);
  const setActiveTool = useStore((s) => s.setActiveTool);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  if (!showSymbolLibrary) return null;

  const category = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div
      data-ocid="symbol_library.panel"
      className="flex flex-col h-full"
      style={{
        width: 260,
        background: "#1A1F26",
        borderLeft: "1px solid #3A424D",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid #3A424D" }}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={13} style={{ color: "#2F7DFF" }} />
          <span className="text-xs font-semibold text-foreground">
            Symbol Library
          </span>
        </div>
        <button
          type="button"
          data-ocid="symbol_library.close_button"
          onClick={() => togglePanel("symbolLibrary")}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {/* Category tabs */}
      <div
        className="flex overflow-x-auto flex-shrink-0"
        style={{ borderBottom: "1px solid #3A424D" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            data-ocid={`symbol_library.${cat.id}.tab`}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1.5 text-[10px] font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeCategory === cat.id
                ? "text-blue-400 border-b-2 border-b-blue-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Symbol grid */}
      <ScrollArea className="flex-1">
        <div className="p-2 grid grid-cols-2 gap-1.5">
          {category.symbols.map((sym, i) => (
            <button
              key={sym.id}
              type="button"
              data-ocid={`symbol_library.item.${i + 1}`}
              onClick={() => setActiveTool(sym.toolId)}
              title={`${sym.name} — ${sym.size} — activates ${sym.toolId} tool`}
              className="flex flex-col items-center gap-1.5 p-2 rounded transition-colors hover:bg-white/8 text-left"
              style={{ background: "#1F242B", border: "1px solid #2A3038" }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded"
                style={{ background: "rgba(74,158,255,0.06)" }}
              >
                {sym.icon}
              </div>
              <div className="w-full">
                <div className="text-[10px] font-medium text-foreground truncate">
                  {sym.name}
                </div>
                <div className="text-[9px] text-muted-foreground">
                  {sym.size}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer hint */}
      <div
        className="px-3 py-2 flex-shrink-0"
        style={{ borderTop: "1px solid #3A424D" }}
      >
        <p className="text-[9px] text-muted-foreground">
          Click a symbol to activate its placement tool
        </p>
      </div>
    </div>
  );
}
