"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useLanguage } from "./language-provider";
import { headerContent, localize, navItems, storeProfile } from "../../lib/site-content";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { language, setLanguage } = useLanguage();

  const headerCopy = localize(headerContent, language);
  const profile = localize(storeProfile, language);
  const links = localize(navItems, language);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!pathname.startsWith("/products")) {
      setQuery("");
      return;
    }

    setQuery(searchParams.get("q") ?? "");
  }, [pathname, searchParams]);

  const handleClose = () => setMenuOpen(false);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const normalizedQuery = query.trim();

    router.push(normalizedQuery ? `/products?q=${encodeURIComponent(normalizedQuery)}` : "/products");
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-main">
        <div className="shell header-main-inner">
          <Link href="/" className="brand" onClick={handleClose}>
            <span className="brand-mark">
              <Image src="/assets/sophon-logo.png" alt="Sophon Market logo" width={60} height={60} />
            </span>

            <span className="brand-copy">
              <strong>{profile.storeName}</strong>
              <span>{profile.tagline}</span>
            </span>
          </Link>

          <form className="header-search" role="search" onSubmit={handleSearchSubmit}>
            <label htmlFor="site-search" className="sr-only">
              {headerCopy.searchPlaceholder}
            </label>
            <input
              id="site-search"
              type="search"
              value={query}
              placeholder={headerCopy.searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">{headerCopy.searchButton}</button>
          </form>

          <div className="header-tools">
            <div className="language-toggle" role="group" aria-label={headerCopy.languageLabel}>
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

            <Link href="/contact" className="header-action header-action--dark" onClick={handleClose}>
              {headerCopy.contactStore}
            </Link>

            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      <div className="nav-strip">
        <div className="shell nav-strip-inner">
          <div className={`header-nav-wrap${menuOpen ? " is-open" : ""}`}>
            <nav id="site-nav" className="site-nav" aria-label="Primary navigation">
              {links.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isActive ? "is-active" : undefined}
                    onClick={handleClose}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
