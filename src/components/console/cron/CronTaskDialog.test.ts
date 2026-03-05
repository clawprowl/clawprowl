import { describe, expect, it } from "vitest";
import { buildCronTaskInput } from "./CronTaskDialog";

describe("buildCronTaskInput", () => {
  it("uses isolated session target for message payloads", () => {
    const input = buildCronTaskInput({
      name: "  temp-check  ",
      description: "  validate real gateway  ",
      schedule: { kind: "cron", expr: "*/30 * * * *" },
      message: "  run validation  ",
    });

    expect(input).toEqual({
      name: "temp-check",
      description: "validate real gateway",
      schedule: { kind: "cron", expr: "*/30 * * * *" },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "run validation" },
    });
  });
});
