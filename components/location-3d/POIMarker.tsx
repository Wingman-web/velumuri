'use client';

import { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { CATEGORY_ICONS, type NearbyLocation } from '@/lib/achyutha-locations';
import { curvatureY } from './locationConfig';

interface POIMarkerProps {
  location: NearbyLocation;
  visible: boolean;
  isActive: boolean;
  glowColor: string;
  onSelect: (id: number) => void;
}

export function POIMarker({ location, visible, isActive, glowColor, onSelect }: POIMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const target = visible ? 1 : 0.0001;
    if (!mounted.current) {
      group.scale.setScalar(target);
      mounted.current = true;
      return;
    }
    gsap.to(group.scale, { x: target, y: target, z: target, duration: 0.5, ease: 'power2.out' });
  }, [visible]);

  const [x, y, z] = location.position;
  const groundY = y + curvatureY(Math.hypot(x, z));

  const handleSelect = () => {
    if (visible) onSelect(location.id);
  };

  return (
    <group ref={groupRef} position={[x, groundY, z]}>
      {/* An oversized, invisible hit target — the visible octahedron
          below is deliberately small/elegant, which would otherwise
          make it fiddly to click/tap at real scene distances. */}
      <mesh
        position={[0, 0.55, 0]}
        onClick={(event) => {
          event.stopPropagation();
          handleSelect();
        }}
      >
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={isActive ? 1.1 : 0.55}
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color={glowColor} transparent opacity={0.55} />
      </mesh>
      <Html position={[0, 0.98, 0]} center distanceFactor={16} style={{ pointerEvents: visible ? 'auto' : 'none' }}>
        <div
          className={`loc3d-marker-badge${isActive ? ' is-active' : ''}`}
          style={{ opacity: visible ? 1 : 0 }}
          onClick={handleSelect}
        >
          <span className="loc3d-marker-icon">{CATEGORY_ICONS[location.category]}</span>
          <span>{location.id}</span>
        </div>
      </Html>
    </group>
  );
}
