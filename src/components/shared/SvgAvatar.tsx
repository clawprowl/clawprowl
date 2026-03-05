import type { FaceShape, HairStyle, EyeStyle } from "@/lib/avatar-generator";
import { generateSvgAvatar } from "@/lib/avatar-generator";

interface SvgAvatarProps {
  agentId: string;
  size?: number;
  className?: string;
}

function FacePath({ shape, color }: { shape: FaceShape; color: string }) {
  switch (shape) {
    case "round":
      return <circle cx="24" cy="20" r="12" fill={color} />;
    case "square":
      return <rect x="12" y="8" width="24" height="24" rx="4" fill={color} />;
    case "oval":
      return <ellipse cx="24" cy="20" rx="11" ry="14" fill={color} />;
  }
}

function HairPath({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case "short":
      return (
        <path d="M12 16 Q12 6 24 6 Q36 6 36 16 L36 12 Q36 4 24 4 Q12 4 12 12 Z" fill={color} />
      );
    case "spiky":
      return (
        <path
          d="M14 14 L16 4 L20 12 L24 2 L28 12 L32 4 L34 14 Q34 6 24 6 Q14 6 14 14 Z"
          fill={color}
        />
      );
    case "side-part":
      return (
        <path d="M12 16 Q12 5 24 5 Q36 5 36 16 L36 11 Q36 3 24 3 Q14 3 10 10 Z" fill={color} />
      );
    case "curly":
      return (
        <path
          d="M12 18 Q10 8 16 5 Q20 2 24 4 Q28 2 32 5 Q38 8 36 18 L36 12 Q36 4 24 4 Q12 4 12 12 Z"
          fill={color}
        />
      );
    case "buzz":
      return (
        <path d="M13 15 Q13 6 24 6 Q35 6 35 15 L35 13 Q35 5 24 5 Q13 5 13 13 Z" fill={color} />
      );
  }
}

function Eyes({ style }: { style: EyeStyle }) {
  switch (style) {
    case "dot":
      return (
        <>
          <circle cx="19" cy="19" r="1.5" fill="#333" />
          <circle cx="29" cy="19" r="1.5" fill="#333" />
        </>
      );
    case "line":
      return (
        <>
          <line
            x1="17"
            y1="19"
            x2="21"
            y2="19"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="27"
            y1="19"
            x2="31"
            y2="19"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      );
    case "wide":
      return (
        <>
          <ellipse cx="19" cy="19" rx="2.5" ry="2" fill="white" />
          <circle cx="19" cy="19" r="1.2" fill="#333" />
          <ellipse cx="29" cy="19" rx="2.5" ry="2" fill="white" />
          <circle cx="29" cy="19" r="1.2" fill="#333" />
        </>
      );
  }
}

export function SvgAvatar({ agentId, size = 40, className }: SvgAvatarProps) {
  const avatar = generateSvgAvatar(agentId);

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: "50%", overflow: "hidden" }}
    >
      <rect width="48" height="48" fill={avatar.shirtColor} rx="24" />
      {/* Body/shirt */}
      <path d="M8 42 Q8 34 24 34 Q40 34 40 42 L40 48 L8 48 Z" fill={avatar.shirtColor} />
      {/* Face */}
      <FacePath shape={avatar.faceShape} color={avatar.skinColor} />
      {/* Hair */}
      <HairPath style={avatar.hairStyle} color={avatar.hairColor} />
      {/* Eyes */}
      <Eyes style={avatar.eyeStyle} />
      {/* Mouth */}
      <path
        d="M21 24 Q24 26 27 24"
        stroke="#333"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
