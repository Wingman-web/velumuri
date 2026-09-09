'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { nearbyLocations, PROJECT_LOCATION, type LocationCategory } from '@/lib/achyutha-locations';
import { getLenisInstance } from '@/lib/lenis-instance';
import { CategoryFilter } from './CategoryFilter';
import { LocationList } from './LocationList';
import type { CameraControllerHandle } from './CameraController';
import { DAY_PALETTE, DEFAULT_FRAMING, applyCurvatureToPoint, computeFocusFraming, getSceneTier } from './locationConfig';
import './location-3d.css';

const LocationMap = dynamic(() => import('./LocationMap'), { ssr: false });

interface StoryKeyframe {
  t: number;
  categories: LocationCategory[];
}

export function LocationSection() {
  const root = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<CameraControllerHandle | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  // Mirrors `storyDone` state for the ScrollTrigger callback below,
  // which is created once on mount and would otherwise close over a
  // stale value of the state — the ref always reads the latest.
  const storyDoneRef = useRef(false);

  const [tier, setTier] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeFilter, setActiveFilter] = useState<LocationCategory | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [storyCategories, setStoryCategories] = useState<Set<LocationCategory>>(new Set());
  const [storyDone, setStoryDone] = useState(false);

  const activeLocation = useMemo(() => nearbyLocations.find((l) => l.id === activeId) ?? null, [activeId]);

  const visibleCategories = useMemo(() => {
    const set = new Set(storyCategories);
    if (activeFilter) set.add(activeFilter);
    return Array.from(set);
  }, [storyCategories, activeFilter]);

  // Categories reveal progressively as the visitor scrolls through the
  // pinned section — but the camera itself never moves on scroll (see
  // applyProgress below); only a deliberate POI click ever re-frames it.
  const keyframes = useMemo<StoryKeyframe[]>(
    () => [
      { t: 0, categories: [] },
      { t: 0.3, categories: ['healthcare'] },
      { t: 0.45, categories: ['shopping'] },
      { t: 0.6, categories: ['education'] },
      { t: 0.75, categories: ['transport', 'landmarks'] },
    ],
    [],
  );

  const markStoryDone = (done: boolean) => {
    storyDoneRef.current = done;
    setStoryDone(done);
  };

  // Section shell: root ref, viewport tier, IntersectionObserver
  // body-class toggle (hides the site's scroll-to-top badge while this
  // section is in view), and — desktop/tablet only — a scrub-driven
  // scroll story that flies the camera through the connectivity
  // network before handing control back to the visitor. Mirrors the
  // GSAP-context + reduced-motion pattern used across the rest of this
  // page (see achyutha-experience.tsx).
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const currentTier = getSceneTier(window.innerWidth);
    setTier(currentTier);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const skipStory = currentTier === 'mobile' || reducedMotion;
    markStoryDone(skipStory);

    const observer = new IntersectionObserver(
      ([entry]) => document.body.classList.toggle('loc3d-active', entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(element);

    gsap.registerPlugin(ScrollTrigger);

    // Holds the map in view for the section's full (taller-than-one-
    // viewport) scroll range. Uses ScrollTrigger's pin (position:fixed
    // under the hood), not CSS position:sticky — this site's <body>
    // has a mismatched overflow-x:clip/overflow-y:visible pair, which
    // per spec forces the visible axis to compute as auto, turning
    // body into a scroll container and silently breaking sticky
    // against the real viewport. pinSpacing is off because
    // `.loc3d-section`'s own height already supplies the scroll room a
    // spacer would otherwise add, which would double it.
    //
    // Deliberately NOT using pinReparent here: this section re-renders
    // on every scroll-story tick (storyCategories changes as the
    // progress crosses each reveal threshold), and GSAP's reparenting
    // moves the pinned DOM node with raw appendChild calls React never
    // finds out about — React's next reconciliation of this subtree
    // then fights that move (observed as the whole pinned section
    // rendering solid black, mid-scroll, with valid computed styles
    // but nothing actually painted). The 115px pin offset this was
    // originally added to fix turned out to be a sitewide
    // `section { padding-block }` rule (see .loc3d-section's own
    // override in location-3d.css) — already solved without it.
    const pinTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
    });

    let trigger: ScrollTrigger | undefined;

    if (!skipStory) {
      // The story only plays out over the first STORY_FRACTION of the
      // pinned range — the rest is a deliberate scroll "dead zone"
      // where the map stays pinned and OrbitControls are already live,
      // so there's real room to manually orbit/zoom before the section
      // finally scrolls away. Without this buffer, the story completing
      // and the pin releasing happened at (almost) the same scroll
      // position, leaving no practical way to "manually explore" per
      // the brief before the section scrolled past into the footer.
      const STORY_FRACTION = 0.62;

      const revealCategoriesForProgress = (storyProgress: number) => {
        const revealed = new Set<LocationCategory>();
        keyframes.forEach((k) => {
          if (k.t <= storyProgress + 0.001) k.categories.forEach((c) => revealed.add(c));
        });
        setStoryCategories(revealed);
      };

      trigger = ScrollTrigger.create({
        trigger: element,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          if (storyDoneRef.current && self.direction > 0) return;
          revealCategoriesForProgress(Math.min(1, self.progress / STORY_FRACTION));
          if (self.progress >= STORY_FRACTION) {
            markStoryDone(true);
            setStoryCategories(new Set());
          } else if (storyDoneRef.current && self.direction < 0) {
            markStoryDone(false);
          }
        },
      });
    }

    // The page's headline fonts (self-hosted @font-face, no next/font
    // swap guarantee) can finish loading and reflow section heights
    // above this one after ScrollTrigger already cached its start/end
    // pixel offsets — leaving the pin a stale amount off from the
    // real viewport-top the next time a visitor actually scrolls
    // there. Refreshing once fonts settle (and once more on window
    // load, for images) keeps those offsets accurate.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      observer.disconnect();
      document.body.classList.remove('loc3d-active');
      window.removeEventListener('load', refresh);
      trigger?.kill();
      pinTrigger.kill();
      // Safety net for handleCanvasMouseEnter below: if this unmounts
      // while the pointer is still over the canvas (e.g. a client-side
      // route change), Lenis must not stay stopped for the next page.
      getLenisInstance()?.start();
    };
  }, [keyframes]);

  // Once the scroll story is done, the map still holds itself pinned
  // for a stretch of "dead zone" scroll (see STORY_FRACTION above)
  // specifically so OrbitControls has room to work — but plain mouse-
  // wheel input over the canvas is being read by both Lenis (which
  // owns page scroll) and OrbitControls (which wants it for zoom) at
  // the same time, and Lenis wins, so scrolling over the map during
  // that window just scrolled the page straight past the section
  // instead of zooming. Pausing Lenis for as long as the pointer is
  // over the canvas — only once manual exploration is actually
  // possible — hands wheel input to OrbitControls instead.
  const handleCanvasMouseEnter = () => {
    if (storyDone && tier !== 'mobile') getLenisInstance()?.stop();
  };
  const handleCanvasMouseLeave = () => {
    getLenisInstance()?.start();
  };

  useLayoutEffect(() => {
    if (!storyDone) return;
    const framing = activeLocation
      ? computeFocusFraming(new THREE.Vector3(...applyCurvatureToPoint(activeLocation.position)))
      : DEFAULT_FRAMING;
    cameraControllerRef.current?.flyTo(framing, 1.1);
  }, [activeLocation, storyDone]);

  const handleSelectMarker = (id: number) => {
    if (!storyDone) return;
    setActiveId((prev) => (prev === id ? null : id));
  };

  const handleSelectFilter = (id: LocationCategory) => {
    if (!storyDone) return;
    setActiveFilter((prev) => (prev === id ? null : id));
    setActiveId(null);
  };

  return (
    <section className="loc3d-section" aria-label="Location — Achyutha Aura and everything nearby" ref={root}>
      <div className="loc3d-sticky" ref={stickyRef}>
        <div className="loc3d-canvas-wrap" onMouseEnter={handleCanvasMouseEnter} onMouseLeave={handleCanvasMouseLeave}>
          <LocationMap
            tier={tier}
            palette={DAY_PALETTE}
            activeId={activeId}
            visibleCategories={visibleCategories}
            controlsEnabled={storyDone}
            onSelect={handleSelectMarker}
            cameraControllerRef={cameraControllerRef}
            controlsRef={controlsRef}
          />
        </div>

        <div className="loc3d-overlay">
          <LocationList activeFilter={activeFilter} activeId={activeId} disabled={!storyDone} onSelect={handleSelectMarker} />
          <div className="loc3d-foot">
            <CategoryFilter active={activeFilter} disabled={!storyDone} onSelect={handleSelectFilter} />
            <div className="loc3d-address">
              <p>{PROJECT_LOCATION.address}</p>
              <a href={PROJECT_LOCATION.mapsUrl} target="_blank" rel="noopener noreferrer">
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
