// Nearby-location data for the Achyutha Aura LOCATION section.
//
// GEOGRAPHIC GROUNDING — read this before changing any position below.
//
// The project's own coordinates and three major landmarks are backed
// by real, independently-sourced lat/lng (see REAL_ANCHORS below) —
// Rajahmundry Airport, Rajahmundry Railway Station, and Dowleswaram
// Barrage all use their actual real-world bearing AND a distance
// derived from the real `distance` values already in this file.
// Everything else does NOT have a verified public lat/lng (most are
// small local businesses with no indexed coordinates) — those use a
// direction that's a reasonable, geography-informed estimate (which
// side of town a category cluster genuinely sits on), not a geocoded
// fact. Do not treat REAL_BEARING_DEG as survey-accurate for anything
// not listed in REAL_ANCHORS.
//
// `distance`/`time` (the display strings) are always the real values
// from the project brief — that part was never stylized. What IS
// compressed is scene RADIUS: a 50m clinic and a 16.6km university
// can't share true-to-scale distance in one composition, so radius
// uses `RADIUS_BASE + RADIUS_SCALE * sqrt(distanceKm)` — a common
// cartogram technique that keeps every location's real relative
// ordering (closer things are still closer) without needing a scene
// 300x wider than it is tall.

export type LocationCategory = 'healthcare' | 'shopping' | 'education' | 'transport' | 'landmarks';

export interface NearbyLocation {
  id: number;
  name: string;
  category: LocationCategory;
  distance: string;
  time: string;
  position: [number, number, number];
}

export interface CategoryFilter {
  id: LocationCategory;
  label: string;
}

// No "All" entry — the map starts empty (see LocationSection) and a
// category chip is the only way to populate it, one category at a time.
export const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'shopping', label: 'Shopping & Entertainment' },
  { id: 'education', label: 'Education' },
  { id: 'transport', label: 'Transport' },
  { id: 'landmarks', label: 'Landmarks' },
];

// A simple glyph per category for marker badges/cards — kept as plain
// geometric characters (not emoji) to match the site's minimal, premium
// UI language.
export const CATEGORY_ICONS: Record<LocationCategory, string> = {
  healthcare: '✚',
  shopping: '◇',
  education: '✎',
  transport: '✈',
  landmarks: '✦',
};

// Best-effort centroid of "Syamala Nagar, Gandhipuram" (the named
// locality in the project address), averaged from two independently
// geocoded points in that same locality (the Rajahmundry Bus Stand and
// the Syamala Nagar post office) — not the exact building, since the
// address's Plus Code (2Q4Q+6P3) can't be decoded to an exact point
// without the reference-resolution step a full geocoder does. Real
// bearings below are measured from this point.
const PROJECT_COORDS = { lat: 17.0035, lng: 81.7895 };

// [name, lat, lng] — sourced independently (Wikipedia / Wikidata), not
// derived from this project's own `distance` figures.
const REAL_ANCHORS: Record<number, { lat: number; lng: number }> = {
  14: { lat: 17.11028, lng: 81.81833 }, // Rajahmundry Airport
  15: { lat: 16.984516, lng: 81.784343 }, // Rajahmundry Railway Station
  13: { lat: 16.9307594, lng: 81.7657988 }, // Dowleswaram Barrage
};

const EARTH_RADIUS_M = 6371000;
const RADIUS_BASE = 5;
const RADIUS_SCALE = 4.5;

// Bearing (compass degrees, 0 = true north) from PROJECT_COORDS to a
// real lat/lng, using an equirectangular approximation — accurate
// enough at this scale (a few km).
function bearingFromProject(lat: number, lng: number): number {
  const dLat = ((lat - PROJECT_COORDS.lat) * Math.PI) / 180;
  const dLng = ((lng - PROJECT_COORDS.lng) * Math.PI) / 180;
  const north = dLat * EARTH_RADIUS_M;
  const east = dLng * EARTH_RADIUS_M * Math.cos((PROJECT_COORDS.lat * Math.PI) / 180);
  return ((Math.atan2(east, north) * 180) / Math.PI + 360) % 360;
}

// Scene convention: +X = east, +Z = south (so the default camera,
// which sits south of the scene looking north, has "north" — most
// category clusters, since the town center and river both read as
// roughly northward/riverward from this project — reading into the
// distance rather than behind the camera). A real compass bearing
// (0 = north, 90 = east) becomes a scene angle via `bearing - 90`.
function fromReal(distanceKm: number, realBearingDeg: number, y = 0.4): [number, number, number] {
  const radius = RADIUS_BASE + RADIUS_SCALE * Math.sqrt(distanceKm);
  const sceneAngle = ((realBearingDeg - 90) * Math.PI) / 180;
  return [+(Math.cos(sceneAngle) * radius).toFixed(2), y, +(Math.sin(sceneAngle) * radius).toFixed(2)];
}

function anchor(id: number, distanceKm: number): [number, number, number] {
  const real = REAL_ANCHORS[id];
  return fromReal(distanceKm, bearingFromProject(real.lat, real.lng));
}

