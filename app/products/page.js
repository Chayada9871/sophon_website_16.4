"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useLanguage } from "@/components/site/language-provider";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { StoreLayout } from "@/components/site/store-layout";
import {
  brochureLinkHref,
  categoryCards,
  localize,
  productsPageContent,
  storeProfile,
  trustPoints,
} from "@/lib/site-content";

function ProductsPageScreen({ categories, content, points, profile, query }) {
  const normalizedQuery = query.toLocaleLowerCase();
  const filteredCategories = normalizedQuery
    ? categories.filter((category) =>
        `${category.title} ${category.subtitle} ${category.guideDescription}`.toLocaleLowerCase().includes(
          normalizedQuery
        )
      )
    : categories;
  const resultCountLabel = `${filteredCategories.length} ${content.searchCountLabel}`;

  return (
    <StoreLayout>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image={{ src: "/assets/product.png", alt: "Sophon Market category guides", priority: true }}
        actions={[
          { href: brochureLinkHref, label: content.brochureCta },
          { href: "/contact", label: content.contactCta, variant: "ghost" },
        ]}
      />

      {query ? (
        <section className="section shell product-search-banner">
          <div>
            <p className="eyebrow">{content.searchEyebrow}</p>
            <h2>
              {content.searchTitle} "{query}"
            </h2>
            <p>
              {content.searchDescription} {resultCountLabel}.
            </p>
          </div>
          <Link href="/products" className="button button--ghost">
            {content.clearSearch}
          </Link>
        </section>
      ) : null}

      <section className="section shell content-section">
        <SectionHeading
          eyebrow={content.categoriesEyebrow}
          title={content.categoriesTitle}
          description={content.categoriesDescription}
        />

        {filteredCategories.length ? (
          <div className="category-grid">
            {filteredCategories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`} className="category-card">
                <div className="category-image">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    className="image-contain"
                  />
                </div>
                <h3>{category.title}</h3>
                <p>{category.subtitle}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">{content.searchEyebrow}</p>
            <h2>{content.emptyTitle}</h2>
            <p>{content.emptyDescription}</p>
            <Link href="/products" className="button">
              {content.clearSearch}
            </Link>
          </div>
        )}
      </section>

      <section className="section shell content-section content-section--soft">
        <SectionHeading eyebrow={content.strengthsEyebrow} title={content.strengthsTitle} />

        <div className="trust-grid">
          {points.map((point) => (
            <article key={point.title} className="trust-card">
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell cta-banner">
        <div>
          <p className="eyebrow">{content.helpEyebrow}</p>
          <h2>{content.helpTitle}</h2>
        </div>
        <div className="button-row">
          <a href={profile.phoneHref} className="button">
            {profile.phoneDisplay}
          </a>
          <Link href="/shopping" className="button button--ghost">
            {content.orderingCta}
          </Link>
        </div>
      </section>
    </StoreLayout>
  );
}

function ProductsPageSearchContent(props) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  return <ProductsPageScreen {...props} query={query} />;
}

export default function ProductsPage() {
  const { language } = useLanguage();
  const content = localize(productsPageContent, language);
  const categories = localize(categoryCards, language);
  const points = localize(trustPoints, language);
  const profile = localize(storeProfile, language);
  const sharedProps = { categories, content, points, profile };

  return (
    <Suspense fallback={<ProductsPageScreen {...sharedProps} query="" />}>
      <ProductsPageSearchContent {...sharedProps} />
    </Suspense>
  );
}
