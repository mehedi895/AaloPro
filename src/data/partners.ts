import { pilots, type Country } from "./demo";
export type Stage = "signed" | "prospective";
export type PilotStatus = "planned" | "active" | "paused" | "completed";
export interface Partner {
  id: string;
  name: string;
  country: Country;
  recordedAt: string;
  signedAt: string | null;
  reach: number;
  note: string;
}
export interface PilotRecord {
  id: string;
  partnerId: string;
  name: string;
  plannedStart: string;
  plannedEnd: string;
  target: number;
  studentIds: string[];
  reports: string[];
  statusHistory: { date: string; status: PilotStatus }[];
  milestones: { date: string; label: string }[];
}
export const partners: Partner[] = [
  {
    id: "partner-bd",
    name: "Demo Learning Collective",
    country: "BD",
    recordedAt: "2026-09-01",
    signedAt: "2026-09-01",
    reach: 1200,
    note: "Fictional learning-center partner. Review offline report completeness before interpreting usage.",
  },
  {
    id: "partner-pk",
    name: "Demo Education Network",
    country: "PK",
    recordedAt: "2026-09-01",
    signedAt: "2026-09-08",
    reach: 900,
    note: "Fictional education network. The agreement is separate from the operational status of each pilot.",
  },
  {
    id: "prospect-bd",
    name: "Demo Community Schools",
    country: "BD",
    recordedAt: "2026-09-20",
    signedAt: null,
    reach: 650,
    note: "Synthetic prospect under discussion. No agreement, enrolled students or reported usage.",
  },
  {
    id: "prospect-pk",
    name: "Demo Access Foundation",
    country: "PK",
    recordedAt: "2026-09-25",
    signedAt: null,
    reach: 500,
    note: "Synthetic prospect awaiting a pilot proposal. Estimated audience is not student activation.",
  },
];
export const pilotRecords: PilotRecord[] = [
  ...pilots.map((p) => ({
    id: p.id,
    partnerId: p.country === "BD" ? "partner-bd" : "partner-pk",
    name:
      p.country === "BD" ? "Learning-center pilot" : "Community tutoring pilot",
    plannedStart: p.signedAt,
    plannedEnd: "2026-10-31",
    target: p.target,
    studentIds: p.studentIds,
    reports: ["2026-09-15", "2026-09-30", p.reportedAt],
    statusHistory: [{ date: p.signedAt, status: "active" as const }],
    milestones: [
      { date: "2026-10-20", label: "Review participation against target" },
      { date: "2026-10-31", label: "Planned pilot review" },
    ],
  })),
  {
    id: "bd-2",
    partnerId: "partner-bd",
    name: "Follow-on cohort",
    plannedStart: "2026-11-01",
    plannedEnd: "2026-12-15",
    target: 80,
    studentIds: [],
    reports: [],
    statusHistory: [{ date: "2026-10-01", status: "planned" }],
    milestones: [
      { date: "2026-11-01", label: "Proposed cohort start" },
      { date: "2026-12-15", label: "Planned evaluation" },
    ],
  },
];
