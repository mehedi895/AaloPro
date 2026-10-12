import {
  countries,
  coverageStart,
  cutoff,
  pilots,
  questions,
  students,
  subscriptions,
  type CountryFilter,
} from "../data/demo";
export function daysBetween(start: string, end: string) {
  const days: string[] = [];
  for (let t = Date.parse(start); t <= Date.parse(end); t += 86400000)
    days.push(new Date(t).toISOString().slice(0, 10));
  return days;
}
export function getOverview(
  country: CountryFilter,
  start: string,
  end: string,
) {
  const matches = (c: string) => country === "all" || c === country;
  const valid = Boolean(start && end && start <= end);
  const covered = valid && start >= coverageStart && end <= cutoff;
  const weekStart = new Date(Date.parse(end || cutoff) - 6 * 86400000)
    .toISOString()
    .slice(0, 10);
  const completed = questions.filter(
    (q) => matches(q.country) && q.date >= start && q.date <= end,
  );
  const activeSubscriptions = subscriptions.filter(
    (s) => matches(s.country) && s.paid && s.startsAt <= end && s.endsAt > end,
  );
  return {
    valid,
    covered,
    weekCovered: weekStart >= coverageStart && end <= cutoff,
    activated: students.filter(
      (s) => matches(s.country) && s.activatedAt <= end,
    ).length,
    weekly: new Set(
      questions
        .filter(
          (q) => matches(q.country) && q.date >= weekStart && q.date <= end,
        )
        .map((q) => q.studentId),
    ).size,
    completed: completed.length,
    parents: new Set(activeSubscriptions.map((s) => s.parentId)).size,
    subscriptions: activeSubscriptions.length,
    partners: pilots.filter((p) => matches(p.country) && p.signedAt <= end)
      .length,
    chart: covered
      ? daysBetween(start, end).map((date) => ({
          date,
          BD: completed.filter((q) => q.date === date && q.country === "BD")
            .length,
          PK: completed.filter((q) => q.date === date && q.country === "PK")
            .length,
        }))
      : [],
    pilots: pilots
      .filter((p) => matches(p.country) && p.signedAt <= end)
      .map((p) => ({
        ...p,
        activated: students.filter(
          (s) => p.studentIds.includes(s.id) && s.activatedAt <= end,
        ).length,
        countryName: countries[p.country],
      })),
  };
}
