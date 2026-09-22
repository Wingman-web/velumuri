const img = (path: string) => `/velumuri-assets/images/${path}`;

export function PageBanner({ eyebrow, lines, image, alt, description }: { eyebrow: string; lines: string[]; image: string; alt: string; description?: string }) {
  return (
    <section className="page-banner mood-image" aria-label={eyebrow}>
      <div className="hero-media">
        <img src={img(image)} alt={alt} width={1920} height={600} loading="eager" fetchPriority="high" />
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="container page-banner-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {lines.map((line, i) => (
            <span className="hero-line" key={i}><span className="hero-line-inner">{line}</span></span>
          ))}
        </h1>
        {description && <p className="page-banner-desc">{description}</p>}
      </div>
    </section>
  );
}
