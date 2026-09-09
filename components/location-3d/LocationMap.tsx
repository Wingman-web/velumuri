'use client';

import { Suspense, type RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { LocationCategory } from '@/lib/achyutha-locations';
import { DEFAULT_FRAMING, TIER_SETTINGS, type ScenePalette, type SceneTier } from './locationConfig';
import { LocationScene } from './LocationScene';
import type { CameraControllerHandle } from './CameraController';

interface LocationMapProps {
  tier: SceneTier;
  palette: ScenePalette;
  activeId: number | null;
  visibleCategories: LocationCategory[];
  controlsEnabled: boolean;
  onSelect: (id: number) => void;
  cameraControllerRef: RefObject<CameraControllerHandle | null>;
  controlsRef: RefObject<OrbitControlsImpl | null>;
}

export default function LocationMap({
  tier,
  palette,
  activeId,
  visibleCategories,
  controlsEnabled,
  onSelect,
  cameraControllerRef,
  controlsRef,
}: LocationMapProps) {
  const settings = TIER_SETTINGS[tier];

  return (
    <Canvas
      shadows={settings.shadows}
      dpr={settings.dpr}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: DEFAULT_FRAMING.pos.toArray(), fov: DEFAULT_FRAMING.fov, near: 0.5, far: 220 }}
      style={{ background: palette.background }}
    >
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.fog, palette.fogNear, palette.fogFar]} />

      <ambientLight color={palette.ambientColor} intensity={palette.ambientIntensity} />
      <hemisphereLight color={palette.hemiSky} groundColor={palette.hemiGround} intensity={0.55} />
      <directionalLight
        color={palette.sunColor}
        intensity={palette.sunIntensity}
        position={[24, 34, 18]}
        castShadow={settings.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-far={120}
      />

      <Suspense fallback={null}>
        <LocationScene
          tier={tier}
          palette={palette}
          activeId={activeId}
          visibleCategories={visibleCategories}
          controlsEnabled={controlsEnabled}
          onSelect={onSelect}
          cameraControllerRef={cameraControllerRef}
          controlsRef={controlsRef}
        />
      </Suspense>
    </Canvas>
  );
}
