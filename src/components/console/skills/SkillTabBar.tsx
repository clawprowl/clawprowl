import { useTranslation } from "react-i18next";
import type { SkillTab } from "@/store/console-stores/skills-store";

interface SkillTabBarProps {
  activeTab: SkillTab;
  onTabChange: (tab: SkillTab) => void;
}

const TABS: SkillTab[] = ["installed", "marketplace"];

export function SkillTabBar({ activeTab, onTabChange }: SkillTabBarProps) {
  const { t } = useTranslation("console");

  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
        >
          {t(`skills.tabs.${tab}`)}
        </button>
      ))}
    </div>
  );
}
