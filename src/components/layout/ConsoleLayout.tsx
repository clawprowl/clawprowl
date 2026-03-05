import { Home, Bot, Radio, Puzzle, Clock, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TopBar } from "./TopBar";

export function ConsoleLayout() {
  const { t } = useTranslation("layout");
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sidebarNavItems = [
    { path: "/dashboard", labelKey: "consoleNav.dashboard", icon: Home },
    { path: "/agents", labelKey: "consoleNav.agents", icon: Bot },
    { path: "/channels", labelKey: "consoleNav.channels", icon: Radio },
    { path: "/skills", labelKey: "consoleNav.skills", icon: Puzzle },
    { path: "/cron", labelKey: "consoleNav.cron", icon: Clock },
    { path: "/settings", labelKey: "consoleNav.settings", icon: Settings },
  ] as const;

  const navItems = (
    <>
      {sidebarNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setMobileNavOpen(false);
            }}
            className={`mx-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{t(item.labelKey)}</span>
          </button>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen w-screen flex-col overflow-x-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <nav className="hidden sm:flex w-52 shrink-0 flex-col border-r border-gray-200 bg-white py-3 dark:border-gray-700 dark:bg-gray-900">
          {navItems}
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="sm:hidden fixed bottom-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile overlay nav */}
        {mobileNavOpen && (
          <>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setMobileNavOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setMobileNavOpen(false)}
              className="sm:hidden fixed inset-0 z-30 bg-black/40"
              aria-label="Close menu"
            />
            <nav className="sm:hidden fixed inset-y-0 left-0 z-40 flex w-52 flex-col border-r border-gray-200 bg-white py-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {navItems}
            </nav>
          </>
        )}

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
