'use client';

import { forwardRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface MapControlsProps {
  target: [number, number, number];
  enabled: boolean;
}

export const MapControls = forwardRef<OrbitControlsImpl, MapControlsProps>(function MapControls({ target, enabled }, ref) {
  return (
    <OrbitControls
      ref={ref}
      target={target}
      enabled={enabled}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      enableRotate
      enableZoom
      minDistance={16}
      maxDistance={72}
      minPolarAngle={0.35}
      maxPolarAngle={1.45}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
    />
  );
});
