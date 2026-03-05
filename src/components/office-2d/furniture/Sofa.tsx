import { memo } from "react";

interface SofaProps {
  x: number;
  y: number;
  rotation?: number;
  isDark?: boolean;
}

export const Sofa = memo(function Sofa({ x, y, rotation = 0, isDark = false }: SofaProps) {
  const cushion = isDark ? "#475569" : "#a5b4c8";
  const frame = isDark ? "#334155" : "#8494a7";
  const pillow = isDark ? "#5b6b80" : "#c8d5e3";

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      {/* Sofa frame */}
      <rect x={-55} y={-22} width={110} height={44} rx={10} fill={frame} />
      {/* Seat cushion */}
      <rect x={-48} y={-16} width={96} height={32} rx={6} fill={cushion} />
      {/* Pillows */}
      <circle cx={-30} cy={0} r={8} fill={pillow} opacity={0.7} />
      <circle cx={30} cy={0} r={8} fill={pillow} opacity={0.7} />
      {/* Back rest */}
      <rect x={-52} y={-25} width={104} height={8} rx={4} fill={frame} opacity={0.7} />
    </g>
  );
});
