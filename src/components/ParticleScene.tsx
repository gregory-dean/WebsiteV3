"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  ShaderMaterial,
  Vector2,
} from "three";
import { PARTICLE_FLAG_TEXT } from "@/data/ctf";
import { PARTICLE_FRAME_CLASS } from "@/data/site";
import type { ThemeId } from "@/data/themes";
import { CTF_EVENT, getLastCtf } from "@/lib/ctf-event";
import { drawFilledText, drawPadlock } from "@/lib/draw-text";
import { getLastSignal, SIGNAL_EVENT } from "@/lib/signal-event";
import {
  DEFAULT_THEME,
  readStoredTheme,
  themeParticleTint,
} from "@/lib/theme";

type ExtraKind = "none" | "flag" | "trophy";

function resolveExtra(): ExtraKind {
  if (!getLastSignal().on) return "none";
  const ctf = getLastCtf();
  return ctf.found >= ctf.total ? "trophy" : "flag";
}

const MORPH_IMAGES = [
  "/image-name.webp",
  "/image-stack.webp",
  "/image-tools.webp",
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

function sampleCanvas(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
  stride: number,
): { positions: number[]; colors: number[] } {
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(width);
  canvas.height = Math.floor(height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { positions: [], colors: [] };

  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const dw = sourceWidth * scale;
  const dh = sourceHeight * scale;
  ctx.drawImage(source, (width - dw) / 2, (height - dh) / 2, dw, dh);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const positions: number[] = [];
  const colors: number[] = [];

  for (let y = 0; y < canvas.height; y += stride) {
    for (let x = 0; x < canvas.width; x += stride) {
      const i = (y * canvas.width + x) * 4;
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      const a = data[i + 3] ?? 0;
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const score = luma * 0.2 + 0.8 * Math.max(r, g, b);
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
    pos[i * 2] = frame.positions[t * 2] ?? 0;
    pos[i * 2 + 1] = frame.positions[t * 2 + 1] ?? 0;
    col[i * 3] = frame.colors[t * 3] ?? 0;
    col[i * 3 + 1] = frame.colors[t * 3 + 1] ?? 0;
    col[i * 3 + 2] = frame.colors[t * 3 + 2] ?? 0;
  }
  return { positions: pos, colors: col };
}

async function sampleImages(
  width: number,
  height: number,
  images: readonly string[],
  stride: number,
): Promise<SampledScene> {
  const loaded = await Promise.all(images.map(loadImage));
  const frames = loaded.map((img) =>
    sampleCanvas(img, img.width, img.height, width, height, stride),
  );
  const count = Math.max(...frames.map((f) => f.positions.length / 2), 1);
  const padded = frames.map((f) => padFrame(f, count));
  return {
    count,
    positions: padded.map((f) => f.positions),
    colors: padded.map((f) => f.colors),
  };
}

function explodeFrame(frame: SampledFrame, spread: number): SampledFrame {
  const count = frame.positions.length / 2;
  const positions = new Float32Array(count * 2);
  const colors = new Float32Array(frame.colors);
  for (let i = 0; i < count; i++) {
    const x = frame.positions[i * 2] ?? 0;
    const y = frame.positions[i * 2 + 1] ?? 0;
    const hash = Math.sin(i * 12.9898 + x * 0.13 + y * 0.17) * 43758.5453;
    const frac = hash - Math.floor(hash);
    const jitter = 0.72 + frac * 0.75;
    const throwOut = 24 + frac * 96;
    const len = Math.hypot(x, y);
    const nx = len > 0.5 ? x / len : Math.cos(frac * Math.PI * 2);
    const ny = len > 0.5 ? y / len : Math.sin(frac * Math.PI * 2);
    positions[i * 2] = x * spread * jitter + nx * throwOut;
    positions[i * 2 + 1] = y * spread * jitter + ny * throwOut;
  }
  return { positions, colors };
}

type MouseState = { x: number; y: number; active: number };

type ClockApi = {
  targetStep: () => number;
  seconds: () => number;
  advance: (dt: number) => void;
  setPaused: (paused: boolean) => void;
  reset: () => void;
};

function createMaterial() {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uProgress: { value: 0 },
      uPointSize: { value: 2 },
      uDpr: { value: 1 },
      uTime: { value: 0 },
      uTint: { value: new Color(themeParticleTint[DEFAULT_THEME]) },
      uLightPos: { value: new Vector2() },
      uLightStrength: { value: 0 },
      uLightRadius: { value: 90 },
      uRippleOrigins: {
        value: Array.from({ length: RIPPLE_SLOTS }, () => new Vector2()),
      },
      uRippleStarts: { value: new Float32Array(RIPPLE_SLOTS).fill(-1000) },
    },
  });
}

