'use client';

// Adapted from the reactbits.dev "Silk" background (JS + CSS variant) —
// installed by hand rather than via `npx shadcn@latest add
// @react-bits/Silk-JS-CSS`, since that CLI insists on running a full
// shadcn `init` first (components.json + Tailwind + CSS variables) on a
// project that has neither and uses a single plain-CSS file instead.
// This keeps the same visual result — an OGL WebGL shader plane with a
// flowing, silky noise pattern — without pulling in a second styling
// system. `ogl` is the only real dependency (see package.json).
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import './Silk.css';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uNoiseIntensity;
uniform float uRotation;

const float pi = 3.141592653589793;

// Cheap per-pixel grain — not the flow pattern itself, just fine texture
// grain subtracted from it (the fabric's "weave").
float noise(vec2 texCoord) {
  float G = 2.71828182845904523536;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, s, -s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  // The cos() cross-term inside the outer sin() is what bends otherwise-
  // straight diagonal bands into the curved, overlapping folds a length
  // of draped silk actually shows — a plain sin(x+y) (what the first
  // pass here used, via a value-noise stand-in) just reads as flat smoky
  // bands with no sense of drape.
  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                            sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

export interface SilkProps {
  /** Overall animation speed. @default 5 */
  speed?: number;
  /** Pattern scale — higher packs the flow tighter. @default 1 */
  scale?: number;
  /** Base tint, any CSS color string. @default '#7B7481' */
  color?: string;
  /** Strength of the noise distortion layered over the flow. @default 1.5 */
  noiseIntensity?: number;
  /** Rotation of the flow field, in radians. @default 0 */
  rotation?: number;
}

export function Silk({ speed = 5, scale = 1, color = '#7B7481', noiseIntensity = 1.5, rotation = 0 }: SilkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(color) },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uNoiseIntensity: { value: noiseIntensity },
        uRotation: { value: rotation },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let rafId = 0;
    const start = performance.now();
    const draw = (now: number) => {
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
      rafId = requestAnimationFrame(draw);
    };
    if (reducedMotion) {
      // Render one still frame so the surface still reads as "silk"
      // without a continuously running animation loop.
      program.uniforms.uTime.value = 0;
      renderer.render({ scene: mesh });
    } else {
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      gl.canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [speed, scale, color, noiseIntensity, rotation]);

  return <div className="silk-container" ref={containerRef} />;
}
