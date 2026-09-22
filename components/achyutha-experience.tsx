'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Silk } from './Silk';
import FoldText, { type FoldTextHandle } from './FoldText';
import { getLenisInstance } from '@/lib/lenis-instance';
import { CATEGORY_FILTERS, nearbyLocations } from '@/lib/achyutha-locations';

const hero = '/images/hero/';
const gallery = '/velumuri-assets/images/gallery/';

// Closing gallery strip — reference: cards-hover-animation.mp4 (an
// equal-width row of portrait cards that expands whichever one the
// cursor is over, shrinking the rest, entirely via a CSS flex-grow
// transition on :hover — no JS math needed for that part). Real,
// previously-unused project photos, each titled plainly by what it
// shows rather than invented marketing copy.
const COMMUNITY_CARDS = [
  { img: `${gallery}entrance.jpeg`, title: 'Grand Entrance' },
  { img: `${gallery}pathway.jpeg`, title: 'Landscaped Pathway' },
  { img: `${gallery}podium-tree-court.jpg`, title: 'Podium Tree Court' },
  { img: `${gallery}kids-play-area.jpeg`, title: 'Kids’ Play Area' },
  { img: `${gallery}skating-rink.jpeg`, title: 'Skating Rink' },
  { img: `${gallery}half-basketball.jpeg`, title: 'Half Basketball Court' },
  { img: `${gallery}badminton-court.jpeg`, title: 'Badminton Court' },
  { img: `${gallery}cricket-practice-net.jpg`, title: 'Cricket Practice Net' },
  { img: `${gallery}guest-waiting-lounge.png`, title: 'Guest Lounge' },
];

// Full real amenity lists per category, as supplied — corrected for
// obvious typos/casing only (e.g. "Libreray"→"Library", "Pickel
// ball"→"Pickleball", "Temparature"→"Temperature"), nothing added,
// removed, merged or reworded beyond that, including the two separately
// listed "Deck" entries under Terrace.
const CARDS_STAGES = [
  {
    key: 'podium',
    label: 'Podium',
    tagline: 'Gardens, seating and play',
    copy: 'A landscaped podium level threading gardens, seating and play across the block.',
    img: `${hero}podium.jpeg`,
    items: [
      'Project Signage', 'Water Feature', 'Gate', 'Walking Track', 'Tree House',
      'Half Basketball Court', 'Pickleball Court', 'Squash Court', 'Cricket Pitch',
      'Multipurpose Plaza', 'Outdoor Fitness Station', 'Jain Temple', 'Hindu Temple',
      'Rejuvenating Path', 'Children’s Playground', 'Supermarket', 'Pets’ Zone',
      'Store Room', 'Library', 'Tennis Court', 'Koi Pond & Bubble Pond',
      'Temperature-Controlled Pool', 'Skating Rink', 'Jogging Track',
    ],
  },
  {
    key: 'clubhouse',
    label: 'Clubhouse',
    tagline: 'Built for every mood',
    copy: 'A clubhouse built for every mood — quiet mornings, and evenings with friends.',
    img: `${hero}clubhouse.jpeg`,
    items: [
      'Coffee Bar', 'Waiting Lounge', 'Banquet Hall', 'Guest Bedroom', 'Board Room',
      'Sports Lounge', 'Mini Theater', 'Seniors’ Room', 'Indoor Game Zone',
      'Co-Working Space', '4 Guest Rooms with Waiting Lounge', 'Yoga Room', 'Gym',
    ],
  },
  {
    key: 'terrace',
    label: 'Terrace',
    tagline: 'Slow evenings above the city',
    copy: 'Open-air terraces framed by the skyline, made for slow evenings above the city.',
    img: `${hero}terrace.jpeg`,
    items: [
      'Feature Bench', 'Swimming Pool Terrace', 'Shallow Deck', 'Kids’ Swimming Pool',
      'Underwater Seat', 'Spa Seat', 'Adults’ Swimming Pool', 'F&B Terrace',
      'Kids’ Playground', 'Elderly Garden', 'Deck', 'Sky Viewing Terrace', 'Bar',
      'Jacuzzi', 'Deck', 'Seating', 'Multipurpose Plaza', 'BBQ Station', 'Sky Bar',
      'F&B Plaza', 'Amphitheater', 'Sky Bar & Pantry', 'Feature Pavilion',
      'Cooldown Space', 'Sky Theater & Star Gazing',
    ],
  },
];

// Marker positions for the hotspot explorer below. Each marker is
// anchored by its DOT — `left`/`top` are where the dot sits on the
// photo (percentages of .ac-points-markers, whose top inset clears the
// site header). Every label sits up at that container's top edge, in a
// row above the elevation, with a straight vertical leader running down
// to its dot — so the leader length is simply `top`. Columns are spaced
// so no two leaders cross and no two labels touch. Dot placement as per
// the client's annotated screenshot: Commercial on the glass tower;
// Terrace at the crown of the tall residential tower; Residence on the
// second tower's floors; Clubhouse and Podium down on the low buildings
// at bottom-right.
const POINT_POSITIONS: Record<string, { left: string; top: string }> = {
  commercial: { left: '32%', top: '45%' },
  terrace: { left: '71%', top: '25%' },
  residential: { left: '80%', top: '44%' },
  clubhouse: { left: '88%', top: '82%' },
  podium: { left: '95%', top: '93%' },
};

// .ac-points' own copy + photo for the two stages above that aren't
// part of CARDS_STAGES (podium/clubhouse/terrace are the client's real,
// supplied amenity zones — used as-is, own photos included). Plain,
// generic-safe copy rather than invented specifics (no claimed unit
// count, floor range, retail tenant, etc.) — flagged for a creative-
// director/client pass before shipping, same call as COMMUNITY_CARDS'
// own highlight-list copy elsewhere on this page. Photos are stand-ins
// too, picked for a plausible visual match (entrance.jpeg's ground-level
// frontage for Commercial, the full night_elevation shot for
// Residential) rather than dedicated photography, since neither exists
// yet for these two.
const POINTS_EXTRA_STAGES: { key: string; label: string; copy: string; img: string }[] = [
  { key: 'commercial', label: 'Commercial', copy: 'Ground-level retail and everyday convenience, right at the address.', img: `${gallery}entrance.jpeg` },
  { key: 'residential', label: 'Residence', copy: 'Home to Achyutha’s residences, rising floor after floor above it.', img: `${hero}night_elevation.jpeg` },
];

// .ac-points' own full stage list — the three real, client-supplied
// amenity zones (CARDS_STAGES, shared with .ac-amenities/.ac-cards)
// plus the two building-use pointers above that are specific to this
// section alone, so not folded into CARDS_STAGES itself (that array is
// also used by .ac-cards' full-bleed showcase, which has no equivalent
// "commercial/residential" stage of its own). Each stage's own `img`
// swaps into .ac-points-bg on hover (see the :has() rules in brand.css)
// — a real per-category crossfade, not one shared backdrop.
const POINTS_STAGES: { key: string; label: string; copy: string; img: string }[] = [
  ...CARDS_STAGES.map(({ key, label, copy, img }) => ({ key, label, copy, img })),
  ...POINTS_EXTRA_STAGES,
];

// Hover-preview photo per amenity in .ac-cards' lists — the square card
// that follows the cursor over an item (see the .ac-cards-preview driver
// in the effect below). Drawn from photography already on the site,
// matched by subject where one exists; anything without a specific
// match falls back to its own zone's photo (CARDS_STAGES[].img), so
// every item shows *something* true to its zone rather than a wrong
// picture. Keyed by the exact item text used in CARDS_STAGES.
const AMENITY_IMAGES: Record<string, string> = {
  // Podium
  'Project Signage': `${hero}podium.jpeg`,
  'Water Feature': `${gallery}podium.jpg`,
  'Gate': `${gallery}entrance.jpeg`,
  'Walking Track': `${gallery}pathway.jpeg`,
  'Tree House': `${gallery}podium-tree-court.jpg`,
  'Half Basketball Court': `${gallery}half-basketball.jpeg`,
  'Pickleball Court': `/velumuri-assets/images/hero/hero-courts.jpg`,
  'Cricket Pitch': `${gallery}cricket-practice-net.jpg`,
  'Multipurpose Plaza': `${gallery}podium.jpg`,
  'Outdoor Fitness Station': `/velumuri-assets/images/hero/hero-courts.jpg`,
  'Rejuvenating Path': `${gallery}pathway.jpeg`,
  'Children’s Playground': `${gallery}kids-play-area.jpeg`,
  'Pets’ Zone': `${gallery}podium-tree-court.jpg`,
  'Tennis Court': `/velumuri-assets/images/hero/hero-courts.jpg`,
  'Temperature-Controlled Pool': `${hero}terrace.jpeg`,
  'Skating Rink': `${gallery}skating-rink.jpeg`,
  'Jogging Track': `${gallery}pathway.jpeg`,
  // Clubhouse
  'Coffee Bar': `${hero}clubhouse.jpeg`,
  'Waiting Lounge': `${gallery}waiting-hall.png`,
  'Banquet Hall': `${hero}bridge_view.jpeg`,
  'Board Room': `${gallery}guest-waiting-lounge.png`,
  'Sports Lounge': `${hero}clubhouse.jpeg`,
  'Seniors’ Room': `${gallery}waiting-hall.png`,
  'Co-Working Space': `${gallery}guest-waiting-lounge.png`,
  '4 Guest Rooms with Waiting Lounge': `${gallery}waiting-hall.png`,
  // Terrace
  'F&B Terrace': `${hero}bridge_view.jpeg`,
  'Kids’ Playground': `${gallery}kids-play-area.jpeg`,
  'Elderly Garden': `${gallery}podium-tree-court.jpg`,
  'Sky Viewing Terrace': `${hero}bridge_view.jpeg`,
  'Bar': `${hero}bridge_view.jpeg`,
  'BBQ Station': `${hero}bridge_view.jpeg`,
  'Sky Bar': `${hero}bridge_view.jpeg`,
  'F&B Plaza': `${hero}bridge_view.jpeg`,
  'Sky Bar & Pantry': `${hero}bridge_view.jpeg`,
  'Sky Theater & Star Gazing': `${hero}night_sky.jpeg`,
};
const amenityImage = (stageImg: string, item: string) => AMENITY_IMAGES[item] ?? stageImg;

