// Shared tuning constants for the 3D LOCATION scene: camera framing,
// responsive tiers, and day/night palettes. Kept separate from the
// scene components so the "same implied zoom" camera math (see
// computeFocusFraming) and the desktop/tablet/mobile complexity
// budget are each defined exactly once.

import * as THREE from 'three';

export const PROJECT_ORIGIN = new THREE.Vector3(0, 0, 0);

// A lower, more raking elevation (~27° above the horizon, versus the
// original ~41°) reads far more like a physical 3D miniature — it
// shows building facades and lets the curved terrain horizon (see
// curvatureY below) actually register as a horizon, rather than
// looking like a flat top-down illustration. `fov` never changes
// between default and focused states — only position/look-at do — so
// there is no jarring "zoom cut" when a marker is selected or deselected.
export const DEFAULT_FRAMING = {
  pos: new THREE.Vector3(0, 24, 52),
  look: new THREE.Vector3(0, 1, 6),
  fov: 45,
};

// Bends the ground (and everything standing on it) downward as it
// gets farther from the project, so the scene reads as a small curved
// world/miniature globe rather than a flat plane — subtle near the
// project, more pronounced toward the terrain's outer edge where the
// lowered camera above can actually see it fall away. Callers apply
// this to a point's own y once, using its horizontal distance from
// the scene origin (project position).
const CURVATURE_K = 0.0035;
export function curvatureY(distanceFromCenter: number): number {
  return -CURVATURE_K * distanceFromCenter * distanceFromCenter;
}

// Lifts (really, drops) a single stored [x, y, z] point onto the
// curved ground — used wherever a POI's raw `position` from
// lib/achyutha-locations.ts needs to match where its marker actually
// ends up sitting (POICard, ConnectionLine), since POIMarker itself
// applies the same offset.
export function applyCurvatureToPoint([x, y, z]: [number, number, number]): [number, number, number] {
  return [x, y + curvatureY(Math.hypot(x, z)), z];
}

// Applies curvatureY to every vertex of a flat (XZ-plane, y≈0)
// geometry in place, based on each vertex's own distance from the
// scene origin — used for ribbon geometry (roads, water) that's
// authored flat and needs to sit on the curved ground afterward.
export function applyCurvatureToGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, pos.getY(i) + curvatureY(Math.hypot(x, z)));
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

// A POI focus never redefines distance/height/fov from scratch — it
// scales the *same* default camera-to-look offset vector, so the
// "zoom level" a focused shot uses is always a fixed, predictable
// fraction of the default shot's own zoom, never an independently
// hand-tuned (and easily mismatched) number.
const FOCUS_ZOOM = 0.62;
const FOCUS_LOOK_BIAS = 0.65; // 0 = look at project only, 1 = look at the POI only

export function computeFocusFraming(poiPosition: THREE.Vector3): { pos: THREE.Vector3; look: THREE.Vector3 } {
  const defaultOffset = DEFAULT_FRAMING.pos.clone().sub(DEFAULT_FRAMING.look);
  const look = PROJECT_ORIGIN.clone().lerp(poiPosition, FOCUS_LOOK_BIAS);
  const pos = look.clone().add(defaultOffset.multiplyScalar(FOCUS_ZOOM));
  return { pos, look };
}

export type SceneTier = 'desktop' | 'tablet' | 'mobile';

export function getSceneTier(width: number): SceneTier {
  if (width < 700) return 'mobile';
  if (width < 1100) return 'tablet';
  return 'desktop';
}

interface TierSettings {
  buildingCount: number;
  treeCount: number;
  shadows: boolean;
  dpr: [number, number];
}

export const TIER_SETTINGS: Record<SceneTier, TierSettings> = {
  desktop: { buildingCount: 130, treeCount: 90, shadows: true, dpr: [1, 2] },
  tablet: { buildingCount: 80, treeCount: 50, shadows: true, dpr: [1, 1.5] },
  mobile: { buildingCount: 46, treeCount: 26, shadows: false, dpr: [1, 1] },
};

export interface ScenePalette {
  background: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  terrain: string;
  terrainEdge: string;
  road: string;
  roadLine: string;
  water: string;
  waterHighlight: string;
  buildingBase: string[];
  buildingWindow: string;
  foliage: string;
  foliageTrunk: string;
  ambientIntensity: number;
  ambientColor: string;
  sunColor: string;
  sunIntensity: number;
  hemiSky: string;
  hemiGround: string;
  markerGlow: string;
}

export const DAY_PALETTE: ScenePalette = {
  background: '#e9e2d3',
  fog: '#e9e2d3',
  fogNear: 55,
  fogFar: 105,
  terrain: '#d9d0ba',
  terrainEdge: '#cabf9f',
  road: '#b9ad95',
  roadLine: '#efe8d6',
  water: '#3b6f80',
  waterHighlight: '#7fb8c4',
  buildingBase: ['#faf6ec', '#f1ead9', '#e7ddc6', '#ded2b6'],
  buildingWindow: '#a89a78',
  foliage: '#7c8a5c',
  foliageTrunk: '#5b4a36',
  ambientIntensity: 0.85,
  ambientColor: '#fff7e6',
  sunColor: '#fff2d6',
  sunIntensity: 1.5,
  hemiSky: '#fdf6e3',
  hemiGround: '#c9bd9e',
  markerGlow: '#ecd09e',
};

export const NIGHT_PALETTE: ScenePalette = {
  background: '#05060a',
  fog: '#05060a',
  fogNear: 40,
  fogFar: 100,
  terrain: '#0d0f14',
  terrainEdge: '#08090c',
  road: '#191b22',
  roadLine: '#3a3d47',
  water: '#0a1f30',
  waterHighlight: '#123249',
  buildingBase: ['#14151c', '#191b24', '#1d1f29', '#101119'],
  buildingWindow: '#ecd09e',
  foliage: '#141f13',
  foliageTrunk: '#100c08',
  ambientIntensity: 0.28,
  ambientColor: '#28304a',
  sunColor: '#4a5a86',
  sunIntensity: 0.4,
  hemiSky: '#1b2338',
  hemiGround: '#05060a',
  markerGlow: '#ecd09e',
};
