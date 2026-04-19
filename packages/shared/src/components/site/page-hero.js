import Image from "next/image";
import Link from "next/link";

function HeroAction({ action }) {
  const className = action.variant === "ghost" ? "button button--ghost" : "button";

  if (action.external) {
    return (
      <a
        href={action.href}
        className={className}
        target={action.newTab ? "_blank" : undefined}
        rel={action.newTab ? "noreferrer" : undefined}
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export function PageHero({ eyebrow, title, description, image, actions = [] }) {
  return (
    <section className="section shell page-hero">
      <div className="page-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>

        {actions.length ? (
          <div className="button-row">
            {actions.map((action) => (
              <HeroAction key={`${action.href}-${action.label}`} action={action} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="page-hero-visual">
        <div className="image-wrap">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={image.priority}
            sizes={image.sizes ?? "(max-width: 900px) 100vw, 42vw"}
            className="image-cover"
          />
        </div>
      </div>
    </section>
  );
}
