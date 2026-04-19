"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@sophon/shared/components/site/language-provider";
import { PageHero } from "@sophon/shared/components/site/page-hero";
import { SectionHeading } from "@sophon/shared/components/site/section-heading";
import { StoreLayout } from "@sophon/shared/components/site/store-layout";
import {
  localize,
  serviceSteps,
  shoppingChannels,
  shoppingPageContent,
} from "@sophon/shared/lib/site-content";

export default function ShoppingPage() {
  const { language } = useLanguage();
  const content = localize(shoppingPageContent, language);
  const steps = localize(serviceSteps, language);
  const channels = localize(shoppingChannels, language);

  return (
    <StoreLayout>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={{ src: "/assets/online.jpg", alt: "Sophon Market online ordering", priority: true }}
        actions={[
          { href: "/contact", label: content.contactCta },
          { href: "/products", label: content.categoriesCta, variant: "ghost" },
        ]}
      />

      <section className="section shell content-section">
        <SectionHeading
          eyebrow={content.stepsEyebrow}
          title={content.stepsTitle}
          description={content.stepsDescription}
        />

        <div className="step-grid">
          {steps.map((step) => (
            <article key={step.step} className="step-card">
              <span>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell content-section content-section--soft">
        <SectionHeading eyebrow={content.channelsEyebrow} title={content.channelsTitle} />

        <div className="contact-grid">
          {channels.map((channel) => (
            <article key={channel.title} className="contact-card">
              <div className="contact-icon">
                <Image src={channel.icon} alt={channel.title} width={34} height={34} />
              </div>
              <h3>{channel.title}</h3>
              <p>{channel.description}</p>
              <Link href={channel.href}>{channel.action}</Link>
            </article>
          ))}
        </div>
      </section>
    </StoreLayout>
  );
}
