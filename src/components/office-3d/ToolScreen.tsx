import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

interface ToolScreenProps {
  toolName: string;
}

export function ToolScreen({ toolName }: ToolScreenProps) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.01;
    }
  });

  return (
    <group position={[0, 0, -0.4]}>
      <mesh ref={ref} position={[0, 0.5, 0]}>
        <planeGeometry args={[0.5, 0.35]} />
        <meshStandardMaterial color="#f97316" transparent opacity={0.3} side={2} />
      </mesh>
      <Html position={[0, 0.5, 0.01]} center style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontSize: "8px",
            color: "#f97316",
            whiteSpace: "nowrap",
            textAlign: "center",
            background: "rgba(0,0,0,0.6)",
            padding: "2px 6px",
            borderRadius: "3px",
          }}
        >
          {toolName}
        </div>
      </Html>
    </group>
  );
}
