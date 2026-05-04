import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  {
    title: "Welcome to FrameWorks",
    description:
      "FrameWorks is your all-in-one browser-based CAD/BIM platform. Model buildings, run simulations, and export documentation \u2014 all in one place.",
    illustration: (
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fill="none"
        aria-label="FrameWorks interface overview"
      >
        <title>FrameWorks interface overview</title>
        <rect
          x="20"
          y="20"
          width="160"
          height="80"
          rx="4"
          fill="#1F242B"
          stroke="#3A424D"
        />
        <rect x="30" y="30" width="40" height="60" fill="#2A313A" />
        <rect x="80" y="30" width="90" height="60" fill="#252B33" />
        <rect
          x="85"
          y="35"
          width="80"
          height="50"
          fill="#2F7DFF"
          opacity="0.15"
        />
        <rect
          x="35"
          y="35"
          width="30"
          height="12"
          rx="2"
          fill="#2F7DFF"
          opacity="0.6"
        />
        <rect x="35" y="52" width="30" height="8" rx="2" fill="#3A424D" />
        <rect x="35" y="64" width="30" height="8" rx="2" fill="#3A424D" />
        <rect x="35" y="76" width="30" height="8" rx="2" fill="#3A424D" />
      </svg>
    ),
  },
  {
    title: "The 3D Viewport",
    description:
      "The central canvas shows your building in real time. Orbit by clicking and dragging, zoom with the scroll wheel, and pan by right-clicking.",
    illustration: (
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fill="none"
        aria-label="3D viewport navigation"
      >
        <title>3D viewport navigation</title>
        <rect x="20" y="10" width="160" height="100" rx="4" fill="#1a2028" />
        <polygon
          points="100,30 140,70 60,70"
          fill="none"
          stroke="#2F7DFF"
          strokeWidth="1.5"
        />
        <polygon
          points="100,30 140,70 100,90 60,70"
          fill="none"
          stroke="#2F7DFF"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle cx="100" cy="60" r="3" fill="#2F7DFF" />
        <path
          d="M 30 20 Q 40 15 50 20"
          stroke="#A8B1BC"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="30" cy="20" r="2" fill="#A8B1BC" />
      </svg>
    ),
  },
  {
    title: "Tool Palette",
    description:
      "The left sidebar has all modeling tools organized by discipline: Architecture, Structure, MEP, Parts, and Annotation.",
    illustration: (
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fill="none"
        aria-label="Tool palette"
      >
        <title>Tool palette</title>
        <rect
          x="20"
          y="10"
          width="50"
          height="100"
          rx="4"
          fill="#1F242B"
          stroke="#3A424D"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x="26"
            y={18 + i * 16}
            width="38"
            height="12"
            rx="2"
            fill={i === 1 ? "#2F7DFF" : "#2A313A"}
          />
        ))}
        <rect
          x="90"
          y="10"
          width="90"
          height="100"
          rx="4"
          fill="#252B33"
          stroke="#3A424D"
        />
        <text
          x="100"
          y="65"
          fill="#A8B1BC"
          fontSize="10"
          fontFamily="sans-serif"
        >
          3D Canvas
        </text>
      </svg>
    ),
  },
  {
    title: "Properties Panel",
    description:
      "Click any element in the viewport to select it. Its properties appear on the right: dimensions, materials, spec notes, and more \u2014 all editable in real time.",
    illustration: (
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fill="none"
        aria-label="Properties panel"
      >
        <title>Properties panel</title>
        <rect x="20" y="10" width="100" height="100" rx="4" fill="#1a2028" />
        <rect
          x="40"
          y="40"
          width="60"
          height="40"
          fill="#2F7DFF"
          opacity="0.4"
          stroke="#2F7DFF"
          strokeWidth="1.5"
        />
        <rect
          x="130"
          y="10"
          width="50"
          height="100"
          rx="4"
          fill="#1F242B"
          stroke="#3A424D"
        />
        <rect x="135" y="15" width="40" height="6" rx="1" fill="#3A424D" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="135"
            y={25 + i * 14}
            width={20 + (i % 3) * 8}
            height="6"
            rx="1"
            fill="#2A313A"
          />
        ))}
      </svg>
    ),
  },
  {
    title: "Levels & Layers",
    description:
      "Use the bottom bar to switch between building levels. The Layers panel controls visibility and locking of Architecture, Structure, MEP, and Parts layers.",
    illustration: (
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fill="none"
        aria-label="Levels and layers"
      >
        <title>Levels and layers</title>
        <rect x="20" y="10" width="160" height="80" rx="4" fill="#1a2028" />
        <rect
          x="20"
          y="98"
          width="160"
          height="15"
          rx="2"
          fill="#1F242B"
          stroke="#3A424D"
        />
        {["B1", "L1", "L2", "L3", "Roof"].map((l, i) => (
          <rect
            key={l}
            x={26 + i * 30}
            y="101"
            width="24"
            height="9"
            rx="2"
            fill={i === 1 ? "#2F7DFF" : "#2A313A"}
          />
        ))}
        <rect
          x="30"
          y="20"
          width="60"
          height="60"
          fill="#252B33"
          stroke="#3A424D"
        />
        {["Arch", "Struct", "MEP", "Parts"].map((l, i) => (
          <g key={l}>
            <circle
              cx="38"
              cy={28 + i * 14}
              r="3"
              fill={["#4A9EFF", "#FF6B35", "#4CAF50", "#9C27B0"][i]}
            />
            <rect
              x="44"
              y={25 + i * 14}
              width="30"
              height="6"
              rx="1"
              fill="#2A313A"
            />
          </g>
        ))}
      </svg>
    ),
  },
];

export function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("fw_onboarded");
    if (!done) setVisible(true);
  }, []);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("fw_restart_tour" as any, handler);
    return () => window.removeEventListener("fw_restart_tour" as any, handler);
  }, []);

  const finish = () => {
    localStorage.setItem("fw_onboarded", "1");
    setVisible(false);
    setStep(0);
  };

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <div
      data-ocid="onboarding.modal"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "#1F242B", border: "1px solid #3A424D" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>
          <button
            type="button"
            data-ocid="onboarding.close_button"
            onClick={finish}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
        <div className="p-5">
          <div className="flex justify-center mb-4">{current.illustration}</div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            {current.title}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {current.description}
          </p>
        </div>
        <div className="flex items-center justify-between px-5 pb-5">
          <button
            type="button"
            data-ocid="onboarding.skip_button"
            onClick={finish}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className="w-1.5 h-1.5 rounded-full transition-colors"
                  style={{ background: i === step ? "#2F7DFF" : "#3A424D" }}
                />
              ))}
            </div>
            <Button
              data-ocid="onboarding.next_button"
              size="sm"
              onClick={() => {
                if (step < STEPS.length - 1) setStep(step + 1);
                else finish();
              }}
              className="h-7 text-xs"
            >
              {step < STEPS.length - 1 ? "Next" : "Start Building"}
              {step < STEPS.length - 1 && (
                <ChevronRight size={12} className="ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
