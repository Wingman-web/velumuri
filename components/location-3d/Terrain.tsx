'use client';

import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { curvatureY } from './locationConfig';

interface TerrainProps {
  color: string;
  edgeColor: string;
}

export const Terrain = forwardRef<THREE.Group, TerrainProps>(function Terrain({ color, edgeColor }, ref) {
  const groundGeometry = useMemo(() => {
    const geo = new THREE.CircleGeometry(58, 72);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.hypot(x, y);
      const noise = Math.sin(x * 0.15) * Math.cos(y * 0.17) * 0.15 * Math.max(0, 1 - dist / 58);
      pos.setZ(i, noise + curvatureY(dist));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={groundGeometry}>
        <meshStandardMaterial color={color} roughness={0.95} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <circleGeometry args={[92, 48]} />
        <meshBasicMaterial color={edgeColor} fog />
      </mesh>
    </group>
  );
});
