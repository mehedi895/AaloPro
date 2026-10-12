import Link from "next/link";
export default function Sidebar({ active }: { active: "overview" | "pilots" }) {
  return (
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="AaloPro overview">
        Aalo<span>Pro</span>
        <i />
      </Link>
      <div className="workspace">
        FOUNDING TEAM <span>INTERNAL</span>
      </div>
      <nav aria-label="Main navigation">
        <Link
          href="/"
          className={active === "overview" ? "selected" : ""}
          aria-current={active === "overview" ? "page" : undefined}
        >
          <b aria-hidden="true">◫</b> Overview
        </Link>
        <Link
          href="/pilots"
          className={active === "pilots" ? "selected" : ""}
          aria-current={active === "pilots" ? "page" : undefined}
        >
          <b aria-hidden="true">◇</b> Pilots and partners
        </Link>
        {[
          ["▥", "Usage"],
          ["▤", "Subscription records"],
        ].map(([icon, name]) => (
          <div className="nav-future" key={name}>
            <b aria-hidden="true">{icon}</b>
            <span>
              {name}
              <small>Coming later</small>
            </span>
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <span className="dot" /> Local demo workspace
        <p>Bangladesh & Pakistan pilots</p>
        <small>Synthetic records only</small>
      </div>
    </aside>
  );
}
