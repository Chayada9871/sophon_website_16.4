"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  fetchBrochures,
  formatContentDate,
  getBrochureOpenUrl,
  getBrochurePreviewUrl,
  isPdfFile,
  normalizePublishedBrochures,
} from "../../lib/website-content-client";

export function BrochureShowcase({ language, content, fallbackPanels }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadItems() {
      try {
        const nextItems = await fetchBrochures();
        if (!isCancelled) {
          setItems(normalizePublishedBrochures(nextItems));
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
        {fallbackPanels.map((panel) => (
          <article key={panel.title} className="feature-card">
            <div className="feature-image">
              <img src={panel.image} alt={panel.title} className="dynamic-image" />
            </div>
            <div className="feature-copy">
              <p className="eyebrow">{content.panelEyebrow}</p>
              <h3>{panel.title}</h3>
              <p>{panel.description}</p>
              <Link href="/contact">{content.panelLink}</Link>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="dynamic-brochure-grid">
      {items.map((item) => {
        const pdf = isPdfFile(item);
        const previewUrl = getBrochurePreviewUrl(item);
        const openUrl = getBrochureOpenUrl(item);

        return (
          <article key={item.id} className="dynamic-brochure-card">
            <div className="dynamic-brochure-head">
              <div>
                <p className="eyebrow">{formatContentDate(item.display_date || item.date || "", language)}</p>
                <h3>{item.title}</h3>
              </div>

              <a href={openUrl} className="button button--ghost" target="_blank" rel="noreferrer">
                {pdf ? content.openPdf : content.openImage}
              </a>
            </div>

            {pdf ? (
              <div className="dynamic-brochure-frame">
                <iframe src={previewUrl} title={item.title} className="dynamic-brochure-viewer" />
              </div>
            ) : (
              <div className="dynamic-brochure-image-wrap">
                <img src={previewUrl} alt={item.title} className="dynamic-brochure-image" />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