const LOCATION_IMG = `${hero}location.jpeg`;

// Floor plans — one tab per tower (A, B, C), placeholder-level per
// instruction ("make A,B,C with some masked one"): real per-block floor plans do exist for the
// sibling Velumuri Vistas project (public/velumuri-assets/images/
// vistas/floor-plan-block-*.jpg) but are deliberately NOT used here,
// even blurred — they're labelled, specific-unit-number layouts for a
// different project, and blurring wouldn't make showing another
// client's actual floor plans under Achyutha's name any less
// misleading. .ac-floorplans-mask below is a purely abstract CSS
// grid/blueprint pattern instead — no real (or borrowed) floor plan
// content, and no fabricated specs (BHK count, sqft) attached to any
// one type, just a plain "ask us" placeholder per type.
const FLOOR_PLAN_TYPES: { id: string; label: string }[] = [
  { id: 'a', label: 'Tower A' },
  { id: 'b', label: 'Tower B' },
  { id: 'c', label: 'Tower C' },
];

function Words({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span className="ac-word" key={i}>{word}{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </>
  );
}

function formatCount(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-IN');
}

export function AchyuthaExperience() {
  const root = useRef<HTMLDivElement>(null);
  // Every heading's fold-in is played imperatively (ref.play()) from
  // whichever GSAP timeline/ScrollTrigger already choreographs that part
  // of the page, rather than letting FoldText's own built-in triggers
  // fire independently — see the note at the top of FoldText.tsx for why.
  const heroFoldRef = useRef<FoldTextHandle>(null);
  const velumuriFoldRef = useRef<FoldTextHandle>(null);
  const tallestFoldRef = useRef<FoldTextHandle>(null);
  const highlightFoldRefs = useRef<(FoldTextHandle | null)[]>([]);
  const amenityFoldRefs = useRef<(FoldTextHandle | null)[]>([]);
  const cardsFoldRef = useRef<FoldTextHandle>(null);
  const cardsStageFoldRefs = useRef<(FoldTextHandle | null)[]>([]);
  const locationFoldRef = useRef<FoldTextHandle>(null);
  const floorplansFoldRef = useRef<FoldTextHandle>(null);

  // Location section: a plain pill filter + list, not scroll-choreographed
  // like everything above, so ordinary React state is the natural fit
  // here rather than another imperative GSAP/ref driver.
  const [activeLocationCategory, setActiveLocationCategory] = useState(CATEGORY_FILTERS[0].id);
  const activeLocations = useMemo(
    () => nearbyLocations.filter((loc) => loc.category === activeLocationCategory),
    [activeLocationCategory],
  );

  // Floor plans: same plain-tab-state approach as location above.
  const [activeFloorPlan, setActiveFloorPlan] = useState(FLOOR_PLAN_TYPES[0].id);
  const activeFloorPlanLabel = FLOOR_PLAN_TYPES.find((p) => p.id === activeFloorPlan)?.label ?? '';

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    // This page's whole opening scene is scroll-position-driven (day
    // fades to night as you scroll through the pinned hero); if the
    // browser restores a previous scroll position on reload/back-nav
    // (its default behavior), the page would open already mid- or
    // post-transition instead of at the intended day/top state.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    // Lenis is shared across pages (root layout) and may still be easing
    // toward the previous page's scroll position when this one mounts —
    // in that state it ignores the native scrollTo above and would drag
    // the window back down, opening the hero mid-transition. Pin its
    // own target to the top as well (MotionProvider also re-syncs it on
    // every route change; this is the belt to that braces, since this
    // page's whole opening depends on starting at exactly 0).
    getLenisInstance()?.scrollTo(0, { immediate: true, force: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.registerPlugin(ScrollTrigger);
    // gsap.context() auto-reverts every tween/ScrollTrigger/matchMedia
    // created inside it, but the snap-to-section listener below isn't a
    // GSAP object and needs its own explicit teardown — this holds that
    // teardown so the effect's main cleanup (below) can run it alongside
    // context.revert().
    let snapCleanup: (() => void) | undefined;
    // Same story for the plain DOM listeners the amenity hover-preview
    // below attaches — collected here, run from the effect's cleanup.
    const extraCleanup: Array<() => void> = [];
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.ac-tallest-outline', { clipPath: 'inset(0% 0 0 0)' });
        gsap.set('.ac-tallest-copy .ac-word, .ac-podium-intro-copy .ac-word', { color: '#faf4e6' });
        // .ac-points collapses to a plain stacked block under reduced
        // motion (see brand.css) — the markers/hover-swap are dropped
        // entirely there in favor of always-visible photos and copy, so
        // nothing here needs to force a marker into its revealed state.
        // The count-up below never runs under reduced motion, so set
        // each stat straight to its final value instead of leaving the
        // "0" placeholder markup on screen permanently.
        element.querySelectorAll<HTMLElement>('.ac-tallest-stat-value[data-count-to]').forEach((el) => {
          const to = parseFloat(el.dataset.countTo || '0');
          const decimals = parseInt(el.dataset.countDecimals || '0', 10);
          el.textContent = formatCount(to, decimals);
        });
        document.getElementById('site-header')?.classList.add('ac-nav-visible');
        // .ac-amenities collapses to a plain static block under reduced
        // motion (see brand.css) — the CSS override there stacks every
        // stage's text, so nothing here needs to force '.is-active'.
        return;
      }

      // One shared scrub-lag value for every scroll-scrubbed animation on
      // this page — previously these ranged from .6 to .9, and one spot
      // (.ac-amenities' main driver) used `true` (0 lag, tracks the
      // scrollbar 1:1) by oversight. Since scrub lag is what makes a
      // scroll-linked animation feel "heavy" vs "snappy," that spread is
      // exactly why different sections read as scrolling at different
      // speeds even though Lenis itself smooths the raw input identically
      // everywhere. One constant keeps every section's *feel* consistent,
      // and future additions consistent by construction.
      const SCRUB = .7;

      // ---- Intro: sky first, then the brandmark reveals over it, then
      // the elevation and cloud assemble together (the tower rising into
      // place naturally starts occluding the brandmark text as it goes,
      // instead of everything landing at once). ----
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from('.ac-sky--day', { scale: 1.24, opacity: 0, duration: 1.5 }, .1)
        .from('.ac-brandmark-line', { yPercent: 110, duration: 1.1, stagger: .12 }, .6)
        // A beat later than before — the brandmark settles in first,
        // then the elevation rises into frame, instead of both landing
        // almost on top of each other.
        .from('.ac-building--day', { y: 190, scale: 1.1, opacity: 0, duration: 1.5, ease: 'power4.out' }, 1.3)
        .from('.ac-copy', { y: 22, opacity: 0, duration: .8 }, 1.85)
        .call(() => heroFoldRef.current?.play(), [], 1.85);

      // ---- Scroll: sky and elevation dissolve into their night imagery
      // as the pinned scene plays out. Every tween here is ease:'none' —
      // scrub already supplies the easing (scroll position IS the
      // timeline's playhead), so an eased tween inside a scrubbed one
      // fights the scroll input and reads as laggy/uneven rather than
      // smooth. A small rotateY + z push gives the crossfade a sense of
      // depth without the cost of animating filter:blur, and each layer
      // drifts at its own rate (sky slowest, building faster) for a
      // genuine layered-depth parallax underneath it. ----
      gsap.set('.ac-sky--night, .ac-building--night', { rotateY: 5, z: -70, transformPerspective: 2000, transformOrigin: '50% 50%' });
      gsap.set('.ac-sky--day, .ac-building--day', { transformPerspective: 2000, transformOrigin: '50% 50%' });

      const transition = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.ac-scene', start: 'top top', end: 'bottom bottom', scrub: SCRUB } });
      transition
        .to('.ac-sky--day', { opacity: 0, scale: 1.1, rotateY: -5, z: -70 }, 0)
        .to('.ac-sky--night', { opacity: 1, scale: 1.02, rotateY: 0, z: 0 }, 0)
        .to('.ac-building--day', { opacity: 0, scale: 1.04, rotateY: -4, z: -50 }, .1)
        .to('.ac-building--night', { opacity: 1, scale: 1, rotateY: 0, z: 0 }, .1)
        .to('.ac-copy', { yPercent: -18, opacity: .5 }, .3);

      const parallax = { scrollTrigger: { trigger: '.ac-scene', start: 'top top', end: 'bottom bottom', scrub: SCRUB } };
      gsap.to('.ac-sky--day, .ac-sky--night', { yPercent: -4, ease: 'none', ...parallax });
      gsap.to('.ac-building--day, .ac-building--night', { yPercent: -9, ease: 'none', ...parallax });

      // ---- Velumuri section (company intro, right after the hero): a
      // single centred column that reveals in sequence (eyebrow, FoldText
      // headline, body, facts, CTA) on one trigger, then drifts slightly
      // for parallax — the same vocabulary as .ac-tallest's copy. ----
      const velumuriReveal = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: '.ac-velumuri', start: 'top 72%', once: true },
      });
      velumuriReveal
        .from('.ac-velumuri-copy .ac-eyebrow', { y: 16, opacity: 0, duration: .8 }, 0)
        .call(() => velumuriFoldRef.current?.play(), [], .15)
        .from('.ac-velumuri-body', { y: 20, opacity: 0, duration: .9 }, .55)
        .from('.ac-velumuri-fact', { y: 18, opacity: 0, duration: .7, stagger: .1 }, .8)
        .from('.ac-velumuri-cta', { y: 14, opacity: 0, duration: .7 }, 1.05);
      gsap.to('.ac-velumuri-copy', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.ac-velumuri', start: 'top bottom', end: 'bottom top', scrub: SCRUB } });

      // ---- Tallest-building section: the two halves get distinct scroll
      // reveals. Right (image): the same bottom-to-top clip-path wipe used
      // for every masked image elsewhere on the site. Left (copy): a true
      // text reveal — the eyebrow fades up, then each headline line slides
      // up out of its mask (matching .ac-brandmark-line in the hero), then
      // the paragraph fades up — all on the same trigger so both sides
      // resolve together, then both drift at slightly different rates for
      // parallax. ----
      gsap.fromTo('.ac-tallest-outline', { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.4,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.ac-tallest', start: 'top 75%', once: true },
      });
      const copyReveal = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: '.ac-tallest', start: 'top 75%', once: true },
      });
      copyReveal
        .from('.ac-tallest-copy .ac-eyebrow', { y: 16, opacity: 0, duration: .8 }, 0)
        .call(() => tallestFoldRef.current?.play(), [], .15)
        .from('.ac-tallest-copy .ac-tallest-body', { y: 20, opacity: 0, duration: .9 }, .55)
        .from('.ac-tallest-stat', { y: 20, opacity: 0, duration: .7, stagger: .1 }, .85);

      // Numeric stats (Acres, Sq.ft Project Area) count up from 0 as they
      // reveal — added into the same timeline/trigger as the stagger
      // above (not a separate ScrollTrigger) so each number starts right
      // as its own stat fades into place, once, the first time this
      // section is scrolled into view.
      gsap.utils.toArray<HTMLElement>('.ac-tallest-stat-value[data-count-to]').forEach((el, i) => {
        const to = parseFloat(el.dataset.countTo || '0');
        const decimals = parseInt(el.dataset.countDecimals || '0', 10);
        const counter = { val: 0 };
        copyReveal.to(counter, {
          val: to,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = formatCount(counter.val, decimals); },
        }, .9 + i * .15);
      });

      gsap.to('.ac-tallest-outline', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.ac-tallest', start: 'top bottom', end: 'bottom top', scrub: SCRUB } });
      gsap.to('.ac-tallest-copy', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.ac-tallest', start: 'top bottom', end: 'bottom top', scrub: SCRUB } });

      // Headline + body words start dim gray and light up to white/cream
      // in sequence as the section scrolls through view — layered on top
      // of the line-reveal above for extra depth.
      gsap.to('.ac-tallest-copy .ac-word', {
        color: '#faf4e6',
        ease: 'none',
        stagger: .04,
        scrollTrigger: { trigger: '.ac-tallest-copy', start: 'top 80%', end: 'top 20%', scrub: SCRUB },
      });

      // The site nav is suppressed over the immersive pinned hero (see
      // .ac-experience's CSS) and reintroduced once the second section
      // (.ac-velumuri) starts appearing — hides again on scrolling back
      // up into the hero.
      const navHeader = document.getElementById('site-header');
      if (navHeader) {
        ScrollTrigger.create({
          trigger: '.ac-velumuri',
          start: 'top 85%',
          onEnter: () => navHeader.classList.add('ac-nav-visible'),
          onLeaveBack: () => navHeader.classList.remove('ac-nav-visible'),
        });
      }

      // ---- Two-point highlight reel: pinned for one full scroll length,
      // the two background images AND each list item's own text block
      // wipe in via the exact same clip-path technique, driven off the
      // same raw scroll progress — one right-to-left sweep (reversing
      // left-to-right on scroll up) that carries the photo crossfade and
      // the text change together in lockstep, rather than the photo
      // wiping on its own clock while the text faded/slid on a separate
      // eased CSS-transition clock. ----
      const highlightItems = gsap.utils.toArray<HTMLElement>('.ac-highlight-item');
      gsap.set('.ac-highlight-bg--1', { clipPath: 'inset(0 0 0 100%)' });

      // .ac-highlights is pulled up 100vh underneath .ac-tallest (see
      // brand.css) so its sticky inner div can lock into place while
      // still hidden, for the curtain-overlap effect — but that means
      // its own top-to-bottom scroll range starts a full viewport early,
      // still covered by .ac-tallest. Driving the crossfade off that
      // full range burned through the first item's "screen time" while
      // it was invisible, so it was already mid/past-crossfade the
      // instant .ac-tallest cleared. Instead, start this range only once
      // .ac-tallest's bottom actually clears the viewport (the curtain
      // has fully lifted), and run the crossfade itself over exactly one
      // more viewport height (an `end` function so it's recalculated in
      // real px on resize, not a fixed number) — .ac-highlights' total
      // height (brand.css) no longer reserves any further viewport
      // beyond that, so the section releases right as the crossfade
      // finishes instead of holding an extra full screen of static
      // scroll first (that hold used to make this section feel like
      // "too much scrolling" once "Godavari View Point" had already
      // finished revealing).
      const highlightRange = { trigger: '.ac-tallest', start: 'bottom top', end: () => `+=${window.innerHeight}` };

      // The label must show only once its own photo has actually
      // finished revealing, not partway through the wipe — so the
      // threshold sits near the *end* of the wipe (0.88), not the
      // midpoint. Symmetric gap (0.12 back the other way) is still
      // hysteresis, not the midpoint-flicker kind — it just also keeps
      // the reverse (scroll up) flip from firing the instant the wipe
      // retreats a hair.
      let highlightActive = 0;
      ScrollTrigger.create({
        ...highlightRange,
        onUpdate: (self) => {
          // Continuous, exact self.progress for the photo wipe — a wipe
          // is never at risk of "flickering," and any lag would just
          // make it visibly lag behind the actual scroll position.
          gsap.set('.ac-highlight-bg--1', { clipPath: `inset(0 0 0 ${(1 - self.progress) * 100}%)` });
          const prevActive = highlightActive;
          if (highlightActive === 0 && self.progress > 0.88) highlightActive = 1;
          else if (highlightActive === 1 && self.progress < 0.12) highlightActive = 0;
          if (highlightActive !== prevActive) {
            highlightItems.forEach((el, i) => el.classList.toggle('is-active', i === highlightActive));
            highlightFoldRefs.current[highlightActive]?.play();
          }
        },
      });
      // The item-0 label needs its own one-shot entrance trigger (the
      // ScrollTrigger above only *changes* highlightActive, so it never
      // fires for item 0, which starts active). This must fire at
      // exactly the same moment highlightRange itself starts — trigger:
      // '.ac-highlights', start: 'top 80%' looks like the obvious choice
      // but is wrong for the same reason spelled out above: .ac-highlights
      // is pulled up 100vh and its own top crosses 80% while still
      // covered by .ac-tallest's curtain, so the fold would fire (and
      // fully finish) while invisible — which is exactly the "the text
      // animation never plays" bug this replaces.
      ScrollTrigger.create({
        ...highlightRange,
        once: true,
        onEnter: () => {
          highlightItems.forEach((el, i) => el.classList.toggle('is-active', i === 0));
          highlightFoldRefs.current[0]?.play();
        },
      });

      // ---- Open-space intro: no background photo any more — a plain
      // centered statement instead. The paragraph eases up into place
      // once, on entry (a longer duration + gentler ease than before,
      // so it settles rather than snapping in), then each word still
      // lights up from dim to full cream in sequence as the section
      // scrolls through view, layered on top for a genuine scroll-
      // driven second stage rather than a single one-shot fade. Not
      // pinned: a single scroll-past beat ahead of the pinned
      // three-stage sequence below. ----
      gsap.from('.ac-podium-intro-copy p', {
        y: 36, opacity: 0, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.ac-podium-intro', start: 'top 70%', once: true },
      });
      gsap.to('.ac-podium-intro-copy .ac-word', {
        color: '#faf4e6',
        ease: 'none',
        stagger: .03,
        scrollTrigger: { trigger: '.ac-podium-intro', start: 'top 55%', end: 'top -40%', scrub: SCRUB },
      });

      // ---- Podium / Clubhouse / Terrace: pinned for three viewport
      // heights of scroll (reference: parallex_effect.mp4 — a blurred,
      // slow-drifting backdrop behind a small sharp-focus card pinned
      // beside it, both swapping through a sequence as you keep
      // scrolling). One continuous scroll-driven progress value (0→3)
      // drives the backdrop (slow layer) and the card's photo (faster,
      // its own zoom/drift layer) through a three-way crossfade, while
      // the card's index/label/copy (subtle layer) swap at each stage's
      // midpoint — three depths moving at three different rates, not
      // one transform applied everywhere. matchMedia keeps the zoom/
      // drift distances gentler on narrow viewports instead of forcing
      // the desktop values down. Nested inside this component's own
      // gsap.context() so it's still reverted on unmount (GSAP tracks
      // a matchMedia created while a context is active). Both isMobile
      // and isDesktop are listed (not just isMobile) because
      // MatchMedia.add()'s callback only fires once at least one listed
      // condition is *currently true* — with only isMobile declared, it
      // would silently never run at all on desktop-width viewports. ----
      const amenitiesMM = gsap.matchMedia();
      amenitiesMM.add({ isMobile: '(max-width: 767px)', isDesktop: '(min-width: 768px)' }, (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };
        const isCompact = isMobile;
        const zoomFrom = isCompact ? 1.05 : 1.1;
        const driftFrom = isCompact ? 3 : 6;

        gsap.fromTo('.ac-amenity-card', { clipPath: 'inset(100% 0 0 0)', y: 20 }, {
          clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.1, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.ac-amenities', start: 'top 70%', once: true },
          onStart: () => amenityFoldRefs.current[0]?.play(),
        });

        const amenityBgs = gsap.utils.toArray<HTMLElement>('.ac-amenity-bg');
        const amenityCardImgs = gsap.utils.toArray<HTMLElement>('.ac-amenity-card-img');
        const amenityStages = gsap.utils.toArray<HTMLElement>('.ac-amenity-stage');
        const stageCount = amenityStages.length;
        // The sweep line is defined against a backdrop layer's own
        // rendered box (not .ac-amenities-sticky) — .ac-amenity-bg is
        // deliberately oversized (inset:-8% -4% in brand.css, for the
        // parallax drift's overscan) so its box is ~16% taller than the
        // sticky container; referencing the sticky instead would leave a
        // small but visible systematic offset between where the
        // backdrop's own clip-path actually draws the line and where
        // this maps it onto the card. All bg layers share identical
        // geometry, so any one of them works as the reference.
        const cardMediaEl = element.querySelector<HTMLElement>('.ac-amenity-card-media');

        // Set the resting clip state up front so there's no flash of the
        // old (opacity-based) look before the first scroll-driven update
        // — now shared by both the backdrop and the card's own photos,
        // since both use the same clip-path reveal.
        const setRestingClip = (el: HTMLElement, i: number) => {
          gsap.set(el, { clipPath: i === 0 ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' });
        };
        amenityBgs.forEach(setRestingClip);
        amenityCardImgs.forEach(setRestingClip);

        // The clip-path wipe above only drives *when* each backdrop
        // reveals — on its own that read as a flat, static swap. This
        // adds the actual parallax: all three backdrop layers drift
        // slowly upward together across the *entire* pinned range (the
        // "slow" depth layer, same idea as the hero's sky/building drift
        // via a separate continuous scrub tween), while the sharp card
        // in front keeps its own faster zoom/drift below — two layers
        // moving at two different rates is what makes it read as
        // parallax rather than a plain crossfade.
        gsap.to('.ac-amenity-bg', {
          yPercent: isCompact ? -4 : -7,
          ease: 'none',
          scrollTrigger: { trigger: '.ac-amenities', start: 'top top', end: 'bottom bottom', scrub: SCRUB },
        });

        // This was the biggest source of the page's inconsistent scroll
        // feel: every other scroll-linked animation on the page uses a
        // lagged scrub, but this one — driving the whole crossfade/wipe/
        // parallax sequence for Podium/Clubhouse/Terrace — used `true`
        // (0 lag, tracks the scrollbar 1:1), so this section alone read
        // as noticeably snappier/"faster" than its neighbors. Switching
        // it to the shared SCRUB doesn't touch the bg/card pixel-sync
        // logic below (both read the same self.progress each frame
        // regardless of how laggy that shared value is).
        // Tracks which stage's text is showing, with hysteresis (same
        // reasoning as .ac-highlights above) so scroll jitter right at a
        // transition's midpoint can't flicker the label back and forth.
        let amenityActive = 0;
        ScrollTrigger.create({
          trigger: '.ac-amenities',
          start: 'top top',
          end: 'bottom bottom',
          scrub: SCRUB,
          onUpdate: (self) => {
            const p = self.progress * stageCount;
            const idx = Math.min(stageCount - 1, Math.floor(p));
            const frac = idx === stageCount - 1 ? 0 : Math.min(1, p - idx);
            // Each layer wipes in bottom-to-top over the one before it
            // (clip-path, not opacity) — layer 0 stays permanently fully
            // revealed as the base, layer i>0 reveals as `revealed` (driven
            // directly by scroll position every frame, not a triggered
            // tween) goes 0→1. Because it's the *same* value driving this
            // every frame regardless of scroll direction, scrolling back
            // up runs it 1→0 and the clip-path naturally retreats
            // top-to-bottom — no separate "scroll up" case needed.
            //
            // `revealed(i)` (0→1) drives both layers, so they're always
            // in step *in time* — but a clip-path inset percentage is
            // relative to each element's *own* box, so applying the same
            // percentage to the full-bleed backdrop and to the small
            // floating card still wipes them at two different on-screen
            // heights (the actual bug the screenshot showed: the seam
            // line sits at a different height on the card than on the
            // backdrop, even though both reach 0%/100% at the same
            // moment). Fixed by computing ONE sweep line in real pixels
            // against a backdrop layer's own rendered box (see the note
            // by bgRect below on why not .ac-amenities-sticky), then
            // re-expressing that same absolute line as a percentage of
            // the card's own (much smaller, differently-positioned) box
            // — so it's the same physical edge cutting across both at
            // once, top to bottom, not two independently-normalized
            // wipes.
            const revealed = (i: number) => (i <= idx ? 1 : i === idx + 1 ? frac : 0);
            const revealClip = (i: number) => `inset(${(1 - revealed(i)) * 100}% 0 0 0)`;
            amenityBgs.forEach((el, i) => {
              gsap.set(el, { clipPath: revealClip(i) });
            });
            const bgRect = amenityBgs[0]?.getBoundingClientRect();
            const cardRect = cardMediaEl?.getBoundingClientRect();
            amenityCardImgs.forEach((el, i) => {
              const r = revealed(i);
              let cardInset = (1 - r) * 100;
              if (bgRect && cardRect && bgRect.height > 0 && cardRect.height > 0) {
                const sweepLineY = bgRect.top + (1 - r) * bgRect.height;
                cardInset = Math.min(100, Math.max(0, ((sweepLineY - cardRect.top) / cardRect.height) * 100));
              }
              gsap.set(el, {
                clipPath: `inset(${cardInset}% 0 0 0)`,
                scale: zoomFrom - r * (zoomFrom - 1),
                yPercent: driftFrom - r * driftFrom,
              });
            });
            const prevAmenityActive = amenityActive;
            if (p > amenityActive + 0.55 && amenityActive < stageCount - 1) amenityActive++;
            else if (p < amenityActive - 0.55 && amenityActive > 0) amenityActive--;
            amenityStages.forEach((el, i) => el.classList.toggle('is-active', i === amenityActive));
            if (amenityActive !== prevAmenityActive) amenityFoldRefs.current[amenityActive]?.play();
          },
        });
      });

      // ---- Hotspot explorer: pointer markers rise up (bottom to top)
      // into place once, the same "scroll reveals it" one-shot pattern
      // as .ac-tallest's stats and .ac-cards' eyebrow (below) — not a
      // continuous scrub, since the section's only continuously-driven
      // interaction is the CSS :has() hover swap (see brand.css), and
      // scrubbing the entrance to scroll position too would fight a
      // viewer who hovers a marker before the reveal has finished
      // playing. start:'top top' (not, say, 'top 75%') matters here:
      // .ac-points-sticky itself only fades in at that same point (its
      // .is-fixed-visible toggle below), so triggering this any earlier
      // played the whole reveal out before the container was even
      // visible — markers would already be sitting in their resting
      // state, with no reveal visible at all, by the time you could see
      // them. The .35s head start (delay) lets that container fade-in
      // (.25s, brand.css) mostly clear before the markers themselves
      // start rising, so the two reveals read as one clear sequence
      // rather than fighting each other. ----
      gsap.set('.ac-points-eyebrow', { opacity: 0, y: 60 });
      // Each marker's anchor shift (so its dot lands exactly on the
      // inline left/top from POINT_POSITIONS) lives here as xPercent/
      // yPercent rather than in CSS: GSAP folds any CSS `translate` on an
      // element it animates into its own transform, and drops the
      // vertical part of a percentage pair while doing so — so a plain
      // `translate: -50% -100%` in brand.css ended up as x-only.
      // Centred on the anchor horizontally, bottom edge (the dot) on it
      // vertically — which, with the leader as long as `top`, puts every
      // label on the container's top edge.
      gsap.set('.ac-point', { opacity: 0, y: 60, xPercent: -50, yPercent: -100 });
      ScrollTrigger.create({
        trigger: '.ac-points',
        start: 'top top',
        once: true,
        onEnter: () => {
          gsap.to('.ac-points-eyebrow', { opacity: 1, y: 0, duration: .7, ease: 'power3.out', delay: .35 });
          gsap.to('.ac-point', { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .18, delay: .45 });
        },
      });

      // The fixed "scroll down" badge would otherwise sit right over
      // this section's own markers/copy — same body-class toggle
      // .ac-cards-active uses below, scoped to just .ac-points' own
      // 220vh dwell (not the longer .is-fixed-visible span its backdrop
      // stays on screen for) since that's the range its own content is
      // actually the thing on screen competing with the badge.
      ScrollTrigger.create({
        trigger: '.ac-points',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          document.body.classList.toggle('ac-points-active', self.isActive);
        },
      });

      // ---- .ac-points' backdrop is plain position:sticky by default
      // (brand.css) — same as .ac-amenities-sticky/.ac-cards-sticky —
      // so its own entrance is the native, gradual, zero-black sticky
      // reveal instead of a fixed layer popping in (tried both trigger
      // timings for that first: late, and its own black CSS fallback
      // background showed first; early, and it abruptly covered
      // .ac-podium-intro's still-visible tail — a position:fixed layer
      // is always either fully covering the viewport or not, with no
      // "partially scrolled in" state to match either way). Right as
      // this container reaches its own natural un-stick point (bottom
      // bottom — the same point .ac-cards' own unstick, used for the
      // amenities-active range above, is computed from) is the one
      // moment it's guaranteed to already be sitting at top:0
      // full-screen, so switching it to .is-frozen (position:fixed)
      // exactly there is an invisible hand-off, not a jump — it keeps
      // showing that same frame instead of actually scrolling away,
      // for .ac-amenities/.ac-cards to then rise up and over. ----
      ScrollTrigger.create({
        trigger: '.ac-points',
        start: 'bottom bottom',
        endTrigger: '.ac-cards',
        end: 'bottom bottom',
        toggleClass: { targets: '.ac-points-sticky', className: 'is-frozen' },
      });

      // Both incoming sections rise the last little bit into place —
      // rounded top corners (brand.css) peeking the still-fixed
      // .ac-points photo at the edges as they settle — over the window
      // where their own top edge crosses from the bottom of the
      // viewport to the top, i.e. right before each locks into its own
      // pinned dwell. ease:'none' since scrub already supplies the
      // motion, same reasoning as the hero's day/night crossfade above.
      gsap.fromTo('.ac-amenities-sticky', { yPercent: 14 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.ac-amenities', start: 'top bottom', end: 'top top', scrub: SCRUB },
      });
      gsap.fromTo('.ac-cards-sticky', { yPercent: 14 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.ac-cards', start: 'top bottom', end: 'top top', scrub: SCRUB },
      });

      // ---- Amenities showcase: pinned for three viewport heights of
      // scroll (reference: amenities.mp4). Each category gets one full
      // "unit" of scroll (self.progress * stageCount, same shape as
      // .ac-amenities' crossfade above), subdivided into three phases that
      // all read off that same continuous value — nothing here is a CSS
      // transition firing off a class flip, everything is set every
      // scroll frame so it tracks the scrollbar 1:1:
      //   0.00–0.35  the WHOLE next .ac-cards-stage (photo, title, and
      //              whatever the panel is doing) wipes up over the
      //              previous one, clip-path top→bottom, same technique
      //              as .ac-amenities — since later stages sit later in
      //              the DOM (equal z-index, so DOM order wins ties),
      //              this one wipe covers the previous stage's photo AND
      //              its still-open panel in one motion, so nothing ever
      //              needs to close/slide back out first. The photo also
      //              settles from a slight zoom to its resting scale, and
      //              the title fades/lifts in over it, full-bleed
      //   0.35–0.55  the stats panel wipes in from the right edge — a
      //              clip-path reveal on the panel itself (not
      //              opacity+slide), so the photo visibly gives up half
      //              the screen to it, edge moving right→left, exactly
      //              like a sliding door — and the title fades back out
      //              as it does
      //   0.55–1.00  hold: panel fully open for the rest of this
      //              category's dwell, each highlight item having wiped
      //              in bottom-to-top in its own third of the open window
      // The very first category has no previous stage to wipe in from, so
      // it's exempted from the 0–0.35 phase and starts already "arrived"
      // (matching the reference's own opening frame). ----
      gsap.from('.ac-cards-eyebrow-block', {
        y: 16, opacity: 0, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-cards', start: 'top 70%', once: true },
        onComplete: () => cardsFoldRef.current?.play(),
      });

      const cardsStages = gsap.utils.toArray<HTMLElement>('.ac-cards-stage');
      const cardsTitles = gsap.utils.toArray<HTMLElement>('.ac-cards-stage-title');
      const cardsPanels = gsap.utils.toArray<HTMLElement>('.ac-cards-stage-panel');
      const cardsStageCount = cardsStages.length;
      const ZOOM_FROM = 1.12;
      const CROSSFADE_END = 0.3;
      // Widened from the original 0.35–0.55 (a 0.2-unit window, only
      // ~10% of .ac-cards' whole scroll range per category) — the panel
      // wipe and its item-by-item stagger were sharing so little scroll
      // distance that both read as snapping in almost immediately rather
      // than tracking the scroll. 0.3–0.8 gives the same motion 2.5x the
      // room to play out over.
      const PANEL_OPEN_END = 0.8;

      gsap.set(cardsStages, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(cardsStages[0], { clipPath: 'inset(0% 0 0 0)' });
      gsap.set('.ac-cards-stage-bg img', { scale: ZOOM_FROM });
      gsap.set(cardsStages[0].querySelector('.ac-cards-stage-bg img'), { scale: 1 });
      gsap.set(cardsTitles, { opacity: 0, y: 24 });
      gsap.set(cardsPanels, { clipPath: 'inset(0 0 0 100%)' });
      gsap.set('.ac-cards-stage-list li', { clipPath: 'inset(100% 0 0 0)', opacity: 0 });

      const applyCardsProgress = (self: ScrollTrigger) => {
        const p = self.progress * cardsStageCount;
        const idx = Math.min(cardsStageCount - 1, Math.floor(p));
        const isLast = idx === cardsStageCount - 1;
        const local = isLast ? Math.min(1, p - idx) : p - idx;

        const crossfadeFrac = idx === 0 ? 1 : Math.min(1, local / CROSSFADE_END);
        // Monotonic — once a stage has wiped fully in it stays "revealed"
        // (it's simply covered by whichever comes after, panel and all).
        const revealed = (i: number) => (i < idx ? 1 : i === idx ? crossfadeFrac : 0);

        // Rises once the wipe completes, then holds at 1 for the rest of
        // this category's dwell — no closing phase, since the next
        // category's own wipe (above) is what retires it, not a reverse
        // of this animation.
        const panelOpen =
          local < CROSSFADE_END ? 0 : local < PANEL_OPEN_END ? (local - CROSSFADE_END) / (PANEL_OPEN_END - CROSSFADE_END) : 1;

        cardsStages.forEach((el, i) => {
          const r = revealed(i);
          gsap.set(el, { clipPath: `inset(${(1 - r) * 100}% 0 0 0)` });
          const img = el.querySelector('.ac-cards-stage-bg img');
          if (img) gsap.set(img, { scale: ZOOM_FROM - r * (ZOOM_FROM - 1) });
        });
        // Only the current stage's title/panel/list are ever touched —
        // a past stage's is simply left at whatever it was (fully open),
        // since it's already covered by the current stage's own clip-path
        // above. Resetting it back to "closed" every frame (as this used
        // to) snapped it shut the instant idx advanced, one frame before
        // the incoming stage's own wipe had covered anything — a visible
        // flash of "panel slams shut, bare photo, then next thing wipes
        // in" that read as going backwards instead of straight forward.
        // Stays visible once it's faded in, panel open or not — hiding
        // it while the panel is open (an earlier version multiplied this
        // by `1 - panelOpen`) meant there was no label on screen telling
        // you which category's amenity list you were looking at.
        gsap.set(cardsTitles[idx], { opacity: crossfadeFrac, y: (1 - crossfadeFrac) * 24 });
        gsap.set(cardsPanels[idx], { clipPath: `inset(0 0 0 ${(1 - panelOpen) * 100}%)` });
        const items = cardsPanels[idx].querySelectorAll<HTMLElement>('.ac-cards-stage-list li');
        items.forEach((li, liIndex) => {
          const start = liIndex / items.length;
          const end = (liIndex + 1) / items.length;
          const t = Math.max(0, Math.min(1, (panelOpen - start) / (end - start)));
          gsap.set(li, { clipPath: `inset(${(1 - t) * 100}% 0 0 0)`, opacity: t > 0.02 ? 1 : 0 });
        });

        if (idx !== cardsActive) {
          cardsActive = idx;
          cardsStages.forEach((el, i) => el.classList.toggle('is-active', i === cardsActive));
          cardsStageFoldRefs.current[cardsActive]?.play();
          // Only the active stage's items ever have pointer-events (the
          // rest are pointer-events:none while clipped shut above), so
          // whatever the hover-preview card was last showing belonged to
          // a list that just stopped being interactive — always safe to
          // snap it to the new stage's own photo here.
          if (previewImg) previewImg.src = CARDS_STAGES[cardsActive].img;
        }
      };

      let cardsActive = 0;
      const cardsTrigger = ScrollTrigger.create({
        trigger: '.ac-cards',
        start: 'top top',
        end: 'bottom bottom',
        scrub: SCRUB,
        onUpdate: (self) => {
          applyCardsProgress(self);
          // The fixed "scroll down" badge (bottom-left, every page)
          // sits right where this section's own title/tagline live —
          // same body-class toggle brand.css already uses elsewhere to
          // hide it for the duration of one specific section. Driven
          // from here rather than onEnter/onLeave: those only fire on a
          // detected threshold *crossing*, which an instant (non-scroll-
          // event) jump straight to this section can land past without
          // ever triggering — self.isActive here is simply "are we
          // currently within start/end," recomputed every update
          // regardless of how we got there.
          document.body.classList.toggle('ac-cards-active', self.isActive);
        },
      });
      // Stage 0's fold-in needs its own one-shot entrance trigger — the
      // ScrollTrigger above only calls applyCardsProgress on scroll, so
      // the resting (pre-scroll) frame needs setting explicitly too.
      ScrollTrigger.create({
        trigger: '.ac-cards',
        start: 'top top',
        end: 'bottom bottom',
        once: true,
        onEnter: (self) => {
          cardsStages.forEach((el, i) => el.classList.toggle('is-active', i === 0));
          gsap.set(cardsTitles[0], { opacity: 1, y: 0 });
          cardsStageFoldRefs.current[0]?.play();
          applyCardsProgress(self);
        },
      });

      // ---- Amenity hover preview: a square photo card that eases after
      // the cursor while it's over any list item, swapping to that item's
      // own photo (data-img, from AMENITY_IMAGES) on enter. gsap.quickTo
      // (not a fresh tween per mousemove) so the card trails the pointer
      // smoothly at any event rate. Pointer-only (no hover on touch, and
      // below 901px the panel is static anyway), so nothing is wired up
      // there. Photos are pre-warmed so the first hover on each doesn't
      // flash an empty card while it loads.
      // On, not just on-hover: it used to sit at opacity 0 until a
      // visitor happened to hover a list item — nothing on screen hinted
      // the list was interactive at all, so most people never found it
      // (client feedback). It now rests visible, showing the active
      // stage's own photo (already the <img>'s default src in JSX), at a
      // fixed spot in the photo half clear of the eyebrow/title text —
      // a visible hint before any interaction, exactly what a first-time
      // visitor needs to realize hovering an item swaps the photo. It
      // still eases to the cursor on every mousemove in the sticky area
      // (not just over a list item) so it reads as "alive"/followable
      // the moment someone moves their mouse in this section, and on
      // leaving an item it settles back to the active stage's photo
      // instead of disappearing. ----
      const cardsSticky = element.querySelector<HTMLElement>('.ac-cards-sticky');
      const preview = element.querySelector<HTMLElement>('.ac-cards-preview');
      const previewImg = preview?.querySelector('img');
      if (cardsSticky && preview && previewImg && window.matchMedia('(hover: hover) and (min-width: 901px)').matches) {
        const items = gsap.utils.toArray<HTMLElement>('.ac-cards-stage-list li', element);
        new Set(items.map((li) => li.dataset.img).filter(Boolean) as string[]).forEach((src) => { const warm = new Image(); warm.src = src; });
        const stickyRect = cardsSticky.getBoundingClientRect();
        gsap.set(preview, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, x: stickyRect.width * 0.27, y: stickyRect.height * 0.5 });
        const xTo = gsap.quickTo(preview, 'x', { duration: .5, ease: 'power3.out' });
        const yTo = gsap.quickTo(preview, 'y', { duration: .5, ease: 'power3.out' });
        const onMove = (e: MouseEvent) => {
          const rect = cardsSticky.getBoundingClientRect();
          // Offset up-left of the pointer so the card sits beside the
          // item being read (over the photo half), not on top of it.
          xTo(e.clientX - rect.left - 190);
          yTo(e.clientY - rect.top - 40);
        };
        const onEnter = (e: Event) => {
          const src = (e.currentTarget as HTMLElement).dataset.img;
          if (src && previewImg.getAttribute('src') !== src) previewImg.src = src;
          gsap.fromTo(previewImg, { scale: 1.18 }, { scale: 1, duration: .7, ease: 'power3.out', overwrite: 'auto' });
        };
        const showActiveStagePhoto = () => {
          const src = CARDS_STAGES[cardsActive].img;
          if (previewImg.getAttribute('src') !== src) previewImg.src = src;
        };
        cardsSticky.addEventListener('mousemove', onMove, { passive: true });
        items.forEach((li) => { li.addEventListener('mouseenter', onEnter); li.addEventListener('mouseleave', showActiveStagePhoto); });
        // A list can scroll out from under a stationary pointer without
        // the browser ever firing mouseleave — same fallback to the
        // active stage's photo whenever the section itself is left.
        ScrollTrigger.create({ trigger: '.ac-cards', start: 'top top', end: 'bottom bottom', onLeave: showActiveStagePhoto, onLeaveBack: showActiveStagePhoto });
        extraCleanup.push(() => {
          cardsSticky.removeEventListener('mousemove', onMove);
          items.forEach((li) => { li.removeEventListener('mouseenter', onEnter); li.removeEventListener('mouseleave', showActiveStagePhoto); });
        });
      }

      // ---- Location: a plain one-shot reveal, same shape as .ac-cards'
      // own eyebrow-block above — this section isn't pinned/scrubbed at
      // all (the pill filter is a live interaction, not a scroll
      // choreography), so it only needs an entrance, not a driver. ----
      gsap.from('.ac-location-bg', {
        scale: 1.12, opacity: 0, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-location', start: 'top 80%', once: true },
      });
      gsap.from('.ac-location-heading-block > .ac-eyebrow, .ac-location-heading', {
        y: 16, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-location', start: 'top 70%', once: true },
        onComplete: () => locationFoldRef.current?.play(),
      });
      gsap.from('.ac-location-pill', {
        y: 14, opacity: 0, duration: .6, stagger: .06, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-location', start: 'top 65%', once: true },
      });
      gsap.from('.ac-location-card', {
        y: 24, opacity: 0, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-location', start: 'top 65%', once: true },
      });
      gsap.from('.ac-location-list-item', {
        y: 14, opacity: 0, duration: .6, stagger: .06, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-location', start: 'top 60%', once: true },
      });

      // Same fixed "scroll down" badge overlap as .ac-points above —
      // this section's pills now sit at the very bottom of a full-bleed
      // viewport-height frame, right where the badge lives. Unlike
      // .ac-points/.ac-cards (each several viewport-heights tall, where
      // "top top"→"bottom bottom" is a long, meaningful pinned dwell),
      // .ac-location is only ~1 viewport tall — that same range would
      // be near-zero-length here — so this uses "top bottom"→"bottom
      // top" instead: active for the section's whole time anywhere on
      // screen, not a pin dwell it doesn't have.
      ScrollTrigger.create({
        trigger: '.ac-location',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          document.body.classList.toggle('ac-location-active', self.isActive);
        },
      });

      // ---- Floor plans: same plain one-shot reveal as .ac-location
      // above — a tab switch is a live interaction, not a scroll
      // choreography, so no driver needed here either. ----
      gsap.from('.ac-floorplans-inner > .ac-eyebrow, .ac-floorplans-heading', {
        y: 16, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-floorplans', start: 'top 80%', once: true },
        onComplete: () => floorplansFoldRef.current?.play(),
      });
      gsap.from('.ac-floorplans-tab', {
        y: 14, opacity: 0, duration: .6, stagger: .06, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-floorplans', start: 'top 70%', once: true },
      });
      gsap.from('.ac-floorplans-card', {
        y: 24, opacity: 0, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-floorplans', start: 'top 65%', once: true },
      });

      // ---- Snap-to-section for the plain-flow sections between the
      // pinned ones: .ac-scene/.ac-highlights/.ac-amenities/.ac-cards each
      // guarantee their own dwell time by pinning (a fast scroll gesture
      // can't cover their content faster than the scroll range they
      // reserve for it — .ac-cards joined this group once it became a
      // pinned three-stage amenities showcase instead of flowing content),
      // but .ac-tallest/.ac-podium-intro are ordinary flowing content with
      // no such floor — a fast fling blows straight through at whatever
      // speed the gesture had. Once Lenis's own momentum has nearly
      // settled (velocity below a small threshold, so this never fights
      // an in-progress fling) AND that resting point happens to sit just
      // inside one of these two, ease the rest of the way to align
      // exactly with its top — one scroll gesture reveals one section,
      // instead of leaving the viewport straddling two of them. ----
      const snapSelectors = ['.ac-tallest', '.ac-podium-intro'];
      // unlistenSnap is assigned asynchronously (inside the rAF below),
      // so snapCleanup — assigned synchronously, right here — has to
      // read it through this closure at *call* time rather than having
      // its value composed in now, or an unmount that happens to land
      // before the rAF has fired would capture and cancel nothing.
      let unlistenSnap: (() => void) | undefined;
      const snapRaf = requestAnimationFrame(() => {
        const lenis = getLenisInstance();
        if (!lenis) return;
        let snapping = false;
        unlistenSnap = lenis.on('scroll', () => {
          if (snapping || Math.abs(lenis.velocity) > 0.15) return;
          // .ac-cards: once a gesture settles anywhere inside a stage's
          // wipe/panel-open phase (local progress below PANEL_OPEN_END),
          // ease the rest of the way to that stage's fully-open hold —
          // so one scroll always lands on one complete amenity list,
          // never on a half-wiped photo or a half-slid panel. Stage
          // boundaries themselves (local ≈ 0, e.g. resting exactly at
          // the section's own top) are left alone.
          if (cardsTrigger.isActive) {
            const p = cardsTrigger.progress * cardsStageCount;
            const idx = Math.min(cardsStageCount - 1, Math.floor(p));
            const local = p - idx;
            if (local > 0.02 && local < PANEL_OPEN_END) {
              snapping = true;
              const range = cardsTrigger.end - cardsTrigger.start;
              lenis.scrollTo(cardsTrigger.start + (range * (idx + PANEL_OPEN_END + 0.03)) / cardsStageCount, {
                duration: 0.9,
                easing: (t: number) => 1 - Math.pow(1 - t, 3),
                onComplete: () => { snapping = false; },
              });
              return;
            }
          }
          for (const selector of snapSelectors) {
            const target = element.querySelector<HTMLElement>(selector);
            if (!target) continue;
            const top = target.getBoundingClientRect().top;
            // The catch zone scales with viewport height, not a fixed
            // pixel band: Lenis's own momentum easily carries a couple
            // hundred px *past* a boundary before velocity actually
            // decays below the threshold above, so a narrow fixed band
            // right at the edge almost never actually catches a real
            // fling (verified — it consistently sailed straight through
            // one). Up to 65% of a viewport in still reads as "just
            // arrived", not "already deep into reading this section".
            if (top < -4 && top > -window.innerHeight * .65) {
              snapping = true;
              lenis.scrollTo(target, {
                offset: 0,
                duration: 0.9,
                easing: (t: number) => 1 - Math.pow(1 - t, 3),
                onComplete: () => { snapping = false; },
              });
              break;
            }
          }
        });
      });
      snapCleanup = () => {
        cancelAnimationFrame(snapRaf);
        unlistenSnap?.();
      };
    }, element);
    return () => {
      context.revert();
      snapCleanup?.();
      extraCleanup.forEach((fn) => fn());
      document.getElementById('site-header')?.classList.remove('ac-nav-visible');
      document.body.classList.remove('ac-cards-active');
      document.body.classList.remove('ac-points-active');
      document.body.classList.remove('ac-location-active');
    };
  }, []);

  return (
    <div ref={root} className="ac-experience">
      <section className="ac-scene" aria-label="Achyutha day to night architectural experience">
        <div className="ac-sticky">
          <img className="ac-layer ac-sky--day" src={`${hero}dayview.jpg`} alt="" fetchPriority="high" />
          <img className="ac-layer ac-sky--night" src={`${hero}nightview.jpg`} alt="" />
          {/* Sits behind the elevation cutout (which is transparent
              everywhere but the building silhouette) and in front of the
              sky — so the tower naturally occludes the text wherever its
              roofline crosses it, magazine-cover style. DOM order (not
              z-index) is what does this: no z-index here means it stacks
              purely by position among these z-index:auto layers. */}
          <div className="ac-brandmark" aria-hidden="true">
            <span className="ac-brandmark-mask"><span className="ac-brandmark-line ac-brandmark-small">Velumuri</span></span>
            <span className="ac-brandmark-mask"><span className="ac-brandmark-line ac-brandmark-big">ACHYUTHA</span></span>
          </div>
          <img className="ac-layer ac-building ac-building--day" src={`${hero}day_elevation.png`} alt="Achyutha residences in daylight" fetchPriority="high" />
          <img className="ac-layer ac-building ac-building--night" src={`${hero}night_elevation.png`} alt="Achyutha residences illuminated at night" />
          {/* <img className="ac-layer ac-cloud ac-cloud--day" src={`${hero}day-right-cloud.png`} alt="" /> */}
          <div className="ac-copy"><p className="ac-eyebrow">Rajamahendravaram · Andhra Pradesh</p><h1><FoldText ref={heroFoldRef} text="Life, elevated." trigger="manual" splitBy="char" hinge="top" duration={.65} stagger={.045} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h1><p>An address shaped by light, landscape and a more considered way to come home.</p></div>
        </div>
      </section>

      {/* Company intro — a short, centred "who is Velumuri" beat between
          the immersive hero and the project story, leading to /about for
          the full chairman's message, mission and vision. Facts here are
          the ones already stated on the About page (building since 2008,
          16 delivered projects, CREDAI membership) — nothing new claimed;
          the headline is the chairman's own quote from that page. */}
      <section className="ac-velumuri" aria-labelledby="ac-velumuri-h">
        <div className="ac-velumuri-copy">
          <p className="ac-eyebrow">About Velumuri Infra</p>
          <h2 id="ac-velumuri-h"><FoldText ref={velumuriFoldRef} text={'We are not just builders,\nwe are family.'} trigger="manual" splitBy="line" hinge="top" duration={1.1} stagger={.12} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h2>
          <p className="ac-velumuri-body">Velumuri Infra has been building homes in Rajahmundry since 2008 &mdash; sixteen residential projects delivered on schedule, hundreds of families settled, and a name that has come to mean reliability. Achyutha is the next chapter of that promise.</p>
          <ul className="ac-velumuri-facts">
            <li className="ac-velumuri-fact"><span className="ac-velumuri-fact-value">16</span><span className="ac-velumuri-fact-label">Projects completed</span></li>
            <li className="ac-velumuri-fact"><span className="ac-velumuri-fact-value">18+</span><span className="ac-velumuri-fact-label">Years of experience</span></li>
            <li className="ac-velumuri-fact"><span className="ac-velumuri-fact-value">CREDAI</span><span className="ac-velumuri-fact-label">Member</span></li>
          </ul>
          <Link className="ac-velumuri-cta" href="/about">About Us <span className="ac-velumuri-cta-arrow" aria-hidden="true">&rarr;</span></Link>
        </div>
      </section>

      <section className="ac-tallest" aria-label="Rajahmundry's tallest building">
        <div className="ac-tallest-silk" aria-hidden="true">
          <Silk speed={4} scale={1} color="#242016" noiseIntensity={1.5} rotation={0} />
        </div>
        <div className="ac-tallest-outline" aria-hidden="true">
          {/* <img className="ac-tallest-sky" src={`${hero}dayview.jpg`} alt="" /> */}
          <img className="ac-tallest-building" src={`${hero}tallest-building.jpeg`} alt="" />
          {/* <img className="ac-tallest-cloud" src={`${hero}day-right-cloud.png`} alt="" /> */}
        </div>
        <div className="ac-tallest-copy">
          <p className="ac-eyebrow">A New Skyline</p>
          <h2><FoldText ref={tallestFoldRef} text={'Rajahmundry’s\nTallest Building.'} trigger="manual" splitBy="line" hinge="top" duration={1.1} stagger={.12} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h2>
          <p className="ac-tallest-body"><Words text="Rising above the city, Achyutha redefines the skyline of Rajahmundry — a landmark address built to be seen from every corner of the city it calls home." /></p>
          <div className="ac-tallest-stats">
            <div className="ac-tallest-stat">
              <span className="ac-tallest-stat-value" data-count-to="5.5" data-count-decimals="1">0</span>
              <span className="ac-tallest-stat-label">Acres</span>
            </div>
            <div className="ac-tallest-stat">
              <span className="ac-tallest-stat-value">Rajahmundry</span>
              <span className="ac-tallest-stat-label">Location</span>
            </div>
            <div className="ac-tallest-stat">
              <span className="ac-tallest-stat-value" data-count-to="3500">0</span>
              <span className="ac-tallest-stat-label">Sq.ft Project Area</span>
            </div>
            <div className="ac-tallest-stat">
              <span className="ac-tallest-stat-value">2 &amp; 3</span>
              <span className="ac-tallest-stat-label">BHK Residences</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ac-highlights" aria-label="What sets Achyutha apart">
        <div className="ac-highlights-sticky">
          <img className="ac-highlight-bg ac-highlight-bg--0" src={`${hero}luxuty-project.jpeg`} alt="" />
          <img className="ac-highlight-bg ac-highlight-bg--1" src={`${hero}bridge_view.jpeg`} alt="" />
          <ul className="ac-highlights-list">
            <li className="ac-highlight-item is-active">
              <div className="ac-highlight-head">
                {/* <span className="ac-highlight-index">01</span> */}
                <h3 className="ac-highlight-label"><FoldText ref={(el) => { highlightFoldRefs.current[0] = el; }} text={'Most Luxurious\nProject'} trigger="manual" splitBy="line" hinge="top" duration={.7} stagger={.1} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h3></div>
              <p className="ac-highlight-copy">Interiors, amenities and finishes curated to a standard the city hasn&rsquo;t seen before.</p>
            </li>
            <li className="ac-highlight-item">
              <div className="ac-highlight-head">
                {/* <span className="ac-highlight-index">02</span> */}
                <h3 className="ac-highlight-label"><FoldText ref={(el) => { highlightFoldRefs.current[1] = el; }} text={'Godavari\nView Point'} trigger="manual" splitBy="line" hinge="top" duration={.7} stagger={.1} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h3></div>
              <p className="ac-highlight-copy">Uninterrupted views of the river that has always defined this address.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="ac-podium-intro" aria-label="Open space at Achyutha">
        <div className="ac-podium-intro-copy">
          <p><Words text="Step out and the city softens beneath you. Golden light over the river, easy conversation drifting past sunset — every open space at Achyutha is shaped for the moments that don’t need an occasion, just room to breathe." /></p>
        </div>
      </section>

      {/* Hotspot explorer — reference: a full-bleed facade photo with
          labelled pointer markers (dot + vertical leader line rising to
          a name) hovering over the image; hovering a marker swaps both
          the background photo and the copy panel to that category.
          POINTS_STAGES = the three real, client-supplied amenity zones
          (CARDS_STAGES, shared with .ac-amenities/.ac-cards, own photos
          included) plus two more specific to this section
          (POINTS_EXTRA_STAGES: Commercial/Residential, with stand-in
          photos — see that const's own comment) — not folded into
          .ac-amenities' own per-category crossfade, which is hidden for
          now (see its own comment) specifically so it doesn't carry
          these two as well.
          The hover swap itself is pure CSS (:has(), same technique as
          body:has(.ac-experience) in brand.css) — a multi-state hover
          toggle doesn't need JS state; only the markers' one-shot
          scroll-in entrance below is GSAP. Placed first (not after
          .ac-amenities) so its backdrop — kept genuinely fixed rather
          than sticky, see .ac-points-sticky in brand.css — is already
          on screen for .ac-amenities and .ac-cards to visibly rise up
          and over as each scrolls into its own pinned dwell. */}
      <section className="ac-points" aria-label="Explore Achyutha by area">
        <div className="ac-points-sticky">
          {/* Default/resting backdrop — the full elevation shot, shown
              until a pointer is hovered. Painted first (no z-index
              needed: with none of .ac-points-stage/.ac-points-bg
              setting one either, plain DOM order alone decides paint
              order here) so every per-stage .ac-points-bg below simply
              draws over it once its own opacity goes to 1 on hover. */}
          <div className="ac-points-default-bg" aria-hidden="true"><img src={`${hero}night_elevation.jpeg`} alt="" /></div>
          {POINTS_STAGES.map((stage) => (
            <div className={`ac-points-stage ac-points-stage--${stage.key}`} key={stage.key}>
              {/* Each stage's own photo (POINTS_STAGES) — hovering a
                  pointer crossfades .ac-points-bg to that category's
                  actual image, same real photo-per-category crossfade
                  .ac-amenities/.ac-cards use, not one shared backdrop. */}
              <div className="ac-points-bg" aria-hidden="true"><img src={stage.img} alt="" /></div>
              <div className="ac-points-copy">
                <h3 className="ac-points-copy-label">{stage.label}</h3>
                <p className="ac-points-copy-text">{stage.copy}</p>
              </div>
            </div>
          ))}
          <div className="ac-points-scrim" aria-hidden="true" />

          <p className="ac-points-eyebrow">Hover to explore</p>

          {/* Markers are plain buttons (not links) so they're reachable
              by keyboard (:focus-visible mirrors :hover in brand.css) —
              they don't need an onClick because on touch viewports the
              whole hover mechanic is replaced by the stacked static
              fallback below (900px breakpoint), where every stage's
              photo and copy are simply always visible. */}
          <div className="ac-points-markers">
            {POINTS_STAGES.map((stage) => (
              <button
                type="button"
                key={stage.key}
                className={`ac-point ac-point--${stage.key}`}
                style={{ left: POINT_POSITIONS[stage.key].left, top: POINT_POSITIONS[stage.key].top, height: POINT_POSITIONS[stage.key].top }}
                aria-label={`Show ${stage.label}`}
              >
                <span className="ac-point-label">{stage.label}</span>
                <span className="ac-point-line" aria-hidden="true" />
                <span className="ac-point-dot" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hidden for now (brand.css: display:none), per explicit request —
          not deleted, since the intent is "come back to this later," not
          "this was wrong." The pointer-hover-jump mechanic and the
          Commercial/Residential pointers that briefly lived here both
          moved to .ac-points instead (POINTS_EXTRA_STAGES), so this is
          back to its original plain 3-stage Podium/Clubhouse/Terrace
          crossfade. */}
      <section className="ac-amenities" aria-label="Podium, clubhouse and terrace">
        <div className="ac-amenities-sticky">
          <div className="ac-amenity-bg ac-amenity-bg--0" aria-hidden="true"><img src={`${hero}podium.jpeg`} alt="" /></div>
          <div className="ac-amenity-bg ac-amenity-bg--1" aria-hidden="true"><img src={`${hero}clubhouse.jpeg`} alt="" /></div>
          <div className="ac-amenity-bg ac-amenity-bg--2" aria-hidden="true"><img src={`${hero}terrace.jpeg`} alt="" /></div>

          <div className="ac-amenity-card">
            <div className="ac-amenity-card-media">
              <img className="ac-amenity-card-img ac-amenity-card-img--0" src={`${hero}podium.jpeg`} alt="Achyutha's landscaped podium" />
              <img className="ac-amenity-card-img ac-amenity-card-img--1" src={`${hero}clubhouse.jpeg`} alt="Achyutha's clubhouse" />
              <img className="ac-amenity-card-img ac-amenity-card-img--2" src={`${hero}terrace.jpeg`} alt="Achyutha's terraces" />
            </div>
            <div className="ac-amenity-card-info">
              <div className="ac-amenity-stage is-active">
                <span className="ac-amenity-index">01</span>
                <h3 className="ac-amenity-label"><FoldText ref={(el) => { amenityFoldRefs.current[0] = el; }} text="Podium" trigger="manual" splitBy="char" hinge="top" duration={.6} stagger={.04} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h3>
                <p className="ac-amenity-copy">A landscaped podium level threading gardens, seating and play across the block.</p>
              </div>
              <div className="ac-amenity-stage">
                <span className="ac-amenity-index">02</span>
                <h3 className="ac-amenity-label"><FoldText ref={(el) => { amenityFoldRefs.current[1] = el; }} text="Clubhouse" trigger="manual" splitBy="char" hinge="top" duration={.6} stagger={.04} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h3>
                <p className="ac-amenity-copy">A clubhouse built for every mood — quiet mornings, and evenings with friends.</p>
              </div>
              <div className="ac-amenity-stage">
                <span className="ac-amenity-index">03</span>
                <h3 className="ac-amenity-label"><FoldText ref={(el) => { amenityFoldRefs.current[2] = el; }} text="Terrace" trigger="manual" splitBy="char" hinge="top" duration={.6} stagger={.04} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h3>
                <p className="ac-amenity-copy">Open-air terraces framed by the skyline, made for slow evenings above the city.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities showcase — reference: amenities.mp4 (a full-bleed photo
          + big serif title/tagline per category, then a text panel with a
          short divided list slides in as you keep scrolling, crossfading
          into the next category). Same Podium/Clubhouse/Terrace categories
          and photos as .ac-amenities above; the highlight-list items are
          real, already-used names from COMMUNITY_CARDS/gallery assets
          where one exists for that category, generic-safe copy otherwise
          (flagged for a creative-director/client pass before shipping).
          .ac-cards-track-wrap (the old gallery row) stays removed —
          COMMUNITY_CARDS itself is kept as-is for whenever that's ready
          to slot back in elsewhere. */}
      <section className="ac-cards" aria-label="Amenities at Achyutha">
        <div className="ac-cards-sticky">
          <div className="ac-cards-eyebrow-block">
            <p className="ac-eyebrow">Amenities</p>
            <h2><FoldText ref={cardsFoldRef} text="Every space, considered." trigger="manual" splitBy="word" hinge="top" duration={.7} stagger={.06} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h2>
          </div>

          {CARDS_STAGES.map((stage, i) => (
            <div className={`ac-cards-stage${i === 0 ? ' is-active' : ''}`} key={stage.key}>
              <div className="ac-cards-stage-bg" aria-hidden="true"><img src={stage.img} alt="" /></div>
              <div className="ac-cards-stage-scrim" aria-hidden="true" />
              <div className="ac-cards-stage-title">
                <h3 className="ac-cards-stage-label"><FoldText ref={(el) => { cardsStageFoldRefs.current[i] = el; }} text={stage.label} trigger="manual" splitBy="char" hinge="top" duration={.6} stagger={.04} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h3>
                <p className="ac-cards-stage-tagline">{stage.tagline}</p>
              </div>
              <div className="ac-cards-stage-panel">
                <p className="ac-cards-stage-copy">{stage.copy}</p>
                <ul className="ac-cards-stage-list">
                  {stage.items.map((item, itemIndex) => (
                    <li key={`${item}-${itemIndex}`} data-img={amenityImage(stage.img, item)}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Cursor-following preview card — one shared element for every
              amenity list item on this section; the driver in the effect
              above swaps its photo (from the hovered item's data-img) and
              eases it after the pointer. Hover-only (pointer devices ≥
              901px), so it's inert on touch layouts. */}
          <div className="ac-cards-preview" aria-hidden="true"><img src={CARDS_STAGES[0].img} alt="" /></div>
        </div>
      </section>

      {/* Location — full-bleed photo: heading vertically centered left, the pill
          filter bottom-left, and the location list in a glass card
          (same light glass as the pills) vertically centered right.
          Reuses that same real, already-vetted location data
          (lib/achyutha-locations.ts: CATEGORY_FILTERS, nearbyLocations)
          rather than inventing a second set of nearby places. */}
      <section className="ac-location" aria-label="Location and connectivity">
        <div className="ac-location-bg" aria-hidden="true"><img src={LOCATION_IMG} alt="" /></div>
        <div className="ac-location-scrim" aria-hidden="true" />

        <div className="ac-location-inner">
          <div className="ac-location-heading-block">
            <p className="ac-eyebrow">Location</p>
            <h2 className="ac-location-heading"><FoldText ref={locationFoldRef} text="Everything nearby." trigger="manual" splitBy="word" hinge="top" duration={.7} stagger={.06} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h2>
          </div>

          <div className="ac-location-pills" role="tablist" aria-label="Nearby categories">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                type="button"
                key={cat.id}
                role="tab"
                aria-selected={activeLocationCategory === cat.id}
                className={`ac-location-pill${activeLocationCategory === cat.id ? ' is-active' : ''}`}
                onClick={() => setActiveLocationCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="ac-location-card">
            <ul className="ac-location-list">
              {activeLocations.map((loc) => (
                <li key={loc.id} className="ac-location-list-item">
                  <span className="ac-location-list-name">{loc.name}</span>
                  <span className="ac-location-list-meta">{loc.distance} &middot; {loc.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Floor plans — placeholder-level per instruction: real,
          labelled per-block plans exist for the sibling Velumuri Vistas
          project (see FLOOR_PLAN_TYPES' own comment above) but aren't
          used here even blurred, since they're another client's actual
          floor plans, not Achyutha's. .ac-floorplans-mask is a purely
          abstract CSS blueprint-style grid instead, with a plain "ask
          us" card over it per plan type — no invented specs (BHK, sqft)
          attached to any one type. */}
      <section className="ac-floorplans" aria-label="Floor plans">
        <div className="ac-floorplans-inner">
          <p className="ac-eyebrow">Floor Plans</p>
          <h2 className="ac-floorplans-heading"><FoldText ref={floorplansFoldRef} text="Spaces, still taking shape." trigger="manual" splitBy="word" hinge="top" duration={.7} stagger={.06} ease="power3.out" fontSize="inherit" fontWeight="inherit" color="inherit" /></h2>

          <div className="ac-floorplans-tabs" role="tablist" aria-label="Towers">
            {FLOOR_PLAN_TYPES.map((plan) => (
              <button
                type="button"
                key={plan.id}
                role="tab"
                aria-selected={activeFloorPlan === plan.id}
                className={`ac-floorplans-tab${activeFloorPlan === plan.id ? ' is-active' : ''}`}
                onClick={() => setActiveFloorPlan(plan.id)}
              >
                {plan.label}
              </button>
            ))}
          </div>

          <div className="ac-floorplans-card">
            <div className="ac-floorplans-mask" aria-hidden="true" />
            <div className="ac-floorplans-overlay">
              <p className="ac-floorplans-tag">Coming soon</p>
              <p className="ac-floorplans-plan-label">{activeFloorPlanLabel}</p>
              <p className="ac-floorplans-text">Detailed layouts for this tower are being finalised — reach out and our team will share the latest floor plans.</p>
              <Link href="/contact" className="ac-floorplans-cta">Enquire Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="ac-after"><div><p>Achyutha</p><h2>From first light<br />to after dark.</h2></div><div className="ac-after__body">A residence designed to feel at home in every hour. Scroll back through the experience to see the architecture transform with the sky.<br /><Link href="/projects">Explore Achyutha projects</Link></div></section> */}
    </div>
  );
}
