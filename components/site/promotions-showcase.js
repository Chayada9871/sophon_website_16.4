"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { brochureLinkHref } from "@/lib/site-content";
import { formatContentDate, fetchPromotions, isPublishedDate } from "@/lib/website-content-client";

function normalizeItems(items) {
  return [...items]
    .filter((item) => {
      const hasImage = String(item.image_url || item.image || "").trim();
      const hasTitle = String(item.title || "").trim();
      const hasSummary = String(item.summary || "").trim();
      return Boolean(hasImage && hasTitle && hasSummary && isPublishedDate(item.publish_date || item.date));
    })
    .sort((a, b) => String(b.publish_date || b.date || "").localeCompare(String(a.publish_date || a.date || "")));
}

export function PromotionsShowcase({ language, content, fallbackCards }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadItems() {
      try {
        const nextItems = await fetchPromotions();
        if (!isCancelled) {
          setItems(normalizeItems(nextItems));
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
    return (
      <div className="feature-grid">
        {fallbackCards.map((card) => (
          <article key={card.title} className="feature-card">
            <div className="feature-image">
              <img src={card.image} alt={card.title} className="dynamic-image" />
            </div>
            <div className="feature-copy">
              <p className="eyebrow">{content.slotsEyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={brochureLinkHref}>{content.slotLink}</Link>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="feature-grid">
      {items.map((item) => (
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
  );
}
