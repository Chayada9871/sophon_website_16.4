"use client";

import { useLanguage } from "@sophon/shared/components/site/language-provider";
import { BrochureShowcase } from "@sophon/shared/components/site/brochure-showcase";
import { PageHero } from "@sophon/shared/components/site/page-hero";
import { SectionHeading } from "@sophon/shared/components/site/section-heading";
import { StoreLayout } from "@sophon/shared/components/site/store-layout";
import {
  brochurePageContent,
  brochurePanels,
  localize,
} from "@sophon/shared/lib/site-content";

export default function BrochurePage() {
  const { language } = useLanguage();
  const content = localize(brochurePageContent, language);
  const panels = localize(brochurePanels, language);

  return (
    <StoreLayout>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={{ src: "/assets/sp-2.png", alt: "Sophon Market brochure", priority: true }}
        actions={[
          { href: "/promotions", label: content.promotionsCta },
          { href: "/products", label: content.productsCta, variant: "ghost" },
        ]}
      />

      <section className="section shell content-section">
        <SectionHeading
          eyebrow={content.galleryEyebrow}
          title={content.galleryTitle}
          description={content.galleryDescription}
        />

        <BrochureShowcase language={language} content={content} fallbackPanels={panels} />
      </section>
    </StoreLayout>
  );
}
