export function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`section-heading${align === "center" ? " section-heading--center" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p className="section-copy">{description}</p> : null}
    </div>
  );
}
