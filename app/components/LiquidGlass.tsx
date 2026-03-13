"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";

function GlassPlane() {
    const mesh = useRef<THREE.Mesh>(null!);

    // Professional Apple Light Palette: Pearl, Silver, and Frost
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#ffffffff") }, // Apple Background Gray
        uColor2: { value: new THREE.Color("#ffffffff") }, // Pure White
        uColor3: { value: new THREE.Color("#ffffffff") }, // Light Silver
        uColor4: { value: new THREE.Color("#ffffffff") }, // Deeper Metallic Gray
    }), []);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        const mat = mesh.current.material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value = clock.elapsedTime * 0.05; // Slow, elegant movement
    });

    const shader = useMemo(() => ({
        uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position.xy, 0.0, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uColor3;
            uniform vec3 uColor4;
            varying vec2 vUv;

            float random(in vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            float noise(in vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            float fbm(in vec2 st) {
                float v = 0.0;
                float a = 0.5;
                vec2 shift = vec2(100.0);
                mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
                for (int i = 0; i < 3; ++i) {
                    v += a * noise(st);
                    st = rot * st * 2.0 + shift;
                    a *= 0.5;
                }
                return v;
            }

            float getFluidHeight(vec2 st) {
                vec2 q = vec2(0.0);
                q.x = fbm(st + 0.00 * uTime);
                q.y = fbm(st + vec2(1.0));

                vec2 r = vec2(0.0);
                r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime);
                r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime);

                return fbm(st + 3.0 * r);
            }

            void main() {
                vec2 st = vUv * 2.0; 
                float h = getFluidHeight(st);

                vec2 eps = vec2(0.02, 0.0);
                float hX = getFluidHeight(st + eps.xy);
                float hY = getFluidHeight(st + eps.yx);
                vec3 normal = normalize(vec3(h - hX, h - hY, 0.15)); 
                
                vec3 viewDir = vec3(0.0, 0.0, 1.0); 
                vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));

                // Broad specular highlight for that sheer, glossy white look
                vec3 halfVector = normalize(lightDir + viewDir);
                float NdotH = max(0.0, dot(normal, halfVector));
                float specular = pow(NdotH, 24.0);

                vec2 q = vec2(fbm(st), fbm(st + vec2(5.2, 1.3)));
                vec2 r = vec2(fbm(st + 2.0 * q + uTime * 0.1), fbm(st + 2.0 * q - uTime * 0.1));
                
                vec3 color = mix(uColor1, uColor2, clamp(h * 2.0, 0.0, 1.0));
                color = mix(color, uColor3, clamp(length(q) * 0.6, 0.0, 1.0));
                color = mix(color, uColor4, clamp(length(r.x) * 0.8, 0.0, 1.0));

                // Add pure white light reflections
                color += vec3(1.0, 1.0, 1.0) * specular * 0.4;
                
                // Soft light vignette
                float vignette = 1.0 - smoothstep(0.5, 1.5, length(vUv - 0.5));
                color *= mix(0.85, 1.0, vignette);

                // Micro-dithering
                float noiseGrain = (fract(sin(dot(vUv, vec2(12.9898,78.233)*2.0)) * 43758.5453) - 0.5) * 0.02;
                color += noiseGrain;

                gl_FragColor = vec4(color, 1.0);
            }
        `
    }), [uniforms]);

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[2.5, 2.5]} />
            <shaderMaterial {...shader} depthWrite={false} depthTest={false} />
        </mesh>
    );
}

export default function LiquidGlass() {
    return (
        <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]} style={{ position: "absolute", inset: 0, zIndex: -1 }}>
            <GlassPlane />
        </Canvas>
    );
}