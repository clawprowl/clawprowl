import { describe, it, expect, beforeEach } from "vitest";
import { initAdapter } from "@/gateway/adapter-provider";
import {
  filterInstalledSkills,
  filterMarketplaceSkills,
  useSkillsStore,
} from "../console-stores/skills-store";

describe("Skills Store - Phase C", () => {
  beforeEach(async () => {
    await initAdapter("mock");
    useSkillsStore.setState({
      skills: [],
      isLoading: false,
      error: null,
      activeTab: "installed",
      sourceFilter: "all",
      selectedSkill: null,
      detailDialogOpen: false,
      installing: new Set(),
    });
  });

  it("fetchSkills() loads skills with extended fields", async () => {
    await useSkillsStore.getState().fetchSkills();
    const s = useSkillsStore.getState();
    expect(s.skills.length).toBeGreaterThanOrEqual(6);
    expect(s.skills.some((sk) => sk.isCore)).toBe(true);
    expect(s.skills.some((sk) => sk.source === "marketplace")).toBe(true);
    const coreSkills = s.skills.filter((sk) => sk.isCore);
    for (const sk of coreSkills) {
      expect(sk.always).toBe(true);
    }
  });

  it("setTab() updates activeTab", () => {
    useSkillsStore.getState().setTab("marketplace");
    expect(useSkillsStore.getState().activeTab).toBe("marketplace");
    useSkillsStore.getState().setTab("installed");
    expect(useSkillsStore.getState().activeTab).toBe("installed");
  });

  it("setSourceFilter() updates sourceFilter", () => {
    useSkillsStore.getState().setSourceFilter("built-in");
    expect(useSkillsStore.getState().sourceFilter).toBe("built-in");
  });

  it("openDetail() and closeDetail() manage dialog state", async () => {
    await useSkillsStore.getState().fetchSkills();
    const skill = useSkillsStore.getState().skills[0];
    useSkillsStore.getState().openDetail(skill);
    expect(useSkillsStore.getState().detailDialogOpen).toBe(true);
    expect(useSkillsStore.getState().selectedSkill).toBe(skill);

    useSkillsStore.getState().closeDetail();
    expect(useSkillsStore.getState().detailDialogOpen).toBe(false);
    expect(useSkillsStore.getState().selectedSkill).toBeNull();
  });

  it("toggleSkill() updates enabled state", async () => {
    await useSkillsStore.getState().fetchSkills();
    const skill = useSkillsStore.getState().skills.find((s) => s.enabled);
    expect(skill).toBeDefined();

    await useSkillsStore.getState().toggleSkill(skill!.id, false);
    const updated = useSkillsStore.getState().skills.find((s) => s.id === skill!.id);
    expect(updated!.enabled).toBe(false);
  });

  it("installSkill() returns ok and clears installing set", async () => {
    const result = await useSkillsStore.getState().installSkill("test-skill", "npm");
    expect(result.ok).toBe(true);
    expect(useSkillsStore.getState().installing.has("test-skill")).toBe(false);
  });

  it("filterInstalledSkills() sorts enabled core skills first", async () => {
    await useSkillsStore.getState().fetchSkills();
    const filtered = filterInstalledSkills(useSkillsStore.getState().skills, "", "all");
    expect(filtered[0]?.isCore).toBe(true);
    expect(filtered[0]?.enabled).toBe(true);
  });

  it("filterMarketplaceSkills() filters by local query", async () => {
    await useSkillsStore.getState().fetchSkills();
    const filtered = filterMarketplaceSkills(useSkillsStore.getState().skills, "play");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("playwright");
  });
});
