'use client';

import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { nearbyLocations, PROJECT_LOCATION, type LocationCategory } from '@/lib/achyutha-locations';
import { TIER_SETTINGS, applyCurvatureToPoint, type ScenePalette, type SceneTier } from './locationConfig';
import { Terrain } from './Terrain';
import { Roads } from './Roads';
import { Water } from './Water';
import { Vegetation } from './Vegetation';
import { Buildings } from './Buildings';
import { ProjectModel } from './ProjectModel';
import { POIMarkers } from './POIMarkers';
import { POICard } from './POICard';
import { ConnectionLine } from './ConnectionLine';
import { MapControls } from './MapControls';
import { CameraController, type CameraControllerHandle } from './CameraController';

interface LocationSceneProps {
  tier: SceneTier;
  palette: ScenePalette;
  activeId: number | null;
  visibleCategories: LocationCategory[];
  controlsEnabled: boolean;
  onSelect: (id: number) => void;
  cameraControllerRef: RefObject<CameraControllerHandle | null>;
  controlsRef: RefObject<OrbitControlsImpl | null>;
}

export function LocationScene({
  tier,
  palette,
  activeId,
  visibleCategories,
  controlsEnabled,
  onSelect,
  cameraControllerRef,
  controlsRef,
}: LocationSceneProps) {
  const settings = TIER_SETTINGS[tier];
  const root = useRef<THREE.Group>(null);
  const terrainRef = useRef<THREE.Group>(null);
  const roadsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Group>(null);
  const vegetationRef = useRef<THREE.Group>(null);
  const buildingsRef = useRef<THREE.Group>(null);
  const projectRef = useRef<THREE.Group>(null);

  const activeLocation = useMemo(() => nearbyLocations.find((l) => l.id === activeId) ?? null, [activeId]);
  const visibleSet = useMemo(() => new Set(visibleCategories), [visibleCategories]);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const groups = [terrainRef.current, roadsRef.current, waterRef.current, vegetationRef.current, buildingsRef.current, projectRef.current];

    if (reducedMotion || groups.some((g) => !g)) {
      groups.forEach((g) => g?.scale.setScalar(1));
      return;
    }

    const context = gsap.context(() => {
      groups.forEach((g) => g?.scale.setScalar(0.001));
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(terrainRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'power2.out' }, 0)
        .to(roadsRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'power2.out' }, 0.35)
        .to(waterRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'power2.out' }, 0.45)
        .to(buildingsRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'back.out(1.4)' }, 0.75)
        .to(vegetationRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'power2.out' }, 1.05)
        .to(projectRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'back.out(1.6)' }, 1.35);
    }, root);

    return () => context.revert();
  }, []);

  return (
    <group ref={root}>
      <Terrain ref={terrainRef} color={palette.terrain} edgeColor={palette.terrainEdge} />
      <Roads ref={roadsRef} color={palette.road} lineColor={palette.roadLine} />
      <Water ref={waterRef} color={palette.water} highlight={palette.waterHighlight} />
      <Buildings ref={buildingsRef} count={settings.buildingCount} palette={palette.buildingBase} windowColor={palette.buildingWindow} />
      <Vegetation ref={vegetationRef} count={settings.treeCount} foliageColor={palette.foliage} trunkColor={palette.foliageTrunk} />
      <ProjectModel ref={projectRef} name={`${PROJECT_LOCATION.name.toUpperCase()}`} glowColor={palette.markerGlow} />

      <POIMarkers visibleCategories={visibleSet} activeId={activeId} glowColor={palette.markerGlow} onSelect={onSelect} />
      <POICard location={activeLocation} onClose={() => activeLocation && onSelect(activeLocation.id)} />

      <ConnectionLine
        from={[0, 0.4, 0]}
        to={activeLocation ? applyCurvatureToPoint(activeLocation.position) : null}
        color={palette.markerGlow}
      />

      <MapControls ref={controlsRef} target={[0, 0, 2]} enabled={controlsEnabled} />
      <CameraController ref={cameraControllerRef} controlsRef={controlsRef} />
    </group>
  );
}
