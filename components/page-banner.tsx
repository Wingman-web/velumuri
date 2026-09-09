const img = (path: string) => `/velumuri-assets/images/${path}`;

export function PageBanner({ eyebrow, lines, image, alt }: { eyebrow: string; lines: [string, string]; image: string; alt: string }) {
  return (
    <section className="page-banner mood-image" aria-label={eyebrow}>
      <div className="hero-media">
        <img src={img(image)} alt={alt} width={1920} height={600} loading="eager" fetchPriority="high" />
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="container page-banner-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          <span className="hero-line"><span className="hero-line-inner">{lines[0]}</span></span>
          <span className="hero-line"><span className="hero-line-inner">{lines[1]}</span></span>
        </h1>
      </div>
    </section>
  );
}
