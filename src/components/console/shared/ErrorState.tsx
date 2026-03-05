import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
      <p className="mb-4 text-sm text-red-600 dark:text-red-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          {t("actions.retry")}
        </button>
      )}
    </div>
  );
}