function disposeGeometry(geometry: BufferGeometry | null) {
  if (!geometry) return;
  geometry.dispose();
  for (const key of Object.keys(geometry.attributes)) {
    geometry.deleteAttribute(key);
  }
}

function Particles({
  width,
  height,
  dpr,
  images,
  mouse,
  clock,
  stride,
}: {
  width: number;
  height: number;
  dpr: number;
  images: readonly string[];
  mouse: React.MutableRefObject<MouseState>;
  clock: ClockApi;
  stride: number;
}) {
  const [scene, setScene] = useState<SampledScene | null>(null);
  const material = useMemo(() => createMaterial(), []);
  const extraRef = useRef<ExtraKind>("none");
  const burstPhase = useRef<"idle" | "gather" | "hold" | "boom" | "into" | "cycle">(
    "idle",
  );
  const burstTimer = useRef(0);
  const lockRipple = useRef(false);
  const stepRef = useRef(0);
  const progressRef = useRef(0);
  const lastMouse = useRef(new Vector2(Infinity, Infinity));
  const lastMoveTime = useRef(-1000);
  const rippleArmed = useRef(false);
  const rippleIndex = useRef(0);
  const materialRef = useRef(material);
  const geometryRef = useRef<BufferGeometry | null>(null);

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    let cancelled = false;
    sampleImages(width, height, images, stride)
      .then((result) => {
        if (!cancelled) setScene(result);
      })
      .catch(() => {
        if (!cancelled) setScene(null);
      });
    return () => {
      cancelled = true;
    };
  }, [width, height, images, stride]);

  const lockFrame = useMemo(() => {
    if (!scene) return null;
    const canvas = drawPadlock(width, height);
    const sampled = sampleCanvas(canvas, width, height, width, height, stride);
    return padFrame(sampled, scene.count);
  }, [scene, width, height, stride]);

  const flagFrame = useMemo(() => {
    if (!scene) return null;
    const canvas = drawFilledText(width, height, PARTICLE_FLAG_TEXT);
    const sampled = sampleCanvas(canvas, width, height, width, height, stride);
    return padFrame(sampled, scene.count);
  }, [scene, width, height, stride]);

  const burstFrame = useMemo(() => {
    if (!lockFrame) return null;
    return explodeFrame(lockFrame, 2.4);
  }, [lockFrame]);

  const geometry = useMemo(() => {
    if (!scene) return null;
    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(scene.count * 3), 3),
    );
    geo.setAttribute("aPosFrom", new BufferAttribute(scene.positions[0]!, 2));
    geo.setAttribute(
      "aPosTo",
      new BufferAttribute(scene.positions[1 % scene.positions.length]!, 2),
    );
    geo.setAttribute("aColFrom", new BufferAttribute(scene.colors[0]!, 3));
    geo.setAttribute(
      "aColTo",
      new BufferAttribute(scene.colors[1 % scene.colors.length]!, 3),
    );
    return geo;
  }, [scene]);

  useEffect(() => {
    geometryRef.current = geometry;
    stepRef.current = 0;
    return () => disposeGeometry(geometry);
  }, [geometry]);

  useEffect(() => {
    materialRef.current.uniforms.uDpr!.value = dpr;
  }, [dpr]);

  useEffect(() => {
    const setTint = (id: ThemeId) => {
      const hex = themeParticleTint[id] ?? themeParticleTint[DEFAULT_THEME];
      materialRef.current.uniforms.uTint!.value.set(hex);
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

    const applyExtra = () => {
      const next = resolveExtra();
      if (next !== extraRef.current) {
        if (next !== "none") lockRipple.current = true;
        if (next === "trophy") {
          burstPhase.current = "gather";
          burstTimer.current = 0;
          stepRef.current = -1;
        } else {
          burstPhase.current = "idle";
        }
      }
      extraRef.current = next;
    };

    applyExtra();

    window.addEventListener("gd-theme", onTheme);
    window.addEventListener("storage", onStorage);
    window.addEventListener(SIGNAL_EVENT, applyExtra);
    window.addEventListener(CTF_EVENT, applyExtra);
    return () => {
      window.removeEventListener("gd-theme", onTheme);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SIGNAL_EVENT, applyExtra);
      window.removeEventListener(CTF_EVENT, applyExtra);
    };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    clock.advance(dt);
    const currentScene = scene;
    const currentGeometry = geometryRef.current;
    const material = materialRef.current;
    if (!currentScene || !currentGeometry) return;

    const uniforms = material.uniforms;
    uniforms.uTime!.value += dt;

    const kind = extraRef.current;
    const phase = burstPhase.current;
    const bursting =
      kind === "trophy" &&
      (phase === "gather" || phase === "hold" || phase === "boom");

    const positions = bursting && lockFrame && burstFrame
      ? [...currentScene.positions, lockFrame.positions, burstFrame.positions]
      : kind === "flag" && flagFrame
        ? [...currentScene.positions, flagFrame.positions]
        : currentScene.positions;
    const colors = bursting && lockFrame && burstFrame
      ? [...currentScene.colors, lockFrame.colors, burstFrame.colors]
      : kind === "flag" && flagFrame
        ? [...currentScene.colors, flagFrame.colors]
        : currentScene.colors;
    const frames = positions.length;
    const lockIndex = currentScene.positions.length;
    const burstIndex = lockIndex + 1;

    let target = clock.targetStep();
    let damp = 3;

    if (bursting && lockFrame && burstFrame) {
      if (phase === "gather") {
        target = lockIndex;
        if (Math.abs(progressRef.current - lockIndex) < 0.05) {
          burstPhase.current = "hold";
          burstTimer.current = 0;
        }
      } else if (phase === "hold") {
        target = lockIndex;
        burstTimer.current += dt;
        if (burstTimer.current > 0.75) {
          burstPhase.current = "boom";
          const now = uniforms.uTime!.value;
          for (let k = 0; k < RIPPLE_SLOTS; k++) {
            const angle = (k / RIPPLE_SLOTS) * Math.PI * 2;
            uniforms.uRippleOrigins!.value[k].set(
              Math.cos(angle) * 10,
              Math.sin(angle) * 10,
            );
            uniforms.uRippleStarts!.value[k] = now + k * 0.035;
          }
        }
      } else {
        target = burstIndex;
        damp = 9;
        if (Math.abs(progressRef.current - burstIndex) < 0.06) {
          burstPhase.current = "into";
          (currentGeometry.attributes.aPosFrom!.array as Float32Array).set(
            burstFrame.positions,
          );
          (currentGeometry.attributes.aPosTo!.array as Float32Array).set(
            currentScene.positions[0]!,
          );
          (currentGeometry.attributes.aColFrom!.array as Float32Array).set(
            burstFrame.colors,
          );
          (currentGeometry.attributes.aColTo!.array as Float32Array).set(
            currentScene.colors[0]!,
          );
          for (const key of ["aPosFrom", "aPosTo", "aColFrom", "aColTo"] as const) {
            currentGeometry.attributes[key]!.needsUpdate = true;
          }
          progressRef.current = 0;
          stepRef.current = 0;
          target = 1;
          damp = 4;
        }
      }
    } else if (kind === "trophy" && phase === "into") {
      target = 1;
      damp = 4;
      if (progressRef.current > 0.92) {
        burstPhase.current = "cycle";
        clock.reset();
        progressRef.current = 0;
        stepRef.current = -1;
        target = 0;
      }
    }

    progressRef.current = MathUtils.damp(progressRef.current, target, damp, dt);
    const floor = Math.floor(progressRef.current);
    uniforms.uProgress!.value = progressRef.current - floor;

    const from = ((floor % frames) + frames) % frames;
    if (from !== stepRef.current && burstPhase.current !== "into") {
      const to = (from + 1) % frames;
      (currentGeometry.attributes.aPosFrom!.array as Float32Array).set(
        positions[from]!,
      );
      (currentGeometry.attributes.aPosTo!.array as Float32Array).set(
        positions[to]!,
      );
      (currentGeometry.attributes.aColFrom!.array as Float32Array).set(
        colors[from]!,
      );
      (currentGeometry.attributes.aColTo!.array as Float32Array).set(
        colors[to]!,
      );
      for (const key of ["aPosFrom", "aPosTo", "aColFrom", "aColTo"] as const) {
        currentGeometry.attributes[key]!.needsUpdate = true;
      }
      stepRef.current = from;
    }

    if (lockRipple.current) {
      lockRipple.current = false;
      const i = rippleIndex.current;
      uniforms.uRippleOrigins!.value[i].set(0, 0);
      uniforms.uRippleStarts!.value[i] = uniforms.uTime!.value;
      rippleIndex.current = (i + 1) % RIPPLE_SLOTS;
    }

    const m = mouse.current;
    if (
      m.active &&
      Math.hypot(m.x - lastMouse.current.x, m.y - lastMouse.current.y) > 1
    ) {
      lastMouse.current.set(m.x, m.y);
      lastMoveTime.current = uniforms.uTime!.value;
      rippleArmed.current = false;
    }

    const sinceMove = uniforms.uTime!.value - lastMoveTime.current;
    const lightTarget = m.active && sinceMove < 0.08 ? 1 : 0;
    uniforms.uLightPos!.value.set(m.x, m.y);
    uniforms.uLightStrength!.value = MathUtils.damp(
      uniforms.uLightStrength!.value,
      lightTarget,
      14,
      dt,
    );

    if (m.active && !rippleArmed.current && sinceMove > 0.1) {
      rippleArmed.current = true;
      const i = rippleIndex.current;
      uniforms.uRippleOrigins!.value[i].set(m.x, m.y);
      uniforms.uRippleStarts!.value[i] = uniforms.uTime!.value;
      rippleIndex.current = (i + 1) % RIPPLE_SLOTS;
    }
  });

  if (!geometry) return null;
  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  );
}

