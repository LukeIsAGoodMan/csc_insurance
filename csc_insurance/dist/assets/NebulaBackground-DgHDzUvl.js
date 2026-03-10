import{j as e,r as o}from"./index-CR5yoWKo.js";import{C as n,u as l}from"./react-three-fiber.esm-DWKzs27v.js";const r=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,s=`
  uniform float uTime;
  varying vec2 vUv;

  // Simple smooth noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;

    // Slow drifting noise
    float n1 = noise(uv * 2.0 + uTime * 0.03);
    float n2 = noise(uv * 3.0 - uTime * 0.02 + 5.0);
    float n3 = noise(uv * 1.5 + uTime * 0.015 + 10.0);

    // Blue-violet palette
    vec3 col1 = vec3(0.44, 0.36, 0.92); // violet
    vec3 col2 = vec3(0.30, 0.42, 0.88); // blue
    vec3 col3 = vec3(0.55, 0.48, 0.95); // lavender

    vec3 color = mix(col1, col2, n1);
    color = mix(color, col3, n2 * 0.5);

    // Radial fade to edges
    float dist = distance(uv, vec2(0.5));
    float vignette = 1.0 - smoothstep(0.1, 0.7, dist);

    // Final opacity: ~3-5% max — barely perceptible
    float alpha = (n1 * 0.3 + n2 * 0.2 + n3 * 0.15) * vignette * 0.05;

    gl_FragColor = vec4(color, alpha);
  }
`;function c(){const t=o.useRef(null),a=o.useMemo(()=>({uTime:{value:0}}),[]);return l(i=>{a.uTime.value=i.clock.elapsedTime}),e.jsxs("mesh",{ref:t,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{vertexShader:r,fragmentShader:s,uniforms:a,transparent:!0,depthWrite:!1})]})}function u(){return e.jsx("div",{className:"pointer-events-none fixed inset-0 z-0",children:e.jsx(n,{camera:{position:[0,0,1]},style:{background:"transparent"},gl:{alpha:!0,antialias:!1},dpr:[1,1.5],children:e.jsx(c,{})})})}export{u as NebulaBackground};
