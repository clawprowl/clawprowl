import { memo } from "react";

interface MeetingTableProps {
  x: number;
  y: number;
  radius?: number;
  isDark?: boolean;
}

export const MeetingTable = memo(function MeetingTable({
  x,
  y,
  radius = 80,
  isDark = false,
}: MeetingTableProps) {
  const gradId = `mt-grad-${x}-${y}`;
  const surface = isDark ? "#334155" : "#bfcbda";
  const surfaceCenter = isDark ? "#3d4f66" : "#dbe4ef";

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <radialGradient id={gradId}>
          <stop offset="0%" stopColor={surfaceCenter} />
          <stop offset="100%" stopColor={surface} />
        </radialGradient>
      </defs>
      <circle
        r={radius}
        fill={`url(#${gradId})`}
        stroke={isDark ? "#475569" : "#94a3b8"}
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.10))" }}
      />
    </g>
  );
});
