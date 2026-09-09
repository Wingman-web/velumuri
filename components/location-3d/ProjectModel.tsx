'use client';

import { forwardRef } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectModelProps {
  name: string;
  glowColor: string;
  /** When a real architectural model exists, pass its path and the
   * placeholder tower below is swapped for the real GLB — everything
   * else (position, label, marker/connection-line relationships,
   * camera behavior) is untouched. */
  modelSrc?: string;
}

function GLTFProjectModel({ modelSrc }: { modelSrc: string }) {
  const { scene } = useGLTF(modelSrc);
  return <primitive object={scene} />;
}

function PlaceholderTower({ glowColor }: { glowColor: string }) {
  const glow = new THREE.Color(glowColor);
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[2.6, 1.8, 2.6]} />
        <meshStandardMaterial color="#f4eee0" roughness={0.55} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[1.9, 1.9, 1.9]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh position={[0, 4.05, 0]} castShadow>
        <boxGeometry args={[1.3, 1.4, 1.3]} />
        <meshStandardMaterial color="#e9dcc0" roughness={0.45} metalness={0.2} />
      </mesh>
      {[0.05, 1.75, 3.35].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[2.75 - i * 0.7, 0.06, 2.75 - i * 0.7]} />
          <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 4.95, 0]}>
        <coneGeometry args={[0.12, 0.9, 12]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.1} />
      </mesh>
      <pointLight position={[0, 3, 0]} color={glow} intensity={2.2} distance={9} />
    </group>
  );
}

export const ProjectModel = forwardRef<THREE.Group, ProjectModelProps>(function ProjectModel(
  { name, glowColor, modelSrc },
  ref,
) {
  return (
    <group ref={ref}>
      {modelSrc ? <GLTFProjectModel modelSrc={modelSrc} /> : <PlaceholderTower glowColor={glowColor} />}
      <Html position={[0, 6.1, 0]} center distanceFactor={22} style={{ pointerEvents: 'none' }}>
        <div className="loc3d-project-label">{name}</div>
      </Html>
    </group>
  );
});
