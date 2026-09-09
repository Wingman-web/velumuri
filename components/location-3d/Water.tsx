'use client';

import { forwardRef, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RIVER_BAND, ribbonGeometry } from './geographicData';
import { applyCurvatureToGeometry } from './locationConfig';

interface WaterProps {
  color: string;
  highlight: string;
}

export const Water = forwardRef<THREE.Group, WaterProps>(function Water({ color, highlight }, ref) {
  const geometry = useMemo(() => applyCurvatureToGeometry(ribbonGeometry(RIVER_BAND.points, RIVER_BAND.width)), []);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const highlightColor = useMemo(() => new THREE.Color(highlight), [highlight]);

  useFrame(({ clock }) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.emissiveIntensity = 0.16 + Math.sin(clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry} position={[0, 0.02, 0]} receiveShadow>
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={highlightColor}
          emissiveIntensity={0.16}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>
    </group>
  );
});
