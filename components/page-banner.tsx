const img = (path: string) => `/velumuri-assets/images/${path}`;

// Optional art-directed crops: landscape screens (desktop, landscape tablets and
// phones) always get `image`; portrait screens get `mobile` below 700px and
// `tablet` below 1100px. Art-directed banners (.page-banner--art) are sized to
// their image so it shows uncropped, with dark text and no scrim; `align` moves
// the copy onto the clear sky of the landscape (desktop) crop, and `raised`
// lifts it toward the top edge when the sky sits high in the frame;
// `imagePosition` keeps an off-centre subject in frame when the image is cropped.
// `uncropped` opts a single-image banner into the same art-directed layout, and
// `onDark` keeps the light (white/gold) type for a dark image in that layout.
export function PageBanner({ eyebrow, lines, image, tablet, mobile, alt, description, align = 'center', raised = false, imagePosition, uncropped = false, onDark = false }: { eyebrow: string; lines: string[]; image: string; tablet?: string; mobile?: string; alt: string; description?: string; align?: 'left' | 'center' | 'right'; raised?: boolean; imagePosition?: string; uncropped?: boolean; onDark?: boolean }) {
  const art = Boolean(tablet || mobile || uncropped);
  return (
    <section className={`page-banner mood-image${art ? ' page-banner--art' : ''}${align !== 'center' ? ` page-banner--${align}` : ''}${raised ? ' page-banner--raised' : ''}${onDark ? ' page-banner--on-dark' : ''}`} aria-label={eyebrow}>
      <div className="hero-media">
        <picture>
          {art && <source media="(orientation: landscape)" srcSet={img(image)} />}
          {mobile && <source media="(max-width: 699px)" srcSet={img(mobile)} />}
          {tablet && <source media="(max-width: 1099px)" srcSet={img(tablet)} />}
          <img src={img(image)} alt={alt} width={1920} height={600} loading="eager" fetchPriority="high" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
        </picture>
      </div>
      {!art && <div className="hero-scrim" aria-hidden="true" />}
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
