'use client';

import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { ROAD_PATHS, ribbonGeometry } from './geographicData';
import { applyCurvatureToGeometry } from './locationConfig';

interface RoadsProps {
  color: string;
  lineColor: string;
}

export const Roads = forwardRef<THREE.Group, RoadsProps>(function Roads({ color, lineColor }, ref) {
  const roadGeometries = useMemo(
    () => ROAD_PATHS.map((road) => applyCurvatureToGeometry(ribbonGeometry(road.points, road.width))),
    [],
  );
  const lineGeometries = useMemo(
    () =>
      ROAD_PATHS.filter((road) => road.major).map((road) =>
        applyCurvatureToGeometry(ribbonGeometry(road.points, road.width * 0.14)),
      ),
    [],
  );

  return (
    <group ref={ref}>
      {roadGeometries.map((geo, i) => (
        <mesh key={i} geometry={geo} position={[0, 0.03, 0]} receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
        </mesh>
      ))}
      {lineGeometries.map((geo, i) => (
        <mesh key={i} geometry={geo} position={[0, 0.045, 0]}>
          <meshBasicMaterial color={lineColor} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
});
