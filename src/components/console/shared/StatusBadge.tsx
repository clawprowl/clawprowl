import { useTranslation } from "react-i18next";

const STATUS_COLORS: Record<string, string> = {
  connected: "bg-green-500",
  active: "bg-green-500",
  ok: "bg-green-500",
  disconnected: "bg-gray-400",
  paused: "bg-gray-400",
  disabled: "bg-gray-400",
  connecting: "bg-yellow-500",
  pending: "bg-yellow-500",
  running: "bg-yellow-500",
  error: "bg-red-500",
  failed: "bg-red-500",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { t } = useTranslation("common");

  const dotColor = STATUS_COLORS[status] ?? "bg-gray-400";
  const label = t(`status.${status}`, { defaultValue: status });

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${dotColor}`} />
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
    </span>
  );
}
