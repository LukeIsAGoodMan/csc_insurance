import{u as v,r as t,j as a}from"./index-Dz47w2zS.js";import{C as f,V as l,u as m}from"./react-three-fiber.esm-CqSOtBNh.js";const p={"/auto-insurance":{col1:[.18,.24,.62],col2:[.25,.34,.78],col3:[.38,.42,.88]},"/home-insurance":{col1:[.52,.38,.92],col2:[.48,.44,.86],col3:[.6,.52,.95]},"/business-insurance":{col1:[.22,.28,.72],col2:[.34,.38,.82],col3:[.44,.48,.9]},"/travel-insurance":{col1:[.3,.42,.88],col2:[.44,.36,.92],col3:[.38,.52,.94]}},h={col1:[.44,.36,.92],col2:[.3,.42,.88],col3:[.55,.48,.95]};function d(){const{pathname:e}=v();return t.useMemo(()=>p[e]??h,[e])}const x=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,C=`
  uniform float uTime;
  uniform vec3 uCol1;
  uniform vec3 uCol2;
  uniform vec3 uCol3;
  varying vec2 vUv;

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

    float n1 = noise(uv * 2.0 + uTime * 0.03);
    float n2 = noise(uv * 3.0 - uTime * 0.02 + 5.0);
    float n3 = noise(uv * 1.5 + uTime * 0.015 + 10.0);

    vec3 color = mix(uCol1, uCol2, n1);
    color = mix(color, uCol3, n2 * 0.5);

    float dist = distance(uv, vec2(0.5));
    float vignette = 1.0 - smoothstep(0.1, 0.7, dist);

    float alpha = (n1 * 0.3 + n2 * 0.2 + n3 * 0.15) * vignette * 0.05;

    gl_FragColor = vec4(color, alpha);
  }
`;function g({colors:e}){const s=t.useRef(null),o=t.useMemo(()=>({uTime:{value:0},uCol1:{value:new l(...e.col1)},uCol2:{value:new l(...e.col2)},uCol3:{value:new l(...e.col3)}}),[]),c=t.useRef(e);return c.current=e,m((r,i)=>{o.uTime.value=r.clock.elapsedTime;const n=i*1.2,u=c.current;o.uCol1.value.lerp(new l(...u.col1),n),o.uCol2.value.lerp(new l(...u.col2),n),o.uCol3.value.lerp(new l(...u.col3),n)}),t.useEffect(()=>{o.uCol1.value.set(...e.col1),o.uCol2.value.set(...e.col2),o.uCol3.value.set(...e.col3)},[]),a.jsxs("mesh",{ref:s,children:[a.jsx("planeGeometry",{args:[2,2]}),a.jsx("shaderMaterial",{vertexShader:x,fragmentShader:C,uniforms:o,transparent:!0,depthWrite:!1})]})}function j(){const e=d();return a.jsx(f,{camera:{position:[0,0,1]},style:{background:"transparent"},gl:{alpha:!0,antialias:!1},dpr:[1,1.5],children:a.jsx(g,{colors:e})})}function T(){return a.jsx("div",{className:"pointer-events-none fixed inset-0 z-0",children:a.jsx(j,{})})}export{T as NebulaBackground};
