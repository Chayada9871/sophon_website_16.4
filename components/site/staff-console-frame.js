"use client";

import Link from "next/link";

import { useLanguage } from "@/components/site/language-provider";
import { StoreLayout } from "@/components/site/store-layout";
import { localize } from "@/lib/site-content";

const shellContent = {
  brandEyebrow: { en: "Sophon staff console", th: "ระบบจัดการเนื้อหา Sophon" },
  title: { en: "Website Content Manager", th: "Website Content Manager" },
  description: {
    en: "Manage promotion and brochure content for the storefront.",
    th: "จัดการโปรโมชั่นและโบรชัวร์สำหรับหน้าเว็บไซต์",
  },
  helperHeading: { en: "How this page works", th: "คำแนะนำการใช้งาน" },
};

function StaffTabLink({ href, label, isActive }) {
  return (
    <Link href={href} className={`staff-tab-link${isActive ? " is-active" : ""}`} aria-current={isActive ? "page" : undefined}>
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
    <StoreLayout>
      <section className="section shell staff-console-page">
        <div className="staff-console-header">
          <div className="staff-console-brand-copy">
            <p className="eyebrow">{shellCopy.brandEyebrow}</p>
            <h1>{shellCopy.title}</h1>
            <p>{shellCopy.description}</p>
          </div>

          <div className="staff-console-header-actions">
            <Link href={viewHref} className="button">
              {viewLabel}
            </Link>
          </div>
        </div>

        <nav className="staff-tab-nav" aria-label="Staff sections">
          <StaffTabLink href="/staff/promotions" label={promotionsLabel} isActive={activeTab === "promotions"} />
          <StaffTabLink href="/staff/brochures" label={brochuresLabel} isActive={activeTab === "brochures"} />
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
    </StoreLayout>
  );
}
