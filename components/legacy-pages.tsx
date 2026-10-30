import Link from 'next/link';
import { PrivacyPolicyPage } from '@/components/privacy-policy-page';
import { JournalPage } from '@/components/journal-page';
import { GalleryPage } from '@/components/gallery-page';
import { ProjectsPage } from '@/components/projects-page';
import { OngoingProjectPage } from '@/components/ongoing-project-page';
import { PageBanner } from '@/components/page-banner';

const image = (path: string) => `/velumuri-assets/images/${path}`;
const projectCards = [
  ['Ongoing', 'Velumuri Achyutha', '280 gated 2 & 3 BHK homes near Morampudi Junction, Rajahmundry.', 'projects/velumuri-vistas.jpg', '/ongoing-projects'],
  ['Upcoming', 'The Next Chapter', 'New gated-community developments across Rajahmundry are taking shape.', 'upcoming.jpg', '/upcoming-projects'],
  ['Completed', '16 homes delivered', 'A legacy of homes delivered on time and supported long after handover.', 'completed.jpg', '/previous-projects'],
];
const articles = [
  ['velumuri-vistas-update', 'Project Update', 'Velumuri Vistas: A Construction Progress Update', 'From foundation to façade — where our flagship gated community stands today.', 'Blog/blog_four_thubnail.jpg', 'four'],
  ['home-loan-documentation-guide', "Buyer’s Guide", "A First-Time Buyer’s Guide to Home Loan Documentation", 'Every document your bank will ask for, in the order they need it.', 'Blog/blog_two_thubnail.jpg', 'two'],
  ['gated-community-family-living', 'Lifestyle', 'Why Gated Communities Are Redefining Family Living', 'Security, shared spaces, and a genuine sense of neighbourhood.', 'Blog/blog_three_thubnail.jpg', 'three'],
  ['understanding-rera-buyer-protection', "Buyer’s Guide", 'Understanding RERA: How It Protects Every Homebuyer', 'What RERA registration guarantees and the questions it should prompt.', 'Blog/blog_one_thubnail.jpg', 'one'],
  ['vastu-tips-apartment-buyers', 'Guides', 'Vastu Tips Every Apartment Buyer Should Know', 'Simple, practical Vastu principles to consider before you sign.', 'gallery/entrance.jpeg'],
  ['rcc-framed-construction-quality', 'Construction', "What RCC Framed Construction Means For Your Home's Safety", 'A plain-language look at the structural choice behind every home.', 'vistas/progress-12.jpg'],
];
const completed = ['Lakshmi Avvas', 'Lakshmi Elite', 'Velumuri Indraprastha', 'Casa Fortune', 'Fortune Trinity', 'Fortune Spacio', 'Fortune Greens', 'Gunuru Meadows', 'Mahatva Homes', 'Fortune Elnido', 'Fortune Landmark', 'Lakshmi Nivas', 'Sai Nilaya', 'Narayana Elite', 'Myspace Elite', 'Myspace Akshaya'];

// Balances a single dynamic title (e.g. an article headline) across two
// lines near their midpoint, the way PageBanner's other callers hand-write
// their line breaks — short titles stay on one line.
function splitTitle(title: string): string[] {
  const words = title.split(' ');
  if (words.length < 4) return [title];
  let bestSplit = Math.ceil(words.length / 2);
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
    if (diff < bestDiff) { bestDiff = diff; bestSplit = i; }
  }
  return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')];
}
function Enquiry({ title = 'Schedule A Visit' }: { title?: string }) { return <section className="legacy-enquiry"><div><p className="legacy-kicker">{title}</p><h2>Let&apos;s find the right home for you</h2></div><form><input aria-label="Name" placeholder="Your name" /><input aria-label="Phone" placeholder="Phone number" /><input aria-label="Email" placeholder="Email address" /><button type="button">Send enquiry <span>→</span></button></form></section>; }
function CardGrid({ cards = projectCards }: { cards?: string[][] }) { return <div className="legacy-card-grid">{cards.map(([type, title, copy, visual, href]) => <article className="legacy-card" key={title}>{visual && <img src={image(visual)} alt="" />}<p>{type}</p><h3>{title}</h3><div>{copy}</div>{href && <Link href={href}>Explore <span>→</span></Link>}</article>)}</div>; }

