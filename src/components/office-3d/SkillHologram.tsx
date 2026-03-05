import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import type { Group } from "three";

const TOOL_ICONS: Record<string, string> = {
  search: "🔍",
  web: "🌐",
  file: "📄",
  code: "💻",
  terminal: "⌨️",
  database: "🗄️",
  api: "🔗",
  image: "🖼️",
  email: "📧",
  calculator: "🔢",
};

function getToolIcon(toolName: string): string {
  const lower = toolName.toLowerCase();
  for (const [key, icon] of Object.entries(TOOL_ICONS)) {
    if (lower.includes(key)) {
      return icon;
    }
  }
  return "⚙️";
}

interface SkillHologramProps {
  tool: { name: string };
  position: [number, number, number];
}

export function SkillHologram({ tool, position }: SkillHologramProps) {
  const groupRef = useRef<Group>(null);
  const [phase, setPhase] = useState<"enter" | "visible">("enter");
  const elapsed = useRef(0);

  useEffect(() => {
    elapsed.current = 0;
    setPhase("enter");
  }, [tool.name]);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    elapsed.current += delta;

    if (phase === "enter") {
      const progress = Math.min(elapsed.current / 0.3, 1);
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const scale = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
      groupRef.current.scale.setScalar(Math.max(0, scale));
      if (progress >= 1) {
        setPhase("visible");
      }
    }

    // Billboard: face camera
    const camera = groupRef.current.parent?.parent;
    if (camera) {
      groupRef.current.lookAt(
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z + 1,
      );
    }
  });

  return (
    <group ref={groupRef} position={position} scale={0}>
      <mesh>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          side={2}
        />
      </mesh>
      <Html center transform={false} style={{ pointerEvents: "none" }}>
        <div className="pointer-events-none flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 rounded bg-blue-900/70 px-2 py-1 text-[10px] text-blue-200 shadow-lg backdrop-blur">
            <span>{getToolIcon(tool.name)}</span>
            <span className="max-w-[100px] truncate font-medium">{tool.name}</span>
          </div>
          <div className="h-0.5 w-16 overflow-hidden rounded-full bg-blue-900/50">
            <div
              className="h-full w-full rounded-full bg-blue-400"
              style={{
                animation: "hologram-progress 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
        <style>{`
          @keyframes hologram-progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </Html>
    </group>
  );
}
