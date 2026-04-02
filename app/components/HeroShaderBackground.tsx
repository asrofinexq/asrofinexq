"use client";

import { useEffect, useRef, useState } from "react";

type HeroShaderBackgroundProps = {
  darkMode: boolean;
  className?: string;
};

const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
in vec2 position;
void main(void) {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

out vec4 fragColor;
uniform vec2 resolution;
uniform float time;
uniform int pointerCount;

const vec3 re = vec3(6.0, 4.0, 6.0) * 1.25;
const vec3 boxsize = vec3(1.0, 1.25, 1.0);
const float walleps = 1e-3;

#define T time

float box(vec3 p, vec3 s, float r) {
  p = p - 7.7;
  return length(max(p, 0.1)) + p.x * 0.15;
}

float mat = 0.0;

float map(vec3 p) {
  float d = 50.0;
  float rm = -box(p, re, 1.5);
  d = min(d, rm);
  return d;
}

vec3 blue(vec2 uv) {
  vec2 n = vec2(0.0), q = vec2(0.0);
  uv *= 0.8;
  float d = dot(uv, uv);
  float s = 8.8;
  float a = 0.02;
  float b = sin(T * 0.2) * 0.5;
  float t = T;
  mat2 m = mat2(0.6, 1.2, -1.2, 0.6);

  for (float i = 0.0; i < 30.0; i++) {
    n *= m;
    q = uv * s - t + b + i + n;
    a += dot(cos(q) / s, vec2(0.2));
    n -= sin(q);
    s *= 1.2;
  }

  vec3 col = vec3(4.0) * (a + 0.2) + a + a;
  return col;
}

vec3 nm(vec3 p) {
  float d = map(p);
  vec3 n = d - vec3(1.0);
  return n;
}

void main(void) {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
  vec3 col = vec3(0.0);
  vec3 ro = vec3(0.0, 0.5, 1.6);
  vec3 rd = normalize(vec3(uv, 1.0) + 0.6);
  vec3 p = ro;
  float dd = 1.0;

  const float steps = 180.0;
  for (float i = 0.0; i < steps; i++) {
    float d = map(p);
    if (d < 1e-2) {
      if (p.z > 1.0) {
        col += blue(p.xy * 0.2) - clamp(dd / 16.6, 0.0, 1.0);
      }
      break;
    }
    p += rd * d;
    dd += d;
  }

  fragColor = vec4(col, 1.0);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroShaderBackground({ darkMode, className }: HeroShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const darkModeRef = useRef(darkMode);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      setFallbackMode(true);
      return;
    }

    const touches = new Map<number, PointerEvent>();
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ]);

    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "time");
    const pointerCountLoc = gl.getUniformLocation(program, "pointerCount");
    const resolutionLoc = gl.getUniformLocation(program, "resolution");
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.type === "pointerdown" || event.type === "pointermove") {
        touches.set(event.pointerId, event);
      } else if (event.type === "pointerup" || event.type === "pointercancel") {
        touches.delete(event.pointerId);
      }
    };

    let rafId = 0;
    const draw = (now: number) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      if (timeLoc) gl.uniform1f(timeLoc, now * 0.001);
      if (pointerCountLoc) gl.uniform1i(pointerCountLoc, touches.size);
      if (resolutionLoc) gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5);
      rafId = window.requestAnimationFrame(draw);
    };

    resize();
    rafId = window.requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointer, { passive: true });
    canvas.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("pointerup", onPointer, { passive: true });
    canvas.addEventListener("pointercancel", onPointer, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerup", onPointer);
      canvas.removeEventListener("pointercancel", onPointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  if (fallbackMode) {
    return (
      <div
        className={className}
        aria-hidden
        style={{
          background: darkMode
            ? "radial-gradient(1200px 700px at 50% 35%, #5a5a5a 0%, #303030 42%, #0a0a0a 100%)"
            : "radial-gradient(1200px 700px at 50% 35%, #ffffff 0%, #dfdfdf 46%, #b9b9b9 100%)",
          filter: darkMode ? "contrast(1.14) brightness(1.02)" : "contrast(1.18) brightness(0.98)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      style={{
        filter: darkMode
          ? "grayscale(1) contrast(1.08) brightness(1.0)"
          : "grayscale(1) invert(1) contrast(1.18) brightness(0.88)",
      }}
    />
  );
}
