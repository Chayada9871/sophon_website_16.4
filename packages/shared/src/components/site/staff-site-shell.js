"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "./language-provider";
import {
  getConfiguredPublicSiteUrl,
  getPublicSiteHref,
  localize,
  staffNavItems,
  storeProfile,
} from "../../lib/site-content";

const shellContent = {
  consoleLabel: { en: "Website Content Manager", th: "ระบบจัดการเนื้อหาเว็บไซต์" },
  viewPublicSite: { en: "Open Public Site", th: "เปิดเว็บไซต์หน้าร้าน" },
  languageLabel: { en: "Language", th: "ภาษา" },
};

export function StaffSiteShell({ children }) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const content = localize(shellContent, language);
  const profile = localize(storeProfile, language);
  const links = localize(staffNavItems, language);
  const publicSiteUrl = getConfiguredPublicSiteUrl();

  return (
    <div className="staff-site">
      <header className="staff-site-header">
        <div className="shell staff-site-header-inner">
          <Link href="/" className="staff-site-brand">
            <span className="staff-site-brand-mark">
              <Image src="/assets/sophon-logo.png" alt="Sophon Market logo" width={52} height={52} />
            </span>

            <span className="staff-site-brand-copy">
              <strong>{profile.storeName}</strong>
              <span>{content.consoleLabel}</span>
            </span>
          </Link>

          <nav className="staff-site-nav" aria-label="Staff navigation">
            {links.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link key={item.href} href={item.href} className={isActive ? "is-active" : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="staff-site-tools">
            <div className="language-toggle" role="group" aria-label={content.languageLabel}>
              <button
                type="button"
                className={`language-pill${language === "en" ? " is-active" : ""}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`language-pill${language === "th" ? " is-active" : ""}`}
                onClick={() => setLanguage("th")}
              >
                TH
              </button>
            </div>

            {publicSiteUrl ? (
              <a href={getPublicSiteHref("/")} className="button button--ghost" target="_blank" rel="noreferrer">
                {content.viewPublicSite}
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <main className="staff-site-main">{children}</main>
    </div>
  );
}
