"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MathUtils } from "three";
import type { ThemeId } from "@/data/themes";
import {
  DEFAULT_THEME,
  readStoredTheme,
  themeParticleTint,
} from "@/lib/theme";

const MORPH_IMAGES = [
  "/image-name.png",
  "/image-stack.png",
  "/image-tools.png",
] as const;

const RIPPLE_SLOTS = 8;

const vertexShader = /* glsl */ `
uniform float uProgress;
uniform float uPointSize;
uniform float uDpr;
uniform float uTime;
uniform vec3 uTint;

uniform vec2 uLightPos;
uniform float uLightStrength;
uniform float uLightRadius;

uniform vec2 uRippleOrigins[${RIPPLE_SLOTS}];
uniform float uRippleStarts[${RIPPLE_SLOTS}];

attribute vec2 aPosFrom;
attribute vec2 aPosTo;
attribute vec3 aColFrom;
attribute vec3 aColTo;

varying vec3 vColor;

#define NOISE_FREQUENCY 0.012
#define MORPH_DURATION 0.4
#define RIPPLE_SPEED 260.0
#define RIPPLE_WIDTH 28.0
#define RIPPLE_DURATION 1.1
#define RIPPLE_BRIGHTNESS 0.6
#define LIGHT_BRIGHTNESS 0.3

// Compact 3D simplex noise
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float simplexNoise3d(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  float noiseFrom = simplexNoise3d(vec3(aPosFrom * NOISE_FREQUENCY, 0.0));
  float noiseTo = simplexNoise3d(vec3(aPosTo * NOISE_FREQUENCY, 0.0));
  float noise = smoothstep(-1.0, 1.0, mix(noiseFrom, noiseTo, uProgress));
  float delay = (1.0 - MORPH_DURATION) * noise;
  float local = clamp((uProgress - delay) / MORPH_DURATION, 0.0, 1.0);
  float t = local * local * local;

  vec2 pos = mix(aPosFrom, aPosTo, t);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + position.xy, 0.0, 1.0);
  gl_PointSize = uPointSize * uDpr;

  vec3 trueColor = mix(aColFrom, aColTo, t);
  vec3 color = dot(trueColor, vec3(0.299, 0.587, 0.114)) * uTint;

  float light =
      smoothstep(uLightRadius, 0.0, distance(pos, uLightPos)) * uLightStrength;
  color += light * LIGHT_BRIGHTNESS;

  float ripple = 0.0;
  for (int k = 0; k < ${RIPPLE_SLOTS}; k++) {
    float age = uTime - uRippleStarts[k];
    float radius = age * RIPPLE_SPEED;
    float ring = exp(
        -pow((distance(pos, uRippleOrigins[k]) - radius) / RIPPLE_WIDTH, 2.0));
    float life = max(0.0, 1.0 - age / RIPPLE_DURATION);
    ripple += ring * life;
  }
  color += ripple * RIPPLE_BRIGHTNESS;

  vColor = color;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;

void main() {
  if (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;
  gl_FragColor = vec4(vColor, 1.0);
}
`;

type SampledFrame = {
  positions: Float32Array;
  colors: Float32Array;
};

