import {
  coverageStart,
  cutoff,
  questions,
  students,
  type CountryFilter,
} from "../data/demo";
import {
  partners,
  pilotRecords,
  type Partner,
  type PilotRecord,
  type Stage,
} from "../data/partners";
export type StageFilter = Stage | "all";
export const isCoveredDate = (date: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) &&
  !Number.isNaN(Date.parse(date)) &&
  new Date(date).toISOString().slice(0, 10) === date &&
  date >= coverageStart &&
  date <= cutoff;
export function pilotStatus(pilot: PilotRecord, date: string) {
  return (
    pilot.statusHistory
      .filter((s) => s.date <= date)
      .sort((a, b) => b.date.localeCompare(a.date))[0]?.status ?? null
  );
}
export function pilotUsage(pilot: PilotRecord, date: string) {
  const report =
    pilot.reports
      .filter((r) => r <= date)
      .sort()
      .at(-1) ?? null;
  const ids = new Set(pilot.studentIds);
  const available = isCoveredDate(date) && report !== null;
  return {
    report,
    lagDays: report
      ? Math.round((Date.parse(date) - Date.parse(report)) / 86400000)
      : null,
    activated: available
      ? students.filter((s) => ids.has(s.id) && s.activatedAt <= report!).length
      : null,
    questions: available
      ? questions.filter((q) => ids.has(q.studentId) && q.date <= report!)
          .length
      : null,
  };
}
export function getPartners(
  country: CountryFilter,
  stage: StageFilter,
  search: string,
  date: string,
  sourcePartners: Partner[] = partners,
  sourcePilots: PilotRecord[] = pilotRecords,
) {
  const covered = isCoveredDate(date);
  const visible = covered
    ? sourcePartners.filter(
        (p) =>
          p.recordedAt <= date &&
          (country === "all" || p.country === country) &&
          p.name.toLowerCase().includes(search.trim().toLowerCase()) &&
          (stage === "all" ||
            (p.signedAt && p.signedAt <= date ? "signed" : "prospective") ===
              stage),
      )
    : [];
  const visibleIds = new Set(visible.map((p) => p.id));
  const listedPilots = sourcePilots.filter(
    (p) => visibleIds.has(p.partnerId) && pilotStatus(p, date) !== null,
  );
  return {
    covered,
    partners: visible,
    pilots: listedPilots,
    signed: new Set(
      visible.filter((p) => p.signedAt && p.signedAt <= date).map((p) => p.id),
    ).size,
    prospective: new Set(
      visible.filter((p) => !p.signedAt || p.signedAt > date).map((p) => p.id),
    ).size,
    active: listedPilots.filter(
      (p) =>
        pilotStatus(p, date) === "active" &&
        p.plannedStart <= date &&
        visible.some(
          (org) =>
            org.id === p.partnerId && org.signedAt && org.signedAt <= date,
        ),
    ).length,
  };
}
