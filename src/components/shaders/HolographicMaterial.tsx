import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const HolographicMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.0, 0.94, 1.0),
    intensity: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Fresnel effect
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
      
      // Scan lines
      float scanline = sin(vUv.y * 50.0 + time * 2.0) * 0.5 + 0.5;
      
      // Holographic interference pattern
      float pattern = sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 - time) * 0.5 + 0.5;
      
      // Combine effects
      vec3 finalColor = color * (fresnel + scanline * 0.3 + pattern * 0.2);
      float alpha = fresnel * 0.8 + scanline * 0.2;
      
      gl_FragColor = vec4(finalColor * intensity, alpha);
    }
  `
);

extend({ HolographicMaterial });

export default HolographicMaterial;
