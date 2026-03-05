import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import type { VisualAgent } from "@/gateway/types";
import { SVG_WIDTH, SVG_HEIGHT } from "@/lib/constants";

interface SpeechBubbleOverlayProps {
  agent: VisualAgent;
}

export function SpeechBubbleOverlay({ agent }: SpeechBubbleOverlayProps) {
  const [visible, setVisible] = useState(true);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (agent.status !== "speaking") {
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
    setVisible(true);
  }, [agent.status]);

  if (!agent.speechBubble || !visible) {
    return null;
  }

  const leftPct = (agent.position.x / SVG_WIDTH) * 100;
  const topPct = (agent.position.y / SVG_HEIGHT) * 100;

  const nearLeft = leftPct < 25;
  const nearRight = leftPct > 75;

  let translateX = "-50%";
  let arrowAlign: "center" | "left" | "right" = "center";
  if (nearLeft) {
    translateX = "-10%";
    arrowAlign = "left";
  } else if (nearRight) {
    translateX = "-90%";
    arrowAlign = "right";
  }

  return (
    <div
      ref={bubbleRef}
      className="pointer-events-none absolute"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: `translate(${translateX}, -100%) translateY(-52px)`,
        opacity: agent.status === "speaking" ? 1 : 0,
        transition: "opacity 500ms ease",
        zIndex: 20,
      }}
    >
      <div className="pointer-events-auto max-h-[200px] w-[260px] max-w-[320px] overflow-y-auto rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed text-gray-800 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
        <Markdown>{agent.speechBubble.text}</Markdown>
      </div>
      <div
        className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700"
        style={{
          marginLeft: arrowAlign === "left" ? "16px" : arrowAlign === "right" ? "auto" : "auto",
          marginRight:
            arrowAlign === "right" ? "16px" : arrowAlign === "center" ? "auto" : undefined,
          ...(arrowAlign === "center" ? { margin: "0 auto" } : {}),
        }}
      />
    </div>
  );
}
