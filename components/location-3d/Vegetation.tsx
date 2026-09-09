'use client';

import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GREEN_ZONES, distanceToNearestRoad, distanceToRiver, mulberry32 } from './geographicData';
import { curvatureY } from './locationConfig';

interface VegetationProps {
  count: number;
  foliageColor: string;
  trunkColor: string;
}

const CLEAR_RADIUS = 6.5;
const dummy = new THREE.Object3D();

export const Vegetation = forwardRef<THREE.Group, VegetationProps>(function Vegetation(
  { count, foliageColor, trunkColor },
  ref,
) {
  const trunkMeshRef = useRef<THREE.InstancedMesh>(null);
  const foliageMeshRef = useRef<THREE.InstancedMesh>(null);

  const trees = useMemo(() => {
    const rand = mulberry32(20260908);
    const zoneWeights = GREEN_ZONES.map((zone) => zone.radius * zone.radius);
    const totalWeight = zoneWeights.reduce((a, b) => a + b, 0);
    const points: { x: number; z: number; groundY: number; scale: number; rotation: number }[] = [];

    let attempts = 0;
    while (points.length < count && attempts < count * 12) {
      attempts++;
      let pick = rand() * totalWeight;
      let zoneIndex = 0;
      while (pick > zoneWeights[zoneIndex] && zoneIndex < zoneWeights.length - 1) {
        pick -= zoneWeights[zoneIndex];
        zoneIndex++;
      }
      const zone = GREEN_ZONES[zoneIndex];
      const angle = rand() * Math.PI * 2;
      const radius = Math.sqrt(rand()) * zone.radius;
      const x = zone.center[0] + Math.cos(angle) * radius;
      const z = zone.center[1] + Math.sin(angle) * radius;

      const distFromCenter = Math.hypot(x, z);
      if (distFromCenter < CLEAR_RADIUS) continue;
      if (distanceToNearestRoad(x, z) < 0.6) continue;
      if (distanceToRiver(x, z) < 0.4) continue;

      points.push({ x, z, groundY: curvatureY(distFromCenter), scale: 0.7 + rand() * 0.7, rotation: rand() * Math.PI * 2 });
    }
    return points;
  }, [count]);

  useLayoutEffect(() => {
    const trunkMesh = trunkMeshRef.current;
    const foliageMesh = foliageMeshRef.current;
    if (!trunkMesh || !foliageMesh) return;

    trees.forEach((tree, i) => {
      dummy.position.set(tree.x, tree.groundY + 0.35 * tree.scale, tree.z);
      dummy.rotation.set(0, tree.rotation, 0);
      dummy.scale.setScalar(tree.scale);
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(tree.x, tree.groundY + 1 * tree.scale, tree.z);
      dummy.updateMatrix();
      foliageMesh.setMatrixAt(i, dummy.matrix);
    });
    trunkMesh.instanceMatrix.needsUpdate = true;
    foliageMesh.instanceMatrix.needsUpdate = true;
    trunkMesh.count = trees.length;
    foliageMesh.count = trees.length;
  }, [trees]);

  return (
    <group ref={ref}>
      <instancedMesh ref={trunkMeshRef} args={[undefined, undefined, count]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.7, 5]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={foliageMeshRef} args={[undefined, undefined, count]} castShadow>
        <coneGeometry args={[0.55, 1.15, 6]} />
        <meshStandardMaterial color={foliageColor} roughness={0.85} />
      </instancedMesh>
    </group>
  );
});
