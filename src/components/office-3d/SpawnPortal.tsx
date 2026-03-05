import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

interface SpawnPortalProps {
  parentPosition: [number, number, number];
  childPosition: [number, number, number];
  onComplete: () => void;
}

const DURATION = 0.8;
const RING_COLORS = ["#60a5fa", "#818cf8", "#38bdf8"];

/**
 * Spawn effect: 3 concentric rings at parent position that expand and fade,
 * plus a beam line from parent to child. Self-destructs after DURATION.
 */
export function SpawnPortal({ parentPosition, childPosition, onComplete }: SpawnPortalProps) {
  const groupRef = useRef<Group>(null);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);

  useFrame((_, delta) => {
    if (doneRef.current) {
      return;
    }
    elapsedRef.current += delta;
    const t = Math.min(elapsedRef.current / DURATION, 1);

    if (groupRef.current) {
      const scale = 0.2 + t * 1.8;
      groupRef.current.scale.setScalar(scale);
      groupRef.current.children.forEach((child) => {
        if ("material" in child) {
          const mat = child.material as { opacity: number };
          mat.opacity = 1 - t;
        }
      });
    }

    if (t >= 1 && !doneRef.current) {
      doneRef.current = true;
      onComplete();
    }
  });

  const beamOpacity = 0.6;

  return (
    <>
      <group ref={groupRef} position={parentPosition} rotation={[-Math.PI / 2, 0, 0]}>
        {RING_COLORS.map((color, i) => (
          <mesh key={i}>
            <ringGeometry args={[0.2 + i * 0.15, 0.25 + i * 0.15, 32]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              transparent
              opacity={1}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <Line
        points={[parentPosition, childPosition]}
        color="#60a5fa"
        lineWidth={2}
        transparent
        opacity={beamOpacity}
      />
    </>
  );
}