function createMorphClock(delay: number, morph: number): ClockApi {
  let elapsed = 0;
  let paused = false;
  return {
    seconds: () => elapsed,
    targetStep: () => Math.max(0, Math.floor((elapsed - delay) / morph)),
    advance: (dt) => {
      if (!paused) elapsed += dt;
    },
    setPaused: (next) => {
      paused = next;
    },
    reset: () => {
      elapsed = delay;
    },
  };
}

export function ParticleScene({
  delay = 0.95,
  morphSeconds = 6,
  framed = false,
}: {
  delay?: number;
  morphSeconds?: number;
  framed?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef<MouseState>({ x: 0, y: 0, active: 0 });
  const clock = useMemo(
    () => createMorphClock(delay, morphSeconds),
    [delay, morphSeconds],
  );

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [dpr] = useState(() => {
    if (typeof window === "undefined") return 1;
    const mobile = window.innerWidth < 768;
    return Math.min(window.devicePixelRatio || 1, mobile ? 1 : 2);
  });
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const sync = () => {
      const hidden = document.hidden;
      clock.setPaused(hidden);
      setPlaying((current) => (hidden ? false : current));
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [clock]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setSize({ width: rect.width, height: rect.height });
    });
    ro.observe(el);

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        clock.setPaused(!visible || document.hidden);
        setPlaying(visible && !document.hidden);
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [clock]);

  const stride = size.width > 0 && size.width < 500 ? 6 : 4;

  return (
    <div
      ref={containerRef}
      className={framed ? "absolute inset-0" : PARTICLE_FRAME_CLASS}
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
      {size.width > 0 && size.height > 0 ? (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
          dpr={dpr}
          frameloop={playing ? "always" : "never"}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            depth: false,
            stencil: false,
          }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            const onLost = (event: Event) => {
              event.preventDefault();
              clock.setPaused(true);
            };
            const onRestored = () => {
              clock.setPaused(document.hidden);
            };
            canvas.addEventListener("webglcontextlost", onLost);
            canvas.addEventListener("webglcontextrestored", onRestored);
          }}
        >
          <Particles
            width={size.width}
            height={size.height}
            dpr={dpr}
            images={MORPH_IMAGES}
            mouse={mouse}
            clock={clock}
            stride={stride}
          />
        </Canvas>
      ) : null}
    </div>
  );
}
