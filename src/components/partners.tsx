"use client";
import { useState } from "react";
import Sidebar from "./sidebar";
import {
  countries,
  coverageStart,
  cutoff,
  type CountryFilter,
} from "@/data/demo";
import {
  getPartners,
  pilotStatus,
  pilotUsage,
  type StageFilter,
} from "@/lib/partners";
const number = (value: number | null) =>
  value === null ? "—" : value.toLocaleString("en-US");
const dateLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
export default function Partners() {
  const [country, setCountry] = useState<CountryFilter>("all");
  const [stage, setStage] = useState<StageFilter>("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(cutoff);
  const data = getPartners(country, stage, search, date);
  function reset() {
    setCountry("all");
    setStage("all");
    setSearch("");
    setDate(cutoff);
  }
  return (
    <div className="shell">
      <Sidebar active="pilots" />
      <div className="main">
        <header className="topbar">
          <span>
            Workspace <span className="crumb">/</span>
            <strong>Pilots and partners</strong>
          </span>
          <span className="private">▣ &nbsp; Internal dashboard</span>
        </header>
        <main>
          <div className="heading">
            <div>
              <div className="eyebrow">AALOPRO PILOT MONITOR</div>
              <h1>Pilots and partners</h1>
              <p>
                Track agreements, pilot progress and the next planned steps.
              </p>
            </div>
            <span className="outline-badge">Read-only</span>
          </div>
          <div className="demo-banner">
            <span className="demo-tag">DEMO DATA</span>
            <div>
              <strong>A preview, powered by synthetic data.</strong>
              <p>
                All figures, partners and milestones are fictional. They do not
                represent verified AaloPro traction.
              </p>
            </div>
          </div>
          <section className="filters" aria-label="Partner filters">
            <label>
              Country
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryFilter)}
              >
                <option value="all">All countries</option>
                {Object.entries(countries).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Partnership stage
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as StageFilter)}
              >
                <option value="all">All stages</option>
                <option value="signed">Signed agreement</option>
                <option value="prospective">Prospective</option>
              </select>
            </label>
            <label>
              Search partners
              <input
                type="search"
                placeholder="Partner name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <label>
              Reporting date
              <input
                type="date"
                value={date}
                min={coverageStart}
                max={cutoff}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <button className="reset" onClick={reset}>
              Reset filters ↺
            </button>
          </section>
          <div className="freshness">
            <span>
              <span className="dot" />
              Sample reporting cutoff:{" "}
              <strong>{dateLabel(cutoff)} · UTC</strong>
            </span>
            <span>Fixed demo snapshot · Not live</span>
          </div>
          {!data.covered && (
            <div role="alert" className="empty">
              Choose a reporting date between {dateLabel(coverageStart)} and{" "}
              {dateLabel(cutoff)}. Missing coverage is not zero activity.
            </div>
          )}
          <section
            className="metric-grid partner-metrics"
            aria-label="Partnership summaries"
          >
            {[
              [
                "Signed partners",
                data.signed,
                "Distinct organizations with signed agreements",
              ],
              [
                "Active pilots",
                data.active,
                "Started pilots with active operational status",
              ],
              [
                "Prospective partners",
                data.prospective,
                "Under discussion · excluded from signed counts",
              ],
            ].map(([title, count, description]) => (
              <article className="metric" key={title}>
                <div className="metric-title">{title}</div>
                <div className="metric-value">
                  {data.covered ? number(count as number) : "—"}
                </div>
                <small>As of reporting date · matching filters</small>
                <div className="metric-footer">{description}</div>
              </article>
            ))}
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Partner directory</h2>
                <p>
                  Expand a partner for pilot dates, aggregate usage and planned
                  milestones.
                </p>
              </div>
              <span className="subtle-badge" role="status">
                {data.covered
                  ? `${data.partners.length} FICTIONAL PARTNERS`
                  : "UNAVAILABLE"}
              </span>
            </div>
            {data.covered && !data.partners.length && (
              <div className="empty" role="status">
                No partners match this selection. Try another country, stage or
                search.
                <button className="empty-reset" onClick={reset}>
                  Reset filters
                </button>
              </div>
            )}
            {!data.covered && (
              <p className="empty">
                Partner directory unavailable for this reporting date.
              </p>
            )}
            <div className="partner-list">
              {data.partners.map((partner) => {
                const signed = Boolean(
                  partner.signedAt && partner.signedAt <= date,
                );
                const records = data.pilots.filter(
                  (p) => p.partnerId === partner.id,
                );
                return (
                  <details className="partner-card" key={partner.id}>
                    <summary>
                      <span className="partner-heading">
                        <span className="country-label">
                          {countries[partner.country]}
                        </span>
                        <strong>{partner.name}</strong>
                        <small>
                          {records.length}{" "}
                          {records.length === 1 ? "pilot" : "pilots"} ·
                          Estimated network reach: {number(partner.reach)} · Not
                          usage
                        </small>
                      </span>
                      <span
                        className={`stage-badge ${signed ? "signed" : "prospect"}`}
                      >
                        {signed ? "Signed agreement" : "Prospective"}
                      </span>
                      <span className="detail-hint">
                        View details <span aria-hidden="true">⌄</span>
                      </span>
                    </summary>
                    <div className="partner-content">
                      <div className="partner-context">
                        <div>
                          <h3>Agreement status</h3>
                          <p>
                            {signed
                              ? `Signed ${dateLabel(partner.signedAt!)}`
                              : "No signed agreement by this reporting date"}
                          </p>
                        </div>
                        <div>
                          <h3>Partner network reach</h3>
                          <p>
                            {number(partner.reach)} estimated audience · May
                            overlap other partners
                          </p>
                        </div>
                      </div>
                      <p className="partner-note">{partner.note}</p>
                      {!records.length && (
                        <div className="empty">
                          No pilot recorded by this date. No usage is attributed
                          to this partner.
                        </div>
                      )}
                      {records.map((pilot) => {
                        const usage = pilotUsage(pilot, date);
                        const status = pilotStatus(pilot, date);
                        return (
                          <article
                            className="pilot pilot-detail"
                            key={pilot.id}
                          >
                            <div className="pilot-top">
                              <h3>{pilot.name}</h3>
                              <span className="subtle-badge">{status}</span>
                            </div>
                            <p>
                              Planned dates: {dateLabel(pilot.plannedStart)} –{" "}
                              {dateLabel(pilot.plannedEnd)}
                            </p>
                            <div className="pilot-stats">
                              <div>
                                <strong>{number(usage.activated)}</strong>
                                <small>
                                  Activated students
                                  <br />
                                  Reported usage
                                </small>
                              </div>
                              <div>
                                <strong>{number(usage.questions)}</strong>
                                <small>
                                  Completed questions
                                  <br />
                                  Cumulative reported usage
                                </small>
                              </div>
                              <div>
                                <strong>{number(pilot.target)}</strong>
                                <small>
                                  Student target
                                  <br />
                                  Planned, not usage
                                </small>
                              </div>
                            </div>
                            {usage.activated !== null && pilot.target > 0 && (
                              <>
                                <div className="target-label">
                                  <span>Activation against planned target</span>
                                  <strong>
                                    {Math.round(
                                      (usage.activated / pilot.target) * 100,
                                    )}
                                    %
                                  </strong>
                                </div>
                                <progress
                                  value={usage.activated}
                                  max={pilot.target}
                                  aria-label={`${pilot.name} activation against target`}
                                />
                              </>
                            )}
                            <div className="pilot-report">
                              {usage.report
                                ? `Latest sample report: ${dateLabel(usage.report)}`
                                : "No report received by this date"}
                              <span>
                                {usage.report
                                  ? usage.lagDays === 0
                                    ? "At reporting date"
                                    : `${usage.lagDays} days behind reporting date`
                                  : "Usage unavailable"}
                              </span>
                            </div>
                            {!usage.report && (
                              <p className="empty">
                                No report is available. A dash means unknown
                                usage, not zero students or questions.
                              </p>
                            )}
                            <div className="milestones">
                              <h3>Planned milestones</h3>
                              <ul>
                                {pilot.milestones.map((m) => (
                                  <li key={m.date + m.label}>
                                    <time dateTime={m.date}>
                                      {dateLabel(m.date)}
                                    </time>
                                    <span>
                                      {m.label}
                                      <small>
                                        {m.date < date
                                          ? "Planned date passed · completion unverified"
                                          : "Planned · completion unverified"}
                                      </small>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
          <section className="panel definitions">
            <h2>Reading this screen</h2>
            <div className="definition-grid">
              <div>
                <h3>Partners and pilots</h3>
                <p>
                  Signed partners count distinct organizations. A partner may
                  run several pilots. Prospects are excluded from signed and
                  active-pilot totals.
                </p>
              </div>
              <div>
                <h3>Operational status</h3>
                <p>
                  Planned, active, paused and completed describe a pilot. Active
                  means it has started and is marked active by the selected
                  reporting date.
                </p>
              </div>
              <div>
                <h3>Reported usage</h3>
                <p>
                  Activated students completed their first question. Completed
                  questions are cumulative through the latest report on or
                  before the reporting date, using explicit pilot assignments.
                </p>
              </div>
              <div>
                <h3>Targets and reach</h3>
                <p>
                  Student targets are planned participation. Network reach is an
                  estimated partner audience; estimates can overlap and are
                  never counted as activated students.
                </p>
              </div>
              <div>
                <h3>Reporting freshness</h3>
                <p>
                  Historical dates use reports available by that date. A report
                  lag is visible; no report shows unavailable usage. The default
                  cutoff matches Overview.
                </p>
              </div>
            </div>
            <div className="reporting-note">
              <strong>Offline reporting has a delay.</strong> Only received
              reports are represented. These synthetic records illustrate report
              availability, not verified traction or a live sync. Dates use UTC.
              Overview keeps its existing selected-range definitions.
            </div>
          </section>
          <footer>
            AaloPro · Founding team workspace
            <span>Local prototype · Synthetic data only</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
