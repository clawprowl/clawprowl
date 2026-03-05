import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export function ThinkingIndicator() {
  const ref = useRef<Mesh>(null);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.z += dt * 3;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.75, 0]}>
      <torusGeometry args={[0.15, 0.02, 8, 24]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}
