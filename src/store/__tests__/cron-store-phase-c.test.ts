import { describe, it, expect, beforeEach } from "vitest";
import { initAdapter } from "@/gateway/adapter-provider";
import { useCronStore } from "../console-stores/cron-store";

describe("Cron Store - Phase C", () => {
  beforeEach(async () => {
    await initAdapter("mock");
    useCronStore.setState({
      tasks: [],
      isLoading: false,
      error: null,
      dialogOpen: false,
      editingTask: null,
    });
  });

  it("fetchTasks() loads tasks with new CronTask structure", async () => {
    await useCronStore.getState().fetchTasks();
    const s = useCronStore.getState();
    expect(s.tasks.length).toBeGreaterThanOrEqual(3);
    for (const task of s.tasks) {
      expect(task.state).toBeDefined();
      expect(task.payload).toBeDefined();
      expect(task.schedule).toBeDefined();
      expect(["main", "isolated"]).toContain(task.sessionTarget);
    }
  });

  it("addTask() creates a new task and closes dialog", async () => {
    useCronStore.setState({ dialogOpen: true });
    await useCronStore.getState().addTask({
      name: "Test Task",
      schedule: { kind: "cron", expr: "0 12 * * *" },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "hello" },
    });
    const s = useCronStore.getState();
    expect(s.tasks.some((t) => t.name === "Test Task")).toBe(true);
    expect(s.dialogOpen).toBe(false);
  });

  it("updateTask() updates an existing task", async () => {
    await useCronStore.getState().fetchTasks();
    const task = useCronStore.getState().tasks[0];
    await useCronStore.getState().updateTask(task.id, { name: "Updated" });
    const updated = useCronStore.getState().tasks.find((t) => t.id === task.id);
    expect(updated).toBeDefined();
  });

  it("removeTask() removes a task", async () => {
    await useCronStore.getState().fetchTasks();
    const before = useCronStore.getState().tasks.length;
    const id = useCronStore.getState().tasks[0].id;
    await useCronStore.getState().removeTask(id);
    expect(useCronStore.getState().tasks.length).toBe(before - 1);
  });

  it("openDialog() and closeDialog() manage dialog state", () => {
    useCronStore.getState().openDialog();
    expect(useCronStore.getState().dialogOpen).toBe(true);
    expect(useCronStore.getState().editingTask).toBeNull();

    useCronStore.getState().closeDialog();
    expect(useCronStore.getState().dialogOpen).toBe(false);
  });

  it("openDialog(task) sets editingTask", async () => {
    await useCronStore.getState().fetchTasks();
    const task = useCronStore.getState().tasks[0];
    useCronStore.getState().openDialog(task);
    expect(useCronStore.getState().editingTask).toBe(task);
  });

  it("handleCronEvent() updates task state", async () => {
    await useCronStore.getState().fetchTasks();
    const task = useCronStore.getState().tasks[0];
    useCronStore.getState().handleCronEvent({
      jobId: task.id,
      state: { lastRunAtMs: Date.now(), lastRunStatus: "ok" },
    });
    const updated = useCronStore.getState().tasks.find((t) => t.id === task.id);
    expect(updated!.state.lastRunStatus).toBe("ok");
  });

  it("initEventListeners() returns an unsubscribe function", () => {
    const unsub = useCronStore.getState().initEventListeners();
    expect(typeof unsub).toBe("function");
    unsub();
  });
});
