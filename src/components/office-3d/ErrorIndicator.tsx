import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export function ErrorIndicator() {
  const ref = useRef<Mesh>(null);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 1.5;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.8, 0]}>
      <octahedronGeometry args={[0.1]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
    </mesh>
  );
}
