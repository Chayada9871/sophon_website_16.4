"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SiteFooter } from "@/components/site/footer";
import { useLanguage } from "@/components/site/language-provider";
import { categoryCards, categoryGuideContent, localize, storeProfile } from "@/lib/site-content";

export function CategoryGuidePage({ slug }) {
  const router = useRouter();
  const { language } = useLanguage();
  const categories = localize(categoryCards, language);
  const content = localize(categoryGuideContent, language);
  const profile = localize(storeProfile, language);
  const category = categories.find((entry) => entry.slug === slug);

  if (!category) {
    return null;
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/products");
  };

  return (
    <div className="storefront">
      <header className="guide-header">
        <div className="shell guide-header-inner">
          <Link href="/" className="guide-brand">
            <span className="guide-brand-mark">
              <Image src="/assets/sophon-logo.png" alt="Sophon Market logo" width={42} height={42} />
            </span>
            <span className="guide-brand-copy">{profile.storeName}</span>
          </Link>
        </div>
      </header>

      <main className="page-main">
        <section className="section shell">
          <div className="category-guide-page">
            <h1 className="category-guide-title">{category.title}</h1>

            <div className="category-guide-image">
              <div className="image-wrap">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  priority
                  sizes="(max-width: 720px) 100vw, 860px"
                  className="image-contain"
                />
              </div>
            </div>

            <p className="category-guide-description">{category.guideDescription}</p>

            <button type="button" className="button button--ghost category-guide-action" onClick={handleBack}>
              {content.backCta}
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
