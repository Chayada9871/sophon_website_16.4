"use client";

import Link from "next/link";

import { useLanguage } from "./language-provider";
import { brochureLinkHref, footerContent, localize, navItems, storeProfile } from "../../lib/site-content";

export function SiteFooter() {
  const { language } = useLanguage();
  const footerCopy = localize(footerContent, language);
  const links = localize(navItems, language);
  const profile = localize(storeProfile, language);

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <p className="eyebrow">Sophon Market</p>
          <h2>{profile.storeName}</h2>
          <p>{footerCopy.description}</p>
        </div>

        <div className="footer-column">
          <h3>{footerCopy.exploreHeading}</h3>
          <div className="footer-links">
            {links.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h3>{footerCopy.storeInfoHeading}</h3>
          <div className="footer-meta">
            <p>{profile.phoneDisplay}</p>
            <p>{profile.hours}</p>
            <p>{profile.address}</p>
          </div>
        </div>

        <div className="footer-column">
          <h3>{footerCopy.quickActionsHeading}</h3>
          <div className="footer-links">
            <Link href={brochureLinkHref}>{footerCopy.viewBrochure}</Link>
            <Link href="/promotions">{footerCopy.seePromotions}</Link>
            <Link href={profile.mapsUrl} target="_blank" rel="noreferrer">
              {footerCopy.openGoogleMaps}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
