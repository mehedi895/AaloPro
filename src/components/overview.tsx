"use client";
import { useState } from "react";
import Sidebar from "./sidebar";
import {
  countries,
  cutoff,
  definitions,
  type CountryFilter,
} from "@/data/demo";
import { getOverview } from "@/lib/metrics";
const fmt = (n: number) => n.toLocaleString("en-US");
const pretty = (s: string) =>
  new Date(`${s}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
export default function Overview() {
  const [country, setCountry] = useState<CountryFilter>("all");
  const [preset, setPreset] = useState("28");
  const [start, setStart] = useState("2026-09-14");
  const [end, setEnd] = useState(cutoff);
  const data = getOverview(country, start, end);
  const metrics = [
    data.activated,
    data.weekly,
    data.completed,
    data.parents,
    data.partners,
  ];
  const windows = [
    "Cumulative · as of end date",
    "7 days · ending on end date",
    "Within selected date range",
    "Active · as of end date",
    "Signed · as of end date",
  ];
  const max = Math.max(1, ...data.chart.flatMap((d) => [d.BD, d.PK]));
  function changePreset(value: string) {
    setPreset(value);
    if (value !== "custom") {
      setEnd(cutoff);
      setStart(
        new Date(Date.parse(cutoff) - (Number(value) - 1) * 86400000)
          .toISOString()
          .slice(0, 10),
      );
    }
  }
  return (
    <div className="shell">
      <Sidebar active="overview" />
      <div className="main">
        <header className="topbar">
          <span>
            Workspace <span className="crumb">/</span> <strong>Overview</strong>
          </span>
          <span className="private">▣ &nbsp; Internal dashboard</span>
        </header>
        <main>
          <div className="heading">
            <div>
              <div className="eyebrow">AALOPRO PILOT MONITOR</div>
              <h1>Every question. A step forward.</h1>
              <p>A shared view of our Bangladesh and Pakistan pilots.</p>
            </div>
            <span className="outline-badge">Overview</span>
          </div>
          <div className="demo-banner">
            <span className="demo-tag">DEMO DATA</span>
            <div>
              <strong>A preview, powered by synthetic data.</strong>
              <p>
                All figures and partner labels are fictional. They do not
                represent verified AaloPro traction.
              </p>
            </div>
          </div>
          <section className="filters" aria-label="Dashboard filters">
            <label>
              Country
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryFilter)}
              >
                <option value="all">All countries</option>
                {Object.entries(countries).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date range
              <select
                value={preset}
                onChange={(e) => changePreset(e.target.value)}
              >
                <option value="28">Last 28 reported days</option>
                <option value="7">Last 7 reported days</option>
                <option value="custom">Custom range</option>
              </select>
            </label>
            <label>
              From
              <input
                type="date"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  setPreset("custom");
                }}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                  setPreset("custom");
                }}
              />
            </label>
            <button
              className="reset"
              onClick={() => {
                setCountry("all");
                changePreset("28");
              }}
            >
              Reset filters ↺
            </button>
          </section>
          <div className="freshness">
            <span>
              <span className="dot" /> Sample reporting cutoff:{" "}
              <strong>{pretty(cutoff)} · UTC</strong>
            </span>
            <span>Fixed demo snapshot · Not live</span>
          </div>
          {!data.valid && (
            <div role="alert" className="empty">
              Choose both dates, with the start date on or before the end date.
            </div>
          )}
          {data.valid && !data.covered && (
            <div role="status" className="empty">
              No complete reporting coverage for this range. Choose dates
              between 1 Sep and 11 Oct 2026. Missing data is not zero activity.
            </div>
          )}
          <section
            className="metric-grid"
            aria-label="Reported usage and signed agreements"
          >
            {definitions.map(([title, definition], i) => (
              <article className="metric" key={title}>
                <div className="metric-title">
                  {title}
                  <span title={definition} aria-label={definition}>
                    ⓘ
                  </span>
                </div>
                <div className="metric-value">
                  {data.covered && (i !== 1 || data.weekCovered)
                    ? fmt(metrics[i])
                    : "—"}
                </div>
                <small>{windows[i]}</small>
                <div className="metric-footer">
                  {i === 3
                    ? `${data.covered ? fmt(data.subscriptions) : "—"} paid student subscriptions`
                    : i === 4
                      ? "Agreements, not network reach"
                      : "Reported usage · synthetic"}
                </div>
              </article>
            ))}
          </section>
          <section className="panel activity">
            <div className="panel-head">
              <div>
                <h2>Tutoring activity</h2>
                <p>Completed questions per day · selected date range</p>
              </div>
              <div className="legend">
                {country !== "PK" && (
                  <span>
                    <i className="bd" />
                    Bangladesh
                  </span>
                )}
                {country !== "BD" && (
                  <span>
                    <i className="pk" />
                    Pakistan
                  </span>
                )}
              </div>
            </div>
            {data.chart.length ? (
              <>
                <div className="chart">
                  <svg
                    viewBox="0 0 960 230"
                    role="img"
                    aria-label="Daily completed questions. Exact values are available in the table below."
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <g key={i}>
                        <line
                          x1="40"
                          y1={190 - i * 55}
                          x2="940"
                          y2={190 - i * 55}
                          stroke="#e8e9e5"
                        />
                        <text
                          x="30"
                          y={194 - i * 55}
                          textAnchor="end"
                          fill="#747970"
                          fontSize="11"
                        >
                          {Math.round((max * i) / 3)}
                        </text>
                      </g>
                    ))}
                    {(["BD", "PK"] as const)
                      .filter((c) => country === "all" || country === c)
                      .map((c) => (
                        <polyline
                          key={c}
                          fill="none"
                          stroke={c === "BD" ? "#be9700" : "#343e39"}
                          strokeWidth="3"
                          strokeLinejoin="round"
                          points={data.chart
                            .map(
                              (d, i) =>
                                `${40 + (i * 900) / Math.max(1, data.chart.length - 1)},${190 - (d[c] / max) * 165}`,
                            )
                            .join(" ")}
                        />
                      ))}
                    {[
                      0,
                      Math.floor((data.chart.length - 1) / 2),
                      data.chart.length - 1,
                    ]
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((i) => (
                        <text
                          key={i}
                          x={
                            40 + (i * 900) / Math.max(1, data.chart.length - 1)
                          }
                          y="220"
                          textAnchor={
                            i === 0
                              ? "start"
                              : i === data.chart.length - 1
                                ? "end"
                                : "middle"
                          }
                          fill="#747970"
                          fontSize="11"
                        >
                          {pretty(data.chart[i].date)}
                        </text>
                      ))}
                  </svg>
                </div>
                {data.completed === 0 && (
                  <p className="empty">
                    No completed questions reported in this period. Try a wider
                    date range.
                  </p>
                )}
                <details className="chart-table">
                  <summary>View daily figures</summary>
                  <div className="table-scroll">
                    <table>
                      <caption>
                        Daily completed tutoring questions · synthetic data
                      </caption>
                      <thead>
                        <tr>
                          <th>Date</th>
                          {country !== "PK" && <th>Bangladesh</th>}
                          {country !== "BD" && <th>Pakistan</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {data.chart.map((d) => (
                          <tr key={d.date}>
                            <td>{pretty(d.date)}</td>
                            {country !== "PK" && <td>{d.BD}</td>}
                            {country !== "BD" && <td>{d.PK}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </>
            ) : (
              <div className="empty">
                Activity chart unavailable for this date selection.
              </div>
            )}
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Pilot snapshot</h2>
                <p>
                  Usage, planned targets and network estimates are separate
                  measures.
                </p>
              </div>
              <span className="subtle-badge">FICTIONAL PARTNERS</span>
            </div>
            <div className="pilot-grid">
              {data.covered ? (
                data.pilots.length ? (
                  data.pilots.map((p) => (
                    <article className="pilot" key={p.id}>
                      <div className="pilot-top">
                        <span className="country-label">{p.countryName}</span>
                        <span className="signed">Signed pilot</span>
                      </div>
                      <h3>{p.name}</h3>
                      <div className="pilot-stats">
                        <div>
                          <strong>{fmt(p.activated)}</strong>
                          <small>
                            Activated students
                            <br />
                            Reported usage
                          </small>
                        </div>
                        <div>
                          <strong>{fmt(p.target)}</strong>
                          <small>
                            Student target
                            <br />
                            Planned, not usage
                          </small>
                        </div>
                        <div>
                          <strong>{fmt(p.reach)}</strong>
                          <small>
                            Network reach
                            <br />
                            Estimate, not usage
                          </small>
                        </div>
                      </div>
                      <div className="target-label">
                        <span>Activation against planned target</span>
                        <strong>
                          {Math.round((p.activated / p.target) * 100)}%
                        </strong>
                      </div>
                      <progress
                        value={p.activated}
                        max={p.target}
                        aria-label={`${p.countryName} activation against target`}
                      />
                      <div className="pilot-report">
                        Sample report: {pretty(p.reportedAt)}{" "}
                        <span>
                          {p.reportedAt < cutoff
                            ? "Reporting lag"
                            : "At cutoff"}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty">
                    No signed pilots as of this end date.
                  </div>
                )
              ) : (
                <div className="empty">
                  Pilot snapshot unavailable without complete date coverage.
                </div>
              )}
            </div>
          </section>
          <section className="definitions panel">
            <h2>What these numbers mean</h2>
            <p>
              All measures respect country selection. Cumulative and weekly
              measures use the selected end date.
            </p>
            <div className="definition-grid">
              {definitions.map(([title, body]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <div className="reporting-note">
              <strong>Offline reporting has a delay.</strong> Activity appears
              only after a report is received. These fixed synthetic records
              illustrate reporting behavior; they are not a live sync. Counts
              use UTC dates. Paying parents are distinct accounts, while
              subscriptions count paid student access records.
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
