"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@sophon/shared/components/site/language-provider";
import { PageHero } from "@sophon/shared/components/site/page-hero";
import { SectionHeading } from "@sophon/shared/components/site/section-heading";
import { StoreLayout } from "@sophon/shared/components/site/store-layout";
import {
  contactPageContent,
  localize,
  shoppingChannels,
  storeProfile,
} from "@sophon/shared/lib/site-content";

export default function ContactPage() {
  const { language } = useLanguage();
  const content = localize(contactPageContent, language);
  const channels = localize(shoppingChannels, language);
  const profile = localize(storeProfile, language);

  return (
    <StoreLayout>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={{ src: "/assets/contact.jpg", alt: "Sophon Market contact", priority: true }}
        actions={[
          { href: profile.phoneHref, label: profile.phoneDisplay, external: true },
          { href: profile.mapsUrl, label: content.mapsCta, variant: "ghost", external: true, newTab: true },
        ]}
      />

      <section className="section shell content-section">
        <SectionHeading eyebrow={content.supportEyebrow} title={content.supportTitle} />

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

      <section className="section shell map-layout content-section-group">
        <div className="map-panel">
          <iframe
            className="map-frame"
            src={profile.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sophon Market map"
          />
        </div>

        <aside className="aside-card">
          <p className="eyebrow">{content.locationEyebrow}</p>
          <h2>{profile.storeName}</h2>
          <p>{profile.address}</p>
          <div className="store-meta">
            <span>{profile.phoneDisplay}</span>
            <span>{profile.hours}</span>
          </div>
          <Link href={profile.mapsUrl} className="button" target="_blank" rel="noreferrer">
            {content.routeCta}
          </Link>
        </aside>
      </section>
    </StoreLayout>
  );
}