type SampledScene = {
  count: number;
  positions: Float32Array[];
  colors: Float32Array[];
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function sampleImage(
  img: HTMLImageElement,
  width: number,
  height: number,
): { positions: number[]; colors: number[] } {
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(width);
  canvas.height = Math.floor(height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { positions: [], colors: [] };

  const scale = Math.max(width / img.width, height / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const positions: number[] = [];
  const colors: number[] = [];

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const i = (y * canvas.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const score = luma * 0.2 + 0.8 * Math.max(r, g, b);
      // Keep detailed clay art; mild cutoff still ignores near-black noise.
      if (a > 16 && score > 85) {
        positions.push(x - width / 2, height / 2 - y);
        colors.push(r / 255, g / 255, b / 255);
      }
    }
  }

  return { positions, colors };
}

function padFrame(
  frame: { positions: number[]; colors: number[] },
  count: number,
): SampledFrame {
  const pos = new Float32Array(count * 2);
  const col = new Float32Array(count * 3);
  const n = frame.positions.length / 2;
  for (let i = 0; n > 0 && i < count; i++) {
    const t = i % n;
    pos[i * 2] = frame.positions[t * 2];
    pos[i * 2 + 1] = frame.positions[t * 2 + 1];
    col[i * 3] = frame.colors[t * 3];
    col[i * 3 + 1] = frame.colors[t * 3 + 1];
    col[i * 3 + 2] = frame.colors[t * 3 + 2];
  }
  return { positions: pos, colors: col };
}

async function sampleImages(
  width: number,
  height: number,
  images: readonly string[],
): Promise<SampledScene> {
  const loaded = await Promise.all(images.map(loadImage));
  const frames = loaded.map((img) => sampleImage(img, width, height));
  const count = Math.max(...frames.map((f) => f.positions.length / 2));
  const padded = frames.map((f) => padFrame(f, count));
  return {
    count,
    positions: padded.map((f) => f.positions),
    colors: padded.map((f) => f.colors),
  };
}

type MouseState = { x: number; y: number; active: number };

type ClockApi = {
  targetStep: () => number;
  seconds: () => number;
};

function Particles({
  width,
  height,
  dpr,
  images,
  mouse,
  clock,
}: {
  width: number;
  height: number;
  dpr: number;
  images: readonly string[];
  mouse: React.MutableRefObject<MouseState>;
  clock: ClockApi;
}) {
  const [scene, setScene] = useState<SampledScene | null>(null);
  const stepRef = useRef(0);
  const progressRef = useRef(0);
  const lastMouse = useRef(new THREE.Vector2(Infinity, Infinity));
  const lastMoveTime = useRef(-1000);
  const rippleArmed = useRef(false);
  const rippleIndex = useRef(0);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 0 },
        uPointSize: { value: 2 },
        uDpr: { value: 1 },
        uTime: { value: 0 },
        uTint: {
          value: new THREE.Color(themeParticleTint[DEFAULT_THEME]),
        },
        uLightPos: { value: new THREE.Vector2() },
        uLightStrength: { value: 0 },
        uLightRadius: { value: 90 },
        uRippleOrigins: {
          value: Array.from({ length: RIPPLE_SLOTS }, () => new THREE.Vector2()),
        },
        uRippleStarts: { value: new Float32Array(RIPPLE_SLOTS).fill(-1000) },
      },
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    sampleImages(width, height, images).then((result) => {
      if (!cancelled) setScene(result);
    });
    return () => {
      cancelled = true;
    };
  }, [width, height, images]);

  const geometry = useMemo(() => {
    if (!scene) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(scene.count * 3), 3),
    );
    geo.setAttribute(
      "aPosFrom",
      new THREE.BufferAttribute(new Float32Array(scene.positions[0]), 2),
    );
    geo.setAttribute(
      "aPosTo",
      new THREE.BufferAttribute(
        new Float32Array(scene.positions[1 % scene.positions.length]),
        2,
      ),
    );
    geo.setAttribute(
      "aColFrom",
      new THREE.BufferAttribute(new Float32Array(scene.colors[0]), 3),
    );
    geo.setAttribute(
      "aColTo",
      new THREE.BufferAttribute(
        new Float32Array(scene.colors[1 % scene.colors.length]),
        3,
      ),
    );
    stepRef.current = 0;
    return geo;
  }, [scene]);

  useEffect(() => () => geometry?.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => {
    material.uniforms.uDpr.value = dpr;
  }, [dpr, material]);

  useEffect(() => {
    const setTint = (id: ThemeId) => {
      const hex = themeParticleTint[id] ?? themeParticleTint[DEFAULT_THEME];
      material.uniforms.uTint.value.set(hex);
    };

    setTint(readStoredTheme());

    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<ThemeId>).detail;
      if (detail) setTint(detail);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === "gd-theme" && event.newValue) {
        setTint(event.newValue as ThemeId);
      }
    };

    window.addEventListener("gd-theme", onTheme);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("gd-theme", onTheme);
      window.removeEventListener("storage", onStorage);
    };
  }, [material]);

  useFrame((_, delta) => {
    if (!scene || !geometry) return;
    const uniforms = material.uniforms;
    const frames = scene.positions.length;
    const dt = Math.min(delta, 1 / 30);
    uniforms.uTime.value += dt;

    const target = clock.targetStep();
    progressRef.current = MathUtils.damp(progressRef.current, target, 3, dt);
    const floor = Math.floor(progressRef.current);
    uniforms.uProgress.value = progressRef.current - floor;

    const from = ((floor % frames) + frames) % frames;
    if (from !== stepRef.current) {
      const to = (from + 1) % frames;
      (
        geometry.attributes.aPosFrom.array as Float32Array
      ).set(scene.positions[from]);
      (
        geometry.attributes.aPosTo.array as Float32Array
      ).set(scene.positions[to]);
      (
        geometry.attributes.aColFrom.array as Float32Array
      ).set(scene.colors[from]);
      (geometry.attributes.aColTo.array as Float32Array).set(scene.colors[to]);
      for (const key of ["aPosFrom", "aPosTo", "aColFrom", "aColTo"] as const) {
        geometry.attributes[key].needsUpdate = true;
      }
      stepRef.current = from;
    }

    const m = mouse.current;
    if (
      m.active &&
      Math.hypot(m.x - lastMouse.current.x, m.y - lastMouse.current.y) > 1
    ) {
      lastMouse.current.set(m.x, m.y);
      lastMoveTime.current = uniforms.uTime.value;
      rippleArmed.current = false;
    }

    const sinceMove = uniforms.uTime.value - lastMoveTime.current;
    const lightTarget = m.active && sinceMove < 0.08 ? 1 : 0;
    uniforms.uLightPos.value.set(m.x, m.y);
    uniforms.uLightStrength.value = MathUtils.damp(
      uniforms.uLightStrength.value,
      lightTarget,
      14,
      dt,
    );

    if (m.active && !rippleArmed.current && sinceMove > 0.1) {
      rippleArmed.current = true;
      const i = rippleIndex.current;
      uniforms.uRippleOrigins.value[i].set(m.x, m.y);
      uniforms.uRippleStarts.value[i] = uniforms.uTime.value;
      rippleIndex.current = (i + 1) % RIPPLE_SLOTS;
    }
  });

  if (!geometry) return null;
  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  );
}

