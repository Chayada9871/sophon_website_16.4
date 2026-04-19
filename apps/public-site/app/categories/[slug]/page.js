import { notFound } from "next/navigation";

import { CategoryGuidePage } from "@sophon/shared/components/site/category-guide-page";
import { categoryCards } from "@sophon/shared/lib/site-content";

export function generateStaticParams() {
  return categoryCards.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  if (!categoryCards.some((category) => category.slug === slug)) {
    notFound();
  }

  return <CategoryGuidePage slug={slug} />;
}
