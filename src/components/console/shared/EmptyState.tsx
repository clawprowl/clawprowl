import type { LucideIcon } from "lucide-react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
      <h3 className="mb-1 text-base font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
