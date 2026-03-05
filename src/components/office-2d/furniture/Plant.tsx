import { memo } from "react";

interface PlantProps {
  x: number;
  y: number;
}

export const Plant = memo(function Plant({ x, y }: PlantProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Pot */}
      <path d="M -8 6 L -10 18 Q -10 22 -6 22 L 6 22 Q 10 22 10 18 L 8 6 Z" fill="#a07050" />
      {/* Leaves */}
      <ellipse cx={0} cy={-2} rx={12} ry={10} fill="#4ade80" opacity={0.85} />
      <ellipse cx={-6} cy={-8} rx={8} ry={6} fill="#22c55e" opacity={0.7} />
      <ellipse cx={6} cy={-6} rx={7} ry={5} fill="#16a34a" opacity={0.6} />
    </g>
  );
});
