"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/components/site/language-provider";
import { SectionHeading } from "@/components/site/section-heading";
import { StoreLayout } from "@/components/site/store-layout";
import {
  brochureLinkHref,
  categoryGuideContent,
  categoryCards,
  homePageContent,
  localize,
  serviceSteps,
  shoppingChannels,
  spotlightCards,
  storeProfile,
  trustPoints,
} from "@/lib/site-content";

function SpotlightFeature({ card, reverse = false }) {
  return (
    <article className={`spotlight-feature${reverse ? " is-reverse" : ""}`}>
      <div className="spotlight-feature-media">
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(max-width: 980px) 100vw, 42vw"
          className="image-cover"
        />
      </div>

      <div className="spotlight-feature-copy">
        <p className="eyebrow">{card.eyebrow}</p>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <Link href={card.href}>{card.linkLabel}</Link>
      </div>
    </article>
  );
}

function DepartmentCard({ category, ctaLabel }) {
  return (
    <Link href={`/categories/${category.slug}`} className="department-card">
      <div className="department-card-media">
        <Image
          src={category.image}
          alt={category.title}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
          className="image-contain"
        />
      </div>
      <div className="department-card-copy">
        <h3>{category.title}</h3>
        <p>{category.subtitle}</p>
        <span className="department-card-link">{ctaLabel}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { language } = useLanguage();
  const content = localize(homePageContent, language);
  const guideContent = localize(categoryGuideContent, language);
  const cards = localize(spotlightCards, language);
  const categories = localize(categoryCards, language);
  const steps = localize(serviceSteps, language);
  const points = localize(trustPoints, language);
  const channels = localize(shoppingChannels, language);
  const profile = localize(storeProfile, language);
  const featuredCards = cards.slice(0, 2);

  return (
    <StoreLayout>
      <div className="home-page">
        <section className="section shell home-hero">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <p className="eyebrow">{content.heroEyebrow}</p>
              <h1>{content.heroTitle}</h1>
              <p className="hero-lead">{content.heroLead}</p>

              <div className="button-row home-hero-actions">
                <Link href="/products" className="button">
                  {content.primaryCta}
                </Link>
                <Link href={brochureLinkHref} className="button button--ghost">
                  {content.secondaryCta}
                </Link>
              </div>

              <div className="hero-facts">
                <span>{profile.phoneDisplay}</span>
                <span>{profile.hours}</span>
                <Link href={profile.mapsUrl} target="_blank" rel="noreferrer">
                  {content.visitMap}
                </Link>
              </div>
            </div>

            <div className="home-hero-side">
              <div className="hero-visual-frame">
                <div className="image-wrap">
                  <Image
                    src="/assets/sophon-storefront.webp"
                    alt="Sophon Market storefront"
                    fill
                    priority
                    sizes="(max-width: 1100px) 100vw, 44vw"
                    className="image-cover"
                  />
                </div>
                <div className="hero-visual-overlay" />

                <div className="hero-visual-note">
                  <p>{content.visitTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section shell home-section">
          <div className="home-section-head">
            <SectionHeading
              eyebrow={content.highlightEyebrow}
              title={content.highlightTitle}
              description={content.highlightDescription}
            />

            <Link href="/promotions" className="section-link">
              {cards[1].linkLabel}
            </Link>
          </div>

          <div className="spotlight-stack">
            {featuredCards.map((card, index) => (
              <SpotlightFeature key={card.title} card={card} reverse={index % 2 === 1} />
            ))}
          </div>
        </section>

        <section className="section shell home-section">
          <div className="home-section-head">
            <SectionHeading
              eyebrow={content.categoriesEyebrow}
              title={content.categoriesTitle}
              description={content.categoriesDescription}
            />

            <Link href="/products" className="section-link">
              {content.categoriesAction}
            </Link>
          </div>

          <div className="department-grid">
            {categories.map((category) => (
              <DepartmentCard key={category.slug} category={category} ctaLabel={guideContent.openGuide} />
            ))}
          </div>
        </section>

        <section className="section shell home-service-layout">
          <div className="home-section home-service-main">
            <SectionHeading
              eyebrow={content.orderingEyebrow}
              title={content.orderingTitle}
              description={content.orderingDescription}
            />

            <div className="service-steps-grid">
              {steps.map((step) => (
                <article key={step.step} className="service-step-card">
                  <span>{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="home-section home-service-aside">
            <p className="eyebrow">{content.visitEyebrow}</p>
            <h2>{content.visitTitle}</h2>
            <p className="section-copy">{content.visitDescription}</p>
            <p className="service-address">{profile.address}</p>

            <div className="store-meta">
              <span>{profile.phoneDisplay}</span>
              <span>{profile.hours}</span>
            </div>

            <div className="service-channel-list">
              {channels.map((channel) => (
                <Link key={channel.title} href={channel.href} className="service-channel-card">
                  <span className="service-channel-icon">
                    <Image src={channel.icon} alt={channel.title} width={22} height={22} />
                  </span>
                  <span className="service-channel-copy">
                    <strong>{channel.title}</strong>
                    <small>{channel.action}</small>
                  </span>
                </Link>
              ))}
            </div>

            <div className="aside-actions">
              <Link href="/contact" className="button">
                {content.visitContact}
              </Link>
              <Link href={profile.mapsUrl} className="button button--ghost" target="_blank" rel="noreferrer">
                {content.visitMap}
              </Link>
            </div>
          </aside>
        </section>

        <section className="section shell home-section home-section--soft">
          <SectionHeading eyebrow={content.whyEyebrow} title={content.whyTitle} align="center" />

          <div className="benefit-grid">
            {points.map((point) => (
              <article key={point.title} className="benefit-card">
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StoreLayout>
  );
}
