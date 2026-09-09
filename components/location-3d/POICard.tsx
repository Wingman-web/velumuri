'use client';

import { Html } from '@react-three/drei';
import { CATEGORY_ICONS, type NearbyLocation } from '@/lib/achyutha-locations';
import { applyCurvatureToPoint } from './locationConfig';

interface POICardProps {
  location: NearbyLocation | null;
  onClose: () => void;
}

export function POICard({ location, onClose }: POICardProps) {
  if (!location) return null;
  const [x, y, z] = applyCurvatureToPoint(location.position);

  return (
    <Html position={[x, y + 1.55, z]} center distanceFactor={16} zIndexRange={[50, 0]}>
      <div className="loc3d-card">
        <button type="button" className="loc3d-card-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <span className="loc3d-card-icon">{CATEGORY_ICONS[location.category]}</span>
        <strong className="loc3d-card-name">{location.name}</strong>
        <span className="loc3d-card-meta">
          {location.distance} · {location.time}
        </span>
      </div>
    </Html>
  );
}
