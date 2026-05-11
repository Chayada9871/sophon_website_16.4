"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatContentDate, fetchPromotions } from "../../lib/website-content-client";

const itemsPerPage = 9;

function normalizeItems(items) {
  return [...items]
    .filter((item) => {
      if (item.offline) {
        return false;
      }

      const hasImage = String(item.image_url || item.image || "").trim();
      const hasTitle = String(item.title || "").trim();
      const hasSummary = String(item.summary || "").trim();
      return Boolean(hasImage && hasTitle && hasSummary);
    })
    .sort((a, b) => String(b.publish_date || b.date || "").localeCompare(String(a.publish_date || a.date || "")));
}

export function PromotionsShowcase({ language, content }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isCancelled = false;

    async function loadItems() {
      try {
        const nextItems = await fetchPromotions();
        if (!isCancelled) {
          setItems(normalizeItems(nextItems));
          setCurrentPage(1);
        }
      } catch {
        if (!isCancelled) {
          setItems([]);
        }
      }
    }

    void loadItems();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!items.length) {
    return null;
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const pageItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <>
      <div className="feature-grid">
        {pageItems.map((item) => (
          <article key={item.id} className="feature-card">
            <div className="feature-image">
              <img src={item.image_url || item.image} alt={item.title} className="dynamic-image" />
            </div>

            <div className="feature-copy">
              <p className="eyebrow">{formatContentDate(item.publish_date || item.date || "", language)}</p>
              <span className="dynamic-tag">{item.kind || content.slotsEyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Link href="/contact">{content.contactCta}</Link>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav className="pagination" aria-label="Promotions pages">
          <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={!canGoBack} aria-label="Previous page">
            Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  className={page === currentPage ? "is-active" : undefined}
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={!canGoForward} aria-label="Next page">
            Next
          </button>
        </nav>
      ) : null}
    </>
  );
}
