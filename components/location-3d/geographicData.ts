// Hand-authored stylized "geography" for the 3D scene: road polylines,
// a river band, and green zones. None of this traces real survey data
// or claims specific real street names — there's no OSM ingestion
// pipeline in this repo, and the brief this scene is built from is
// explicit that a "visually accurate stylized representation" is the
// goal, not survey-grade accuracy. What IS real: every angle below is
// chosen to stay consistent with the real compass bearings already
// baked into `nearbyLocations[].position` in lib/achyutha-locations.ts
// (see that file's polar() authoring comments) — so roads fan out
// toward the same arcs the real POIs sit in, and the river sits on the
// same south/south-west arc as the real river-adjacent landmarks
// (Pushkar Ghat, Domleswaram Barrage).

import * as THREE from 'three';

export type Point2 = [number, number]; // [x, z] ground-plane coordinates

// Builds a flat ribbon (a strip of the given width following a
// polyline) as a BufferGeometry lying in the XZ plane — shared by
// Roads.tsx and Water.tsx so both use the same ribbon math.
export function ribbonGeometry(points: Point2[], width: number): THREE.BufferGeometry {
  const left: Point2[] = [];
  const right: Point2[] = [];

  for (let i = 0; i < points.length; i++) {
    const prev = points[i - 1] ?? points[i];
    const next = points[i + 1] ?? points[i];
    const dx = next[0] - prev[0];
    const dz = next[1] - prev[1];
    const len = Math.hypot(dx, dz) || 1;
    const nx = (-dz / len) * (width / 2);
    const nz = (dx / len) * (width / 2);
    const [x, z] = points[i];
    left.push([x + nx, z + nz]);
    right.push([x - nx, z - nz]);
  }

  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < points.length; i++) {
    positions.push(left[i][0], 0, left[i][1]);
    positions.push(right[i][0], 0, right[i][1]);
  }
  for (let i = 0; i < points.length - 1; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = i * 2 + 2;
    const d = i * 2 + 3;
    indices.push(a, b, c, b, d, c);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export interface RoadPath {
  points: Point2[];
  width: number;
  major: boolean;
}

const SPOKE_BEARINGS_DEG = [55, 330, 121, 155, 210, 0, 270] as const;
const SPOKE_RADII = [7, 26];
const RING_RADII = [10, 20];

function toPoint(radius: number, bearingDeg: number): Point2 {
  const rad = (bearingDeg * Math.PI) / 180;
  return [+(Math.cos(rad) * radius).toFixed(2), +(Math.sin(rad) * radius).toFixed(2)];
}

const spokes: RoadPath[] = SPOKE_BEARINGS_DEG.map((bearing, i) => ({
  points: [toPoint(SPOKE_RADII[0], bearing), toPoint(SPOKE_RADII[1], bearing)],
  width: i < 5 ? 1.5 : 1.1,
  major: i < 5,
}));

const rings: RoadPath[] = RING_RADII.map((radius, ringIndex) => {
  const sorted = [...SPOKE_BEARINGS_DEG].sort((a, b) => a - b);
  const points = [...sorted, sorted[0] + 360].map((bearing) => toPoint(radius, bearing));
  return { points, width: ringIndex === 0 ? 1.2 : 0.9, major: false };
});

export const ROAD_PATHS: RoadPath[] = [...spokes, ...rings];

// A gentle south/south-west curve through the scene, on the same arc
// (~148–163°) as the real river-adjacent landmarks.
export const RIVER_BAND: { points: Point2[]; width: number } = {
  points: [
    [-42, 12],
    [-27, 19],
    [-10, 25],
    [9, 24],
    [26, 18],
    [43, 11],
  ],
  width: 9,
};

export interface GreenZone {
  center: Point2;
  radius: number;
}

export const GREEN_ZONES: GreenZone[] = [
  { center: [3, -4], radius: 5 }, // a small park near the project itself
  { center: toPoint(19, 242), radius: 6 }, // beside the golf-club arc
  { center: toPoint(13.5, 156), radius: 5 }, // riverside green, near the temple/ghat arc
  { center: toPoint(15, 340), radius: 4.5 }, // green edge along the education arc
];

function distanceToSegment(px: number, pz: number, [ax, az]: Point2, [bx, bz]: Point2): number {
  const abx = bx - ax;
  const abz = bz - az;
  const lengthSq = abx * abx + abz * abz;
  const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * abx + (pz - az) * abz) / lengthSq));
  const projX = ax + abx * t;
  const projZ = az + abz * t;
  return Math.hypot(px - projX, pz - projZ);
}

export function distanceToNearestRoad(x: number, z: number): number {
  let min = Infinity;
  for (const road of ROAD_PATHS) {
    for (let i = 0; i < road.points.length - 1; i++) {
      const d = distanceToSegment(x, z, road.points[i], road.points[i + 1]) - road.width / 2;
      if (d < min) min = d;
    }
  }
  return min;
}

export function distanceToRiver(x: number, z: number): number {
  let min = Infinity;
  for (let i = 0; i < RIVER_BAND.points.length - 1; i++) {
    const d = distanceToSegment(x, z, RIVER_BAND.points[i], RIVER_BAND.points[i + 1]) - RIVER_BAND.width / 2;
    if (d < min) min = d;
  }
  return min;
}

export function isInsideGreenZone(x: number, z: number): boolean {
  return GREEN_ZONES.some((zone) => Math.hypot(x - zone.center[0], z - zone.center[1]) < zone.radius);
}

// Deterministic RNG (same seed → same layout every load, so the
// procedural city doesn't reshuffle on every re-render/remount).
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
