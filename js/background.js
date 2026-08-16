/*
 * 海洋流体背景（WebGL）
 * ------------------------------------------------------------------
 * 用噪声域扭曲（domain warping）生成类似 Unicorn Studio 的
 * 「丝绸流体」动效，配色为苍蓝色系（#134857）。
 *
 * 想改颜色：调整下方 FRAG 里的 deep / sea / wave / foam 四个颜色，
 * 以及 speed、scale 参数。
 */

(function () {
  "use strict";

  var canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- 顶点着色器：画一个覆盖全屏的三角形 ----
  var VERT = [
    "attribute vec2 aPos;",
    "void main() { gl_Position = vec4(aPos, 0.0, 1.0); }"
  ].join("\n");

  // ---- 片元着色器：海洋流体 ----
  var FRAG = [
    "precision highp float;",
    "uniform vec2 uResolution;",
    "uniform float uTime;",
    "uniform float uSpeed;",
    "uniform float uScale;",
    "",
    "float hash(vec2 p) {",
    "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);",
    "}",
    "",
    "float noise(vec2 p) {",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  vec2 u = f * f * (3.0 - 2.0 * f);",
    "  return mix(",
    "    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),",
    "    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),",
    "    u.y);",
    "}",
    "",
    "float fbm(vec2 p) {",
    "  float v = 0.0;",
    "  float a = 0.5;",
    "  for (int i = 0; i < 4; i++) {",
    "    v += a * noise(p);",
    "    p = p * 2.03 + vec2(1.7, 9.2);",
    "    a *= 0.5;",
    "  }",
    "  return v;",
    "}",
    "",
    "void main() {",
    "  vec2 uv = gl_FragCoord.xy / uResolution.xy;",
    "  uv.x *= uResolution.x / uResolution.y;",
    "  float t = uTime * uSpeed;",
    "",
    "  vec2 p = uv * uScale + vec2(0.0, t * 0.6);",
    "",
    "  // 域扭曲，形成丝绸般的流动感",
    "  vec2 q = vec2(",
    "    fbm(p + vec2(0.0, t)),",
    "    fbm(p + vec2(5.2, 1.3) - vec2(0.0, t * 0.8))",
    "  );",
    "  vec2 r = vec2(",
    "    fbm(p + 2.6 * q + vec2(1.7, 9.2) + vec2(t * 0.9, 0.0)),",
    "    fbm(p + 2.6 * q + vec2(8.3, 2.8) - vec2(t * 0.7, 0.0))",
    "  );",
    "  float f = fbm(p + 2.2 * r);",
    "",
    "  // ---- 苍蓝色系（围绕 #134857）----",
    "  vec3 deep = vec3(0.039, 0.180, 0.235);   // 深苍蓝 #0a2e3c",
    "  vec3 sea  = vec3(0.075, 0.282, 0.341);   // 苍蓝 #134857",
    "  vec3 wave = vec3(0.184, 0.490, 0.573);   // 青蓝 #2f7d92",
    "  vec3 foam = vec3(0.741, 0.894, 0.925);   // 淡青白 #bde4ec",
    "",
    "  vec3 col = mix(deep, sea, smoothstep(0.30, 0.50, f));",
    "  col = mix(col, wave, smoothstep(0.50, 0.68, f));",
    "  col = mix(col, foam, smoothstep(0.68, 0.86, f));",
    "",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  var gl =
    canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power"
    }) || canvas.getContext("experimental-webgl");

  if (!gl) {
    // 不支持 WebGL 时用纯色兜底
    canvas.parentElement.style.background = "#0d3a49";
    return;
  }

  function compile(type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader error:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  var program = gl.createProgram();
  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  // 全屏三角形
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  var aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uResolution = gl.getUniformLocation(program, "uResolution");
  var uTime = gl.getUniformLocation(program, "uTime");
  var uSpeed = gl.getUniformLocation(program, "uSpeed");
  var uScale = gl.getUniformLocation(program, "uScale");

  // ---- 可调参数 ----
  var SPEED = 0.2; // 流动速度，越大越快
  var SCALE = 0.3;  // 纹理密度，越大波浪越细碎

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.floor(window.innerWidth * dpr);
    var h = Math.floor(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  var start = performance.now();

  function render(now) {
    resize();
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform1f(uSpeed, SPEED);
    gl.uniform1f(uScale, SCALE);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduceMotion) requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);

  if (reduceMotion) {
    render(start); // 减少动态效果：只渲染一帧
  } else {
    requestAnimationFrame(render);
  }
})();