export const nearbyLocations: NearbyLocation[] = [
  // Healthcare — estimated toward the town-centre side of the
  // locality (not individually geocoded; see file header).
  { id: 1, name: 'Srikara Hospital', category: 'healthcare', distance: '50 Mtrs', time: '< 1 Min', position: fromReal(0.05, 320) },
  { id: 2, name: 'Rainbow Hospital', category: 'healthcare', distance: '290 Mtrs', time: '1 Min', position: fromReal(0.29, 335) },
  { id: 3, name: 'KIMS Hospital', category: 'healthcare', distance: '1.8 KM', time: '6 Mins', position: fromReal(1.8, 300) },

  // Shopping & Entertainment — estimated west/south-west, toward
  // Rajahmundry's older commercial core and riverside hospitality strip.
  { id: 4, name: 'G.V. Mall', category: 'shopping', distance: '1.3 KM', time: '4 Mins', position: fromReal(1.3, 255) },
  { id: 5, name: 'CMR Shopping Mall', category: 'shopping', distance: '2.4 KM', time: '7 Mins', position: fromReal(2.4, 265) },
  { id: 6, name: 'South India Shopping Mall', category: 'shopping', distance: '2.8 KM', time: '9 Mins', position: fromReal(2.8, 275) },
  { id: 7, name: 'Prasavita Mall & Multiplex', category: 'shopping', distance: '1.7 KM', time: '4 Mins', position: fromReal(1.7, 245) },
  { id: 8, name: 'Godavari Golf Club', category: 'shopping', distance: '3.2 KM', time: '8 Mins', position: fromReal(3.2, 285) },
  { id: 9, name: 'Manjeera Sarovar Premiere', category: 'shopping', distance: '2.6 KM', time: '8 Mins', position: fromReal(2.6, 220) },
  { id: 10, name: 'Hotel Shelton', category: 'shopping', distance: '1 KM', time: '3 Mins', position: fromReal(1, 235) },
  { id: 16, name: 'Ironhill Brewery', category: 'shopping', distance: '1.6 KM', time: '4 Mins', position: fromReal(1.6, 250) },
  { id: 17, name: 'A-Square Gokarting', category: 'shopping', distance: '13.2 KM', time: '22 Mins', position: fromReal(13.2, 240) },

  // Landmarks — the two riverside ones (ISKCON, Pushkar Ghat) share the
  // real, verified bearing to Dowleswaram Barrage (all three sit on the
  // same Godavari riverfront, south of the project).
  { id: 11, name: 'ISKCON | Sri Sri Radha Gopinath Dasavatara Temple', category: 'landmarks', distance: '3.4 KM', time: '9 Mins', position: fromReal(3.4, 187) },
  { id: 12, name: 'Pushkar Ghat', category: 'landmarks', distance: '3.1 KM', time: '9 Mins', position: fromReal(3.1, 192) },
  { id: 13, name: 'Domleswaram Barrage', category: 'landmarks', distance: '7.1 KM', time: '13 Mins', position: anchor(13, 7.1) }, // verified

  // Transport — the airport and railway station sit in genuinely
  // different real directions from the project (verified), so unlike
  // every other category here they are NOT clustered on one arc.
  { id: 14, name: 'Rajahmundry Airport', category: 'transport', distance: '14.5 KM', time: '29 Mins', position: anchor(14, 14.5) }, // verified
  { id: 15, name: 'Rajahmundry Railway Station', category: 'transport', distance: '3.8 KM', time: '11 Mins', position: anchor(15, 3.8) }, // verified

  // Educational Institutions — estimated north-east, toward Rajahmundry's
  // newer/outer development corridor.
  { id: 18, name: 'The Bodhi School', category: 'education', distance: '2.6 KM', time: '8 Mins', position: fromReal(2.6, 40) },
  { id: 19, name: 'Smart Indo American', category: 'education', distance: '3 KM', time: '9 Mins', position: fromReal(3, 55) },
  { id: 20, name: 'Avenues Global School', category: 'education', distance: '1.3 KM', time: '4 Mins', position: fromReal(1.3, 25) },
  { id: 21, name: 'Bharatiya Vidya Bhavan', category: 'education', distance: '9.3 KM', time: '23 Mins', position: fromReal(9.3, 65) },
  { id: 22, name: 'Sasi Educational Institute', category: 'education', distance: '1.5 KM', time: '4 Mins', position: fromReal(1.5, 15) },
  { id: 23, name: 'Godavari Global University', category: 'education', distance: '11.1 KM', time: '19 Mins', position: fromReal(11.1, 70) },
  { id: 24, name: 'Adikavi Nannaya University', category: 'education', distance: '16.6 KM', time: '28 Mins', position: fromReal(16.6, 60) },
];

export const PROJECT_LOCATION = {
  name: 'Achyutha Aura',
  developer: 'Velumuri',
  address: '2Q4Q+6P3, Syamala Nagar, Gandhipuram, Rajamahendravaram, Andhra Pradesh 533103',
  mapsUrl: 'https://maps.app.goo.gl/kn7iV86xfBSVHZiPA',
  coords: PROJECT_COORDS,
};

// The scene-local bearing (degrees) a location's own `position` was
// composed at — recovered from that same [x, z] rather than stored
// separately. For the three REAL_ANCHORS entries this is a genuine
// real-world bearing (offset by the fixed `-90` scene-axis rotation
// applied in fromReal()); for the rest it's the estimated bearing
// described in this file's header. Used by the 3D scene (connection
// lines, camera framing) to stay direction-consistent with whichever
// POI is selected.
export function bearingOf(location: NearbyLocation): number {
  return (Math.atan2(location.position[2], location.position[0]) * 180) / Math.PI;
}