// Every slug LegacyPage renders and every article id — prebuilt by the
// static export (generateStaticParams in app/[slug] and app/blog/[article]).
export const LEGACY_SLUGS = ['projects', 'ongoing-projects', 'previous-projects', 'upcoming-projects', 'blogs', 'blog', 'gallery', 'privacypolicy', 'privacy-policy'];
export const ARTICLE_IDS = articles.map(([id]) => id);

export function LegacyPage({ slug }: { slug: string }) {
  if (slug === 'projects') return <ProjectsPage />;
  if (slug === 'ongoing-projects') return <OngoingProjectPage />;
  if (slug === 'previous-projects') return <><PageBanner eyebrow="Completed projects" lines={splitTitle('16 homes delivered, one promise kept')} description="From Rajamahendravaram to Bengaluru, every completed development is honestly built, delivered on schedule, and supported after handover." image="banners/previous-projects.jpg" alt="A completed Velumuri Infra community" /><section className="legacy-section"><p className="legacy-kicker">Our legacy</p><div className="legacy-completed">{completed.map((name, index) => <article key={name}><img src={image(`previous-projects/${['lakshmi-avvas.jpg','lakshmi-elite.jpg','velumuri-indraprastha.jpg','casa-fortune.jpg','fortune-trinity.jpg','fortune-spacio.jpg','fortune-greens.jpeg','gunuru-meadows.jpg','mahatva-homes.jpg','fortune-elnido.png','fortune-landmark.jpg','lakshmi-nivas.jpg','sai-nilaya.jpg','narayana-elite.jpg','myspace-elite.jpeg','myspace-akshaya.jpeg'][index]}`)} alt="" /><p>Completed</p><h3>{name}</h3></article>)}</div></section></>;
  if (slug === 'upcoming-projects') return <><PageBanner eyebrow="Upcoming projects" lines={splitTitle('The next chapter is on the drawing board')} description="More gated-community developments across Rajamahendravaram, built to the same standard and promise." image="banners/upcoming-projects.jpg" alt="Upcoming Velumuri project" /><section className="legacy-split"><img src={image('upcoming.jpg')} alt="Upcoming Velumuri project" /><div><p className="legacy-kicker">What’s next</p><h2>More homes, the same standard</h2><p>Locations, configurations, pricing and launch dates are being finalised. Join the early-access list and hear from us before anything goes public.</p></div></section><Enquiry title="Be first to know" /></>;
  if (slug === 'blogs' || slug === 'blog') return <JournalPage entries={articles.map(([id, category, title, excerpt, photo]) => ({ id, category, title, excerpt, image: image(photo) }))} />;
  if (slug === 'gallery') return <GalleryPage />;
  if (slug === 'privacypolicy' || slug === 'privacy-policy') return <PrivacyPolicyPage />;
  return <><PageBanner eyebrow="Achyutha" lines={splitTitle('A more considered way to live')} description="Explore our homes, stories and services." image="hero/hero.png" alt="Achyutha" /><section className="legacy-section"><CardGrid /></section></>;
}

export function BlogArticle({ article }: { article: string }) { const entry = articles.find(([id]) => id === article); const title = entry?.[2] ?? 'Stories from Velumuri'; return <div className="blog-article"><PageBanner onDark eyebrow={entry?.[1] ?? 'Journal'} lines={splitTitle(title)} image={entry?.[5] ? `Blog/blog_${entry[5]}_desktop.jpg` : entry?.[4] ?? 'hero/hero.png'} tablet={entry?.[5] ? `Blog/blog_${entry[5]}_tablet.jpg` : undefined} mobile={entry?.[5] ? `Blog/blog_${entry[5]}_mobile.jpg` : undefined} alt={title} description={entry?.[3] ?? 'Ideas and updates from the world of Velumuri.'} /><article className="legacy-prose"><p className="legacy-kicker">Velumuri journal</p><h2>Built on clarity, not complication</h2><p>Buying a home is one of life’s biggest decisions. These guides bring together the questions our team hears most often and the practical knowledge that helps buyers move forward with confidence.</p><p>Every Velumuri home is developed with a focus on transparent communication, considered design and a lasting commitment to the people who live there.</p><Link className="legacy-link" href="/blogs">← Back to journal</Link></article></div>; }
