import { useTranslation } from "react-i18next";
import type { AgentSummary } from "@/gateway/types";
import { useAgentsStore } from "@/store/console-stores/agents-store";

interface AgentDetailHeaderProps {
  agent: AgentSummary;
}

export function AgentDetailHeader({ agent }: AgentDetailHeaderProps) {
  const { t } = useTranslation("console");
  const defaultAgentId = useAgentsStore((s) => s.defaultAgentId);
  const displayName = agent.identity?.name ?? agent.name ?? agent.id;
  const emoji = agent.identity?.emoji;
  const avatarUrl = agent.identity?.avatarUrl;
  const isDefault = agent.id === defaultAgentId;

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl dark:bg-gray-800">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <span>{emoji ?? displayName.charAt(0).toLowerCase()}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{displayName}</h2>
        </div>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          {t("agents.detailDescription", { id: agent.id })}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{agent.id}</span>
        {isDefault && (
          <span className="rounded-md bg-gray-200 px-2 py-0.5 text-xs font-semibold uppercase text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {t("agents.defaultBadge")}
          </span>
        )}
      </div>
    </div>
  );
}
