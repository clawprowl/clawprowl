import { useTranslation } from "react-i18next";
import { useConsoleSettingsStore } from "@/store/console-stores/settings-store";

export function AdvancedSection() {
  const { t } = useTranslation("console");
  const devMode = useConsoleSettingsStore((s) => s.devModeUnlocked);
  const setDevMode = useConsoleSettingsStore((s) => s.setDevModeUnlocked);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        {t("settings.advanced.title")}
      </h3>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t("settings.advanced.devMode")}
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("settings.advanced.devModeHint")}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={devMode}
          onClick={() => setDevMode(!devMode)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            devMode ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              devMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
