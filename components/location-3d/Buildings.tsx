'use client';

import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { distanceToNearestRoad, distanceToRiver, isInsideGreenZone, mulberry32 } from './geographicData';
import { curvatureY } from './locationConfig';

interface BuildingsProps {
  count: number;
  palette: string[];
  windowColor: string;
}

interface Candidate {
  x: number;
  z: number;
  groundY: number;
  width: number;
  depth: number;
  height: number;
  colorIndex: number;
  isTower: boolean;
  hasRoofCap: boolean;
}

const CLEAR_RADIUS = 6.5;
const SCENE_RADIUS = 55;
const dummy = new THREE.Object3D();

function generateCandidates(count: number): Candidate[] {
  const rand = mulberry32(90814);
  const candidates: Candidate[] = [];
  let attempts = 0;

  while (candidates.length < count && attempts < count * 20) {
    attempts++;
    const angle = rand() * Math.PI * 2;
    const radius = CLEAR_RADIUS + Math.sqrt(rand()) * (SCENE_RADIUS - CLEAR_RADIUS);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    if (distanceToNearestRoad(x, z) < 1.3) continue;
    if (distanceToRiver(x, z) < 0.8) continue;
    if (isInsideGreenZone(x, z)) continue;

    const isTower = rand() < 0.12;
    const width = isTower ? 0.9 + rand() * 0.6 : 1.1 + rand() * 1.6;
    const depth = isTower ? 0.9 + rand() * 0.6 : 1.1 + rand() * 1.6;
    const height = isTower ? 3.2 + rand() * 3.4 : 0.9 + rand() * 2.1;

    candidates.push({
      x,
      z,
      groundY: curvatureY(radius),
      width,
      depth,
      height,
      colorIndex: Math.floor(rand() * 4),
      isTower,
      hasRoofCap: !isTower && rand() < 0.18,
    });
  }
  return candidates;
}

export const Buildings = forwardRef<THREE.Group, BuildingsProps>(function Buildings({ count, palette, windowColor }, ref) {
  const blockRef = useRef<THREE.InstancedMesh>(null);
  const roofRef = useRef<THREE.InstancedMesh>(null);

  const candidates = useMemo(() => generateCandidates(count), [count]);
  const roofCandidates = useMemo(() => candidates.filter((c) => c.hasRoofCap), [candidates]);

  const paletteColors = useMemo(() => palette.map((hex) => new THREE.Color(hex)), [palette]);
  const windowColorObj = useMemo(() => new THREE.Color(windowColor), [windowColor]);

  useLayoutEffect(() => {
    const blockMesh = blockRef.current;
    if (!blockMesh) return;

    candidates.forEach((building, i) => {
      dummy.position.set(building.x, building.groundY + building.height / 2, building.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(building.width, building.height, building.depth);
      dummy.updateMatrix();
      blockMesh.setMatrixAt(i, dummy.matrix);
      blockMesh.setColorAt(i, paletteColors[building.colorIndex] ?? paletteColors[0]);
    });
    blockMesh.instanceMatrix.needsUpdate = true;
    if (blockMesh.instanceColor) blockMesh.instanceColor.needsUpdate = true;
    blockMesh.count = candidates.length;
  }, [candidates, paletteColors]);

  useLayoutEffect(() => {
    const roofMesh = roofRef.current;
    if (!roofMesh) return;

    roofCandidates.forEach((building, i) => {
      dummy.position.set(building.x, building.groundY + building.height + 0.35, building.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(building.width * 0.75, 0.7, building.depth * 0.75);
      dummy.updateMatrix();
      roofMesh.setMatrixAt(i, dummy.matrix);
    });
    roofMesh.instanceMatrix.needsUpdate = true;
    roofMesh.count = roofCandidates.length;
  }, [roofCandidates]);

  return (
    <group ref={ref}>
      <instancedMesh ref={blockRef} args={[undefined, undefined, Math.max(count, 1)]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" emissive={windowColorObj} emissiveIntensity={0.06} roughness={0.8} metalness={0.05} />
      </instancedMesh>
      <instancedMesh ref={roofRef} args={[undefined, undefined, Math.max(count, 1)]} castShadow>
        <coneGeometry args={[0.72, 1, 4]} />
        <meshStandardMaterial color={windowColorObj} roughness={0.7} />
      </instancedMesh>
    </group>
  );
});
