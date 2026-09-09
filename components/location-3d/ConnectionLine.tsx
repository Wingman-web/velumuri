'use client';

import { useEffect, useRef, useState } from 'react';
import { Line } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface ConnectionLineProps {
  from: [number, number, number];
  to: [number, number, number] | null;
  color: string;
}

export function ConnectionLine({ from, to, color }: ConnectionLineProps) {
  const [points, setPoints] = useState<[number, number, number][]>([from, from]);
  const lastTarget = useRef<[number, number, number]>(from);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    tweenRef.current?.kill();
    const start = new THREE.Vector3(...from);
    const target = new THREE.Vector3(...(to ?? lastTarget.current));
    const progress = { t: 0 };

    if (to) lastTarget.current = to;

    tweenRef.current = gsap.to(progress, {
      t: to ? 1 : 0,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        const end = start.clone().lerp(target, progress.t);
        setPoints([[start.x, start.y, start.z], [end.x, end.y, end.z]]);
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [to, from]);

  return <Line points={points} color={color} lineWidth={1.4} dashed dashSize={0.35} gapSize={0.22} transparent opacity={0.85} />;
}
