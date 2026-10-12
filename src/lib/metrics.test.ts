import { describe, expect, it } from "vitest";
import { getOverview } from "./metrics";
import { questions, students } from "../data/demo";
describe("Overview metrics", () => {
  it("adds country totals without double-counting parents", () => {
    const all = getOverview("all", "2026-09-14", "2026-10-11");
    const bd = getOverview("BD", "2026-09-14", "2026-10-11");
    const pk = getOverview("PK", "2026-09-14", "2026-10-11");
    expect(all.completed).toBe(bd.completed + pk.completed);
    expect(all.activated).toBe(bd.activated + pk.activated);
    expect(all.parents).toBe(16);
    expect(all.subscriptions).toBe(32);
    expect(all.partners).toBe(2);
  });
  it("uses an inclusive seven-day active window independent of range start", () => {
    const a = getOverview("all", "2026-09-01", "2026-10-11");
    const b = getOverview("all", "2026-10-11", "2026-10-11");
    expect(a.weekly).toBe(b.weekly);
    expect(a.weekly).toBe(
      new Set(
        questions
          .filter((q) => q.date >= "2026-10-05" && q.date <= "2026-10-11")
          .map((q) => q.studentId),
      ).size,
    );
    expect(b.completed).toBe(
      questions.filter((q) => q.date === "2026-10-11").length,
    );
  });
  it("distinguishes missing coverage, invalid dates and observed zero activity", () => {
    expect(getOverview("all", "2026-10-12", "2026-10-13").covered).toBe(false);
    expect(getOverview("all", "2026-10-11", "2026-10-01").valid).toBe(false);
    expect(getOverview("all", "", "").valid).toBe(false);
    const early = getOverview("PK", "2026-09-01", "2026-09-01");
    expect(early.covered).toBe(true);
    expect(early.parents).toBe(0);
    expect(early.partners).toBe(0);
    expect(early.weekCovered).toBe(false);
  });
  it("counts activation on the first completed question date", () => {
    for (const student of students)
      expect(questions.find((q) => q.studentId === student.id)?.date).toBe(
        student.activatedAt,
      );
  });
  it("keeps targets and reach out of usage", () => {
    const d = getOverview("all", "2026-09-14", "2026-10-11");
    expect(d.activated).toBe(180);
    expect(d.pilots.reduce((n, p) => n + p.activated, 0)).toBe(180);
    expect(d.pilots.reduce((n, p) => n + p.target, 0)).toBe(350);
    expect(d.pilots.reduce((n, p) => n + p.reach, 0)).toBe(2100);
  });
});
