import { describe, expect, it } from "vitest";
import { getPartners, pilotUsage, pilotStatus } from "./partners";
import { partners, pilotRecords } from "../data/partners";
import { getOverview } from "./metrics";
describe("Partners and pilots", () => {
  it("counts organizations separately from multiple pilots and excludes prospects", () => {
    const data = getPartners("all", "all", "", "2026-10-11");
    expect(data.signed).toBe(2);
    expect(data.active).toBe(2);
    expect(data.prospective).toBe(2);
    expect(data.pilots).toHaveLength(3);
    const prospects = getPartners("all", "prospective", "", "2026-10-11");
    expect(prospects.pilots).toHaveLength(0);
    expect(prospects.signed).toBe(0);
    expect(prospects.active).toBe(0);
  });
  it("combines country, stage, date and trimmed case-insensitive search", () => {
    expect(
      getPartners("BD", "signed", "  LEARNING  ", "2026-10-11").partners.map(
        (p) => p.id,
      ),
    ).toEqual(["partner-bd"]);
    expect(
      getPartners("PK", "signed", "learning", "2026-10-11").partners,
    ).toHaveLength(0);
    const beforeAgreement = getPartners("PK", "all", "", "2026-09-05");
    expect(beforeAgreement.signed).toBe(0);
    expect(beforeAgreement.prospective).toBe(1);
    expect(beforeAgreement.active).toBe(0);
    expect(getPartners("all", "all", "", "2026-09-05").partners).toHaveLength(
      2,
    );
  });
  it("distinguishes unavailable coverage, no reports, observed zero and reporting lag", () => {
    for (const date of [
      "",
      "2026-10-12",
      "2026-08-31",
      "2026-09-31",
      "invalid",
    ])
      expect(getPartners("all", "all", "", date).covered).toBe(false);
    const planned = pilotUsage(pilotRecords[2], "2026-10-11");
    expect(planned.activated).toBeNull();
    expect(planned.questions).toBeNull();
    expect(planned.report).toBeNull();
    const lagged = pilotUsage(pilotRecords[0], "2026-10-05");
    expect(lagged.report).toBe("2026-09-30");
    expect(lagged.lagDays).toBe(5);
    const zero = pilotUsage(
      { ...pilotRecords[0], studentIds: [] },
      "2026-10-11",
    );
    expect(zero.activated).toBe(0);
    expect(zero.questions).toBe(0);
  });
  it("keeps Overview totals and explicit pilot attribution consistent at cutoff", () => {
    const overview = getOverview("all", "2026-09-01", "2026-10-11");
    const usage = pilotRecords
      .slice(0, 2)
      .map((p) => pilotUsage(p, "2026-10-11"));
    expect(usage.reduce((total, p) => total + p.activated!, 0)).toBe(
      overview.activated,
    );
    expect(usage.reduce((total, p) => total + p.questions!, 0)).toBe(
      overview.completed,
    );
    const ids = pilotRecords.flatMap((p) => p.studentIds);
    expect(new Set(ids).size).toBe(ids.length);
    expect(overview.activated).toBe(180);
    expect(overview.partners).toBe(2);
  });
  it("respects dated operational status without inflating signed organizations", () => {
    const planned = pilotRecords[2];
    expect(pilotStatus(planned, "2026-09-30")).toBeNull();
    expect(pilotStatus(planned, "2026-10-01")).toBe("planned");
    const extra = {
      ...planned,
      statusHistory: [{ date: "2026-10-01", status: "active" as const }],
      plannedStart: "2026-10-01",
    };
    const data = getPartners("all", "all", "", "2026-10-11", partners, [
      ...pilotRecords.slice(0, 2),
      extra,
    ]);
    expect(data.active).toBe(3);
    expect(data.signed).toBe(2);
    expect(
      pilotStatus(
        {
          ...extra,
          statusHistory: [
            ...extra.statusHistory,
            { date: "2026-10-05", status: "paused" },
          ],
        },
        "2026-10-11",
      ),
    ).toBe("paused");
  });
});
