"use client";

import Link from "next/link";

import { useLanguage } from "./language-provider";
import { StaffSiteShell } from "./staff-site-shell";
import { localize } from "../../lib/site-content";

const shellContent = {
  helperHeading: { en: "Usage", th: "วิธีใช้งาน" },
};

function StaffTabLink({ href, label, isActive }) {
  return (
    <Link href={href} className={`staff-tab-link${isActive ? " is-active" : ""}`} aria-current={isActive ? "page" : undefined}>
      {label}
    </Link>
  );
}

function ActionLink({ href, label }) {
  if (!href) {
    return null;
  }

  const isExternal = /^https?:\/\//i.test(href);

  if (isExternal) {
    return (
      <a href={href} className="button" target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className="button">
      {label}
    </Link>
  );
}

export function StaffConsoleFrame({
  eyebrow,
  title,
  description,
  helperDescription,
  viewHref,
  viewLabel,
  activeTab,
  promotionsLabel,
  brochuresLabel,
  children,
}) {
  const { language } = useLanguage();
  const shellCopy = localize(shellContent, language);

  return (
    <StaffSiteShell>
      <section className="section shell staff-console-page">
        <div className="staff-console-header">
          <div className="staff-console-brand-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="staff-console-header-actions">
            <ActionLink href={viewHref} label={viewLabel} />
          </div>
        </div>

        <nav className="staff-tab-nav" aria-label="Staff sections">
          <StaffTabLink href="/promotions" label={promotionsLabel} isActive={activeTab === "promotions"} />
          <StaffTabLink href="/brochures" label={brochuresLabel} isActive={activeTab === "brochures"} />
        </nav>

        <div className={`staff-console-intro${helperDescription ? "" : " staff-console-intro--single"}`}>
          <div className="staff-console-intro-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          {helperDescription ? (
            <div className="staff-console-helper">
              <p className="staff-console-helper-heading">{shellCopy.helperHeading}</p>
              <p>{helperDescription}</p>
            </div>
          ) : null}
        </div>

        {children}
      </section>
    </StaffSiteShell>
  );
}
