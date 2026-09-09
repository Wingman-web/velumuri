'use client';

import { forwardRef } from 'react';
import * as THREE from 'three';
import { nearbyLocations, type LocationCategory } from '@/lib/achyutha-locations';
import { POIMarker } from './POIMarker';

interface POIMarkersProps {
  visibleCategories: Set<LocationCategory>;
  activeId: number | null;
  glowColor: string;
  onSelect: (id: number) => void;
}

export const POIMarkers = forwardRef<THREE.Group, POIMarkersProps>(function POIMarkers(
  { visibleCategories, activeId, glowColor, onSelect },
  ref,
) {
  return (
    <group ref={ref}>
      {nearbyLocations.map((location) => (
        <POIMarker
          key={location.id}
          location={location}
          visible={visibleCategories.has(location.category)}
          isActive={activeId === location.id}
          glowColor={glowColor}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
});
