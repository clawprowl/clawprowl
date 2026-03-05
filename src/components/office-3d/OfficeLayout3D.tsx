import { Html } from "@react-three/drei";
import { useTranslation } from "react-i18next";
import * as THREE from "three";

const DESK_HEIGHT = 0.42;

function Workstation({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Desk surface — light wood */}
      <mesh position={[0, DESK_HEIGHT, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.04, 0.55]} />
        <meshStandardMaterial color="#c4a882" roughness={0.65} metalness={0.02} />
      </mesh>
      {/* Desk legs — metal gray */}
      {[
        [-0.5, 0.2, -0.22],
        [0.5, 0.2, -0.22],
        [-0.5, 0.2, 0.22],
        [0.5, 0.2, 0.22],
      ].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial color="#8898a8" roughness={0.5} metalness={0.35} />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, DESK_HEIGHT + 0.02, -0.15]}>
        {/* Monitor stand */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.1, 8]} />
          <meshStandardMaterial color="#6b7a8a" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Monitor pole */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.03, 0.2, 0.03]} />
          <meshStandardMaterial color="#7a8a9a" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Monitor screen frame */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.55, 0.32, 0.02]} />
          <meshStandardMaterial color="#3a4550" roughness={0.3} metalness={0.15} />
        </mesh>
        {/* Screen glow — bright blue */}
        <mesh position={[0, 0.35, 0.015]}>
          <planeGeometry args={[0.48, 0.26]} />
          <meshStandardMaterial
            color="#d0e8ff"
            emissive="#90c0f0"
            emissiveIntensity={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[0, DESK_HEIGHT + 0.025, 0.1]}>
        <boxGeometry args={[0.3, 0.01, 0.1]} />
        <meshStandardMaterial color="#aab0b8" roughness={0.6} metalness={0.15} />
      </mesh>
    </group>
  );
}

function OfficeChair({
  position,
  rotation = 0,
  color = "#4a5568",
}: {
  position: [number, number, number];
  rotation?: number;
  color?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.04, 5]} />
        <meshStandardMaterial color="#7a8a9a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.22, 8]} />
        <meshStandardMaterial color="#8898a8" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.28, 0.04, 0.28]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.5, -0.12]} castShadow>
        <boxGeometry args={[0.26, 0.36, 0.03]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Armrests */}
      <mesh position={[0.15, 0.38, 0]}>
        <boxGeometry args={[0.03, 0.04, 0.2]} />
        <meshStandardMaterial color="#7a8a9a" roughness={0.5} metalness={0.35} />
      </mesh>
      <mesh position={[-0.15, 0.38, 0]}>
        <boxGeometry args={[0.03, 0.04, 0.2]} />
        <meshStandardMaterial color="#7a8a9a" roughness={0.5} metalness={0.35} />
      </mesh>
    </group>
  );
}

function MeetingTable({
  position,
  radius = 1.2,
}: {
  position: [number, number, number];
  radius?: number;
}) {
  return (
    <group position={position}>
      {/* Table surface — slightly tinted */}
      <mesh position={[0, DESK_HEIGHT, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.05, 6]} />
        <meshStandardMaterial color="#8aa8c8" roughness={0.45} metalness={0.08} />
      </mesh>
      {/* Accent rim */}
      <mesh position={[0, DESK_HEIGHT + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius, 6]} />
        <meshStandardMaterial
          color="#5ba0d0"
          emissive="#4090c0"
          emissiveIntensity={0.2}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Center post */}
      <mesh position={[0, DESK_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, DESK_HEIGHT, 8]} />
        <meshStandardMaterial color="#7a8a9a" roughness={0.4} metalness={0.45} />
      </mesh>
      {/* Center disc */}
      <mesh position={[0, DESK_HEIGHT + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial
          color="#b0d0f0"
          emissive="#80b0e0"
          emissiveIntensity={0.15}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function Bookshelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Frame — dark wood */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.8, 1.6, 0.3]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.75} metalness={0.05} />
      </mesh>
      {/* Shelves */}
      {[0.3, 0.7, 1.1].map((y) => (
        <mesh key={`shelf-${y}`} position={[0, y, 0]}>
          <boxGeometry args={[0.76, 0.03, 0.28]} />
          <meshStandardMaterial color="#9a8a7a" roughness={0.6} />
        </mesh>
      ))}
      {/* Books */}
      {[
        { x: -0.2, y: 0.5, color: "#4a80c0" },
        { x: 0, y: 0.5, color: "#40a060" },
        { x: 0.15, y: 0.5, color: "#e08040" },
        { x: -0.15, y: 0.9, color: "#8060b0" },
        { x: 0.1, y: 0.9, color: "#d04040" },
      ].map((b, i) => (
        <mesh key={`book-${i}`} position={[b.x, b.y, 0]}>
          <boxGeometry args={[0.08, 0.16, 0.2]} />
          <meshStandardMaterial color={b.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Sofa({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Frame */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.2, 0.25, 0.5]} />
        <meshStandardMaterial color="#6a8aaa" roughness={0.8} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.38, -0.2]}>
        <boxGeometry args={[1.2, 0.2, 0.12]} />
        <meshStandardMaterial color="#6a8aaa" roughness={0.8} />
      </mesh>
      {/* Armrests */}
      <mesh position={[0.58, 0.3, 0]}>
        <boxGeometry args={[0.08, 0.15, 0.5]} />
        <meshStandardMaterial color="#6a8aaa" roughness={0.8} />
      </mesh>
      <mesh position={[-0.58, 0.3, 0]}>
        <boxGeometry args={[0.08, 0.15, 0.5]} />
        <meshStandardMaterial color="#6a8aaa" roughness={0.8} />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.25, 0.3, 0.02]}>
        <boxGeometry args={[0.45, 0.06, 0.4]} />
        <meshStandardMaterial color="#90b8d8" roughness={0.9} />
      </mesh>
      <mesh position={[0.25, 0.3, 0.02]}>
        <boxGeometry args={[0.45, 0.06, 0.4]} />
        <meshStandardMaterial color="#90b8d8" roughness={0.9} />
      </mesh>
    </group>
  );
}

function CoffeeTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.04, 0.4]} />
        <meshStandardMaterial color="#b0a090" roughness={0.55} metalness={0.05} />
      </mesh>
      {[
        [-0.25, 0.1, -0.15],
        [0.25, 0.1, -0.15],
        [-0.25, 0.1, 0.15],
        [0.25, 0.1, 0.15],
      ].map((pos, i) => (
        <mesh key={`ct-leg-${i}`} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
          <meshStandardMaterial color="#8898a8" metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function ZoneLabel({
  position,
  label,
  color,
}: {
  position: [number, number, number];
  label: string;
  color: string;
}) {
  return (
    <Html position={position} center style={{ pointerEvents: "none" }}>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color,
          opacity: 0.85,
          textTransform: "uppercase",
          letterSpacing: "2px",
          whiteSpace: "nowrap",
          userSelect: "none",
          textShadow: "0 1px 3px rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </div>
    </Html>
  );
}

function ZoneFloor({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} transparent opacity={0.15} roughness={0.85} />
    </mesh>
  );
}

/** Logo backdrop wall in the lounge zone */
function ReceptionWall3D() {
  return (
    <group position={[12, 0, 10]}>
      {/* Main wall panel */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[3, 2, 0.08]} />
        <meshStandardMaterial color="#3b4f6b" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Top accent strip */}
      <mesh position={[0, 2.02, 0]}>
        <boxGeometry args={[3, 0.04, 0.1]} />
        <meshStandardMaterial color="#7a9bc0" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Logo text placeholder — emissive panel */}
      <mesh position={[0, 1.2, 0.05]}>
        <planeGeometry args={[1.8, 0.3]} />
        <meshStandardMaterial
          color="#e0e8f0"
          emissive="#90b0d0"
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

/** Curved reception desk in front of the logo wall */
function ReceptionDesk3D() {
  return (
    <group position={[12, 0, 10.8]}>
      {/* Desk body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.8, 0.5]} />
        <meshStandardMaterial color="#8494a7" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Desk top surface */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[2.5, 0.04, 0.55]} />
        <meshStandardMaterial color="#a5b4c8" roughness={0.5} metalness={0.08} />
      </mesh>
      {/* Front decorative panel */}
      <mesh position={[0, 0.4, 0.26]}>
        <boxGeometry args={[2.3, 0.7, 0.02]} />
        <meshStandardMaterial color="#6a7a8a" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function OfficeLayout3D() {
  const { t } = useTranslation("office");
  return (
    <group>
      {/* === Zone Floor Colors === */}
      <ZoneFloor position={[3.5, 0.015, 2.8]} size={[6.5, 5]} color="#4a90d9" />
      <ZoneFloor position={[12, 0.015, 2.8]} size={[6.5, 5]} color="#9060c0" />
      <ZoneFloor position={[3.5, 0.015, 9]} size={[6.5, 5]} color="#d08030" />
      <ZoneFloor position={[12, 0.015, 9]} size={[6.5, 5]} color="#40a060" />

      {/* === Zone Labels === */}
      <ZoneLabel position={[1.5, 0.05, 0.8]} label={t("zones.desk")} color="#2563eb" />
      <ZoneLabel position={[9.5, 0.05, 0.8]} label={t("zones.meeting")} color="#7c3aed" />
      <ZoneLabel position={[1.5, 0.05, 6.8]} label={t("zones.hotDesk")} color="#c2410c" />
      <ZoneLabel position={[9.5, 0.05, 6.8]} label={t("zones.lounge")} color="#15803d" />

      {/* === Desk Zone — 2 rows × 3 columns === */}
      {[
        { pos: [1.8, 0, 1.8] as [number, number, number], rot: 0 },
        { pos: [3.5, 0, 1.8] as [number, number, number], rot: 0 },
        { pos: [5.2, 0, 1.8] as [number, number, number], rot: 0 },
        { pos: [1.8, 0, 3.5] as [number, number, number], rot: Math.PI },
        { pos: [3.5, 0, 3.5] as [number, number, number], rot: Math.PI },
        { pos: [5.2, 0, 3.5] as [number, number, number], rot: Math.PI },
      ].map((ws, i) => (
        <group key={`desk-ws-${i}`}>
          <Workstation position={ws.pos} rotation={ws.rot} />
          <OfficeChair
            position={[ws.pos[0], 0, ws.pos[2] + (ws.rot === 0 ? 0.45 : -0.45)]}
            rotation={ws.rot}
            color={i % 2 === 0 ? "#4a5568" : "#3a5068"}
          />
        </group>
      ))}

      {/* === Meeting Zone — hexagonal table + chairs === */}
      <MeetingTable position={[12, 0, 2.8]} />
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const r = 1.7;
        return (
          <OfficeChair
            key={`meeting-chair-${i}`}
            position={[12 + Math.cos(angle) * r, 0, 2.8 + Math.sin(angle) * r]}
            rotation={angle + Math.PI}
            color="#3a6080"
          />
        );
      })}

      {/* === Hot Desk Zone — 2 rows × 3 columns === */}
      {[
        { pos: [1.8, 0, 7.8] as [number, number, number], rot: 0 },
        { pos: [3.5, 0, 7.8] as [number, number, number], rot: 0 },
        { pos: [5.2, 0, 7.8] as [number, number, number], rot: 0 },
        { pos: [1.8, 0, 9.8] as [number, number, number], rot: Math.PI },
        { pos: [3.5, 0, 9.8] as [number, number, number], rot: Math.PI },
        { pos: [5.2, 0, 9.8] as [number, number, number], rot: Math.PI },
      ].map((ws, i) => (
        <group key={`hotdesk-ws-${i}`}>
          <Workstation position={ws.pos} rotation={ws.rot} />
          <OfficeChair
            position={[ws.pos[0], 0, ws.pos[2] + (ws.rot === 0 ? 0.45 : -0.45)]}
            rotation={ws.rot}
            color="#6a5a4a"
          />
        </group>
      ))}

      {/* === Lounge Zone — upper half: sofas === */}
      <Sofa position={[10.5, 0, 7.8]} rotation={0} />
      <Sofa position={[13, 0, 7.8]} rotation={0} />
      <Sofa position={[10.5, 0, 8.8]} rotation={Math.PI} />
      <CoffeeTable position={[11.8, 0, 8.3]} />
      <Sofa position={[14.5, 0, 8.5]} rotation={Math.PI / 2} />

      {/* === Logo backdrop wall === */}
      <ReceptionWall3D />
      <Bookshelf position={[10, 0, 10]} />
      <Bookshelf position={[14, 0, 10]} />

      {/* === Reception desk (curved) === */}
      <ReceptionDesk3D />

      {/* === Plants === */}
      {[
        [0.5, 0, 0.5],
        [0.5, 0, 11.5],
        [7.5, 0, 0.5],
        [7.5, 0, 11.5],
        [10, 0, 10],
        [14, 0, 10],
        [10, 0, 11.5],
        [14, 0, 11.5],
      ].map((pos, i) => (
        <group key={`plant-${i}`} position={pos as [number, number, number]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.12, 0.15, 0.3, 8]} />
            <meshStandardMaterial color="#9a8a7a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.2, 8, 6]} />
            <meshStandardMaterial color="#4a8a4a" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
