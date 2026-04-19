"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useLanguage } from "@sophon/shared/components/site/language-provider";
import { StoreLayout } from "@sophon/shared/components/site/store-layout";
import { localize } from "@sophon/shared/lib/site-content";
import {
  fetchBrochures,
  formatContentDate,
  getBrochurePreviewUrl,
  isPdfFile,
  normalizePublishedBrochures,
} from "@sophon/shared/lib/website-content-client";

const redirectPageContent = {
  eyebrow: { en: "Latest brochure", th: "โบรชัวร์ล่าสุด" },
  loadingTitle: { en: "Loading brochure...", th: "กำลังโหลดโบรชัวร์..." },
  loadingDescription: {
    en: "Please wait a moment while the latest brochure is prepared.",
    th: "กรุณารอสักครู่ ระบบกำลังเตรียมโบรชัวร์ล่าสุด",
  },
  emptyTitle: { en: "No brochure available yet", th: "ยังไม่มีโบรชัวร์ให้ดูในตอนนี้" },
  emptyDescription: {
    en: "Please check again later or return to the brochure page.",
    th: "กรุณากลับมาตรวจสอบอีกครั้งภายหลัง หรือกลับไปหน้าโบรชัวร์",
  },
  backLabel: { en: "Back", th: "กลับ" },
  dateLabel: { en: "Display date", th: "วันแสดงผล" },
};

export default function LatestBrochurePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const content = localize(redirectPageContent, language);
  const [latestItem, setLatestItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadLatestBrochure() {
      try {
        const items = normalizePublishedBrochures(await fetchBrochures());
        if (!isCancelled) {
          setLatestItem(items[0] ?? null);
        }
      } catch {
        if (!isCancelled) {
          setLatestItem(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadLatestBrochure();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/brochure");
  };

  const previewUrl = latestItem ? getBrochurePreviewUrl(latestItem) : "";
  const isPdf = latestItem ? isPdfFile(latestItem) : false;
  const displayDate = latestItem ? formatContentDate(latestItem.display_date || latestItem.date || "", language) : "";

  return (
    <StoreLayout>
      <section className="section shell content-section">
        {isLoading ? (
          <div className="empty-state">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2>{content.loadingTitle}</h2>
            <p>{content.loadingDescription}</p>
            <button type="button" className="button button--ghost" onClick={handleBack}>
              {content.backLabel}
            </button>
          </div>
        ) : latestItem && previewUrl ? (
          <article className="dynamic-brochure-card brochure-viewer-card">
            <div className="dynamic-brochure-head brochure-viewer-head">
              <div>
                <p className="eyebrow">{content.eyebrow}</p>
                <h1>{latestItem.title}</h1>
                {displayDate ? (
                  <p className="brochure-viewer-meta">
                    {content.dateLabel}: {displayDate}
                  </p>
                ) : null}
              </div>

              <button type="button" className="button button--ghost" onClick={handleBack}>
                {content.backLabel}
              </button>
            </div>

            {isPdf ? (
              <div className="dynamic-brochure-frame brochure-viewer-frame">
                <iframe src={previewUrl} title={latestItem.title} className="dynamic-brochure-viewer brochure-viewer-embed" />
              </div>
            ) : (
              <div className="dynamic-brochure-image-wrap brochure-viewer-frame">
                <img src={previewUrl} alt={latestItem.title} className="dynamic-brochure-image" />
              </div>
            )}
          </article>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2>{content.emptyTitle}</h2>
            <p>{content.emptyDescription}</p>
            <button type="button" className="button button--ghost" onClick={handleBack}>
              {content.backLabel}
            </button>
          </div>
        )}
      </section>
    </StoreLayout>
  );
}