function createMorphClock(delay: number, morph: number, steps: number): ClockApi {
  const start = performance.now() / 1000;
  return {
    seconds: () => performance.now() / 1000 - start,
    targetStep: () => {
      const elapsed = performance.now() / 1000 - start - delay;
      return Math.max(0, Math.floor(elapsed / morph));
    },
  };
}

export function ParticleScene({
  delay = 0.95,
  morphSeconds = 6,
}: {
  delay?: number;
  morphSeconds?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef<MouseState>({ x: 0, y: 0, active: 0 });
  const clockRef = useRef<ClockApi | null>(null);
  if (!clockRef.current) {
    clockRef.current = createMorphClock(
      delay,
      morphSeconds,
      MORPH_IMAGES.length,
    );
  }

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, 2));
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ width: rect.width, height: rect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mt-3 h-30 w-full overflow-hidden rounded-md border border-dark-700 border-t-hairline sm:h-35 md:h-45"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouse.current.x = e.clientX - rect.left - rect.width / 2;
        mouse.current.y = rect.height / 2 - (e.clientY - rect.top);
        mouse.current.active = 1;
      }}
      onPointerLeave={() => {
        mouse.current.active = 0;
      }}
      aria-label="Interactive particle field morphing between Gregory Dean branding and security tooling"
    >
      {size.width > 0 && size.height > 0 && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
          dpr={dpr}
          gl={{ antialias: true, alpha: true }}
        >
          <Particles
            width={size.width}
            height={size.height}
            dpr={dpr}
            images={MORPH_IMAGES}
            mouse={mouse}
            clock={clockRef.current}
          />
        </Canvas>
      )}
    </div>
  );
}
