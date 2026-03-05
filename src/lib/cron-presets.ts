import type { CronSchedule } from "@/gateway/adapter-types";

export interface CronPreset {
  labelKey: string;
  schedule: CronSchedule;
}

export const CRON_PRESETS: CronPreset[] = [
  { labelKey: "console:cron.presets.everyHour", schedule: { kind: "cron", expr: "0 * * * *" } },
  { labelKey: "console:cron.presets.daily9am", schedule: { kind: "cron", expr: "0 9 * * *" } },
  { labelKey: "console:cron.presets.daily6pm", schedule: { kind: "cron", expr: "0 18 * * *" } },
  { labelKey: "console:cron.presets.weeklyMon", schedule: { kind: "cron", expr: "0 9 * * 1" } },
  { labelKey: "console:cron.presets.monthlyFirst", schedule: { kind: "cron", expr: "0 9 1 * *" } },
  { labelKey: "console:cron.presets.every30min", schedule: { kind: "every", everyMs: 1_800_000 } },
];

export function cronScheduleToExpr(schedule: CronSchedule): string {
  if (schedule.kind === "cron") return schedule.expr;
  if (schedule.kind === "every") return `every ${Math.round(schedule.everyMs / 60_000)}m`;
  if (schedule.kind === "at") return `at ${schedule.at}`;
  return "";
}
