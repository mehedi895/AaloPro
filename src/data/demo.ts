export type Country = "BD" | "PK";
export type CountryFilter = Country | "all";
export const cutoff = "2026-10-11";
export const coverageStart = "2026-09-01";
export const countries: Record<Country, string> = {
  BD: "Bangladesh",
  PK: "Pakistan",
};
export const students = Array.from({ length: 180 }, (_, i) => ({
  id: `student-${i}`,
  country: (i < 108 ? "BD" : "PK") as Country,
  activatedAt: new Date(
    Date.UTC(
      2026,
      8,
      1 + (i % 5) + 5 * Math.max(0, Math.ceil(((i % 28) - (i % 5)) / 5)),
    ),
  )
    .toISOString()
    .slice(0, 10),
}));
export const questions = Array.from({ length: 41 }, (_, day) => {
  const date = new Date(Date.UTC(2026, 8, 1 + day)).toISOString().slice(0, 10);
  return students.flatMap((student, i) =>
    i % 5 === day % 5 && student.activatedAt <= date
      ? Array.from({ length: 1 + ((i + day) % 3) }, (_, n) => ({
          id: `${day}-${i}-${n}`,
          studentId: student.id,
          country: student.country,
          date,
          status: "completed" as const,
        }))
      : [],
  );
}).flat();
export const subscriptions = Array.from({ length: 32 }, (_, i) => ({
  id: `subscription-${i}`,
  parentId: `parent-${Math.floor(i / 2)}`,
  studentId: `student-${i < 20 ? i : 108 + i - 20}`,
  country: (i < 20 ? "BD" : "PK") as Country,
  startsAt: "2026-09-15",
  endsAt: "2026-11-01",
  paid: true,
}));
export const pilots = [
  {
    id: "bd-1",
    name: "Demo Learning Collective",
    country: "BD" as Country,
    signedAt: "2026-09-01",
    target: 200,
    reach: 1200,
    studentIds: Array.from({ length: 108 }, (_, i) => `student-${i}`),
    reportedAt: cutoff,
  },
  {
    id: "pk-1",
    name: "Demo Education Network",
    country: "PK" as Country,
    signedAt: "2026-09-08",
    target: 150,
    reach: 900,
    studentIds: Array.from({ length: 72 }, (_, i) => `student-${108 + i}`),
    reportedAt: cutoff,
  },
];
export const definitions = [
  [
    "Activated students",
    "Unique students who completed their first tutoring question by the selected end date. Cumulative.",
  ],
  [
    "Weekly active students",
    "Unique students completing at least one question in the seven days ending on the selected end date.",
  ],
  [
    "Completed tutoring questions",
    "Successfully completed questions within the selected date range. Failed and abandoned attempts are excluded.",
  ],
  [
    "Paying parents",
    "Unique parent accounts with at least one active paid student subscription at the selected end date. A parent may cover multiple students.",
  ],
  [
    "Signed pilot partners",
    "Distinct organizations with a signed pilot agreement by the selected end date. Prospects and informal contacts are excluded.",
  ],
];
