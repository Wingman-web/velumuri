'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export interface CameraControllerHandle {
  flyTo: (framing: { pos: THREE.Vector3; look: THREE.Vector3 }, duration?: number) => void;
}

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export const CameraController = forwardRef<CameraControllerHandle, CameraControllerProps>(function CameraController(
  { controlsRef },
  ref,
) {
  const { camera } = useThree();
  const tweenRef = useRef<gsap.core.Timeline | null>(null);

  useImperativeHandle(ref, () => ({
    flyTo(framing, duration = 1.1) {
      tweenRef.current?.kill();
      const controls = controlsRef.current;
      const tl = gsap.timeline();
      tl.to(camera.position, { x: framing.pos.x, y: framing.pos.y, z: framing.pos.z, duration, ease: 'power3.inOut' }, 0);
      if (controls) {
        tl.to(
          controls.target,
          {
            x: framing.look.x,
            y: framing.look.y,
            z: framing.look.z,
            duration,
            ease: 'power3.inOut',
            onUpdate: () => controls.update(),
          },
          0,
        );
      }
      tweenRef.current = tl;
    },
  }));

  return null;
});
