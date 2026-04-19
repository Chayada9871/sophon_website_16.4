"use client";

import Link from "next/link";

import { useLanguage } from "@sophon/shared/components/site/language-provider";
import { PageHero } from "@sophon/shared/components/site/page-hero";
import { PromotionsShowcase } from "@sophon/shared/components/site/promotions-showcase";
import { SectionHeading } from "@sophon/shared/components/site/section-heading";
import { StoreLayout } from "@sophon/shared/components/site/store-layout";
import { brochureLinkHref, localize, promotionCards, promotionsPageContent } from "@sophon/shared/lib/site-content";

export default function PromotionsPage() {
  const { language } = useLanguage();
  const content = localize(promotionsPageContent, language);
  const cards = localize(promotionCards, language);

  return (
    <StoreLayout>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={{ src: "/assets/promotion.png", alt: "Sophon Market promotions", priority: true }}
        actions={[
          { href: brochureLinkHref, label: content.brochureCta },
          { href: "/products", label: content.productsCta, variant: "ghost" },
        ]}
      />

      <section className="section shell content-section">
        <SectionHeading
          eyebrow={content.slotsEyebrow}
          title={content.slotsTitle}
          description={content.slotsDescription}
        />

        <PromotionsShowcase language={language} content={content} fallbackCards={cards} />
      </section>

      <section className="section shell promo-band">
        <div className="promo-band-copy">
          <p className="eyebrow">{content.rhythmEyebrow}</p>
          <h2>{content.rhythmTitle}</h2>
          <p>{content.rhythmDescription}</p>
        </div>
        <Link href="/contact" className="button">
          {content.contactCta}
        </Link>
      </section>
    </StoreLayout>
  );
}
