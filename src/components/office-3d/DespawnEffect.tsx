import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

type DespawnType = "complete" | "error" | "killed";

interface DespawnEffectProps {
  position: [number, number, number];
  type: DespawnType;
  onComplete: () => void;
}

const COLORS: Record<DespawnType, string> = {
  complete: "#22c55e",
  error: "#ef4444",
  killed: "#6b7280",
};

const DURATIONS: Record<DespawnType, number> = {
  complete: 0.8,
  error: 0.8,
  killed: 0.4,
};

export function DespawnEffect({ position, type, onComplete }: DespawnEffectProps) {
  const groupRef = useRef<Group>(null);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);
  const color = COLORS[type];
  const duration = DURATIONS[type];

  useFrame((_, delta) => {
    if (doneRef.current || !groupRef.current) {
      return;
    }
    elapsedRef.current += delta;
    const t = Math.min(elapsedRef.current / duration, 1);

    if (type === "complete") {
      const scale = 1 - t * 0.8;
      groupRef.current.scale.setScalar(Math.max(scale, 0.01));
      groupRef.current.position.y = position[1] + t * 1.5;
      groupRef.current.children.forEach((child) => {
        if ("material" in child) {
          (child.material as { opacity: number }).opacity = 1 - t;
        }
      });
    } else if (type === "error") {
      // Flash 3 times then fade
      const flashPhase = t * 3;
      const flash = Math.sin(flashPhase * Math.PI * 2) > 0 ? 1 : 0.3;
      const fadeStart = 0.7;
      const opacity = t > fadeStart ? (1 - (t - fadeStart) / (1 - fadeStart)) * flash : flash;
      groupRef.current.children.forEach((child) => {
        if ("material" in child) {
          (child.material as { opacity: number }).opacity = opacity;
        }
      });
    } else {
      // killed: quick shrink
      const scale = 1 - t;
      groupRef.current.scale.setScalar(Math.max(scale, 0.01));
    }

    if (t >= 1 && !doneRef.current) {
      doneRef.current = true;
      onComplete();
    }
  });

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      <mesh>
        <capsuleGeometry args={[0.15, 0.4, 8, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
