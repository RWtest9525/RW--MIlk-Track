import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const FloatingGlassBottle: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Glass Bottle Shell */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 2.2, 32]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          transparent
          opacity={0.4}
          roughness={0.05}
          transmission={0.9}
          thickness={0.3}
          ior={1.5}
        />
      </mesh>

      {/* Internal Glowing Milk Level */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.6, 32]} />
        <meshStandardMaterial
          color="#FFFBEB"
          emissive="#F8FAFC"
          emissiveIntensity={0.25}
          roughness={0.1}
        />
      </mesh>

      {/* Golden Cap */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

export const SplashBottle3D: React.FC<{ height?: number }> = ({ height = 220 }) => {
  return (
    <div style={{ width: '100%', height: `${height}px`, position: 'relative' }}>
      <Canvas style={{ background: 'transparent' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={50} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.8} color="#FFFFFF" />
        <pointLight position={[-3, 2, -2]} intensity={1.5} color="#06B6D4" />
        <pointLight position={[3, -2, 2]} intensity={1.5} color="#10B981" />
        
        <Sparkles count={40} scale={4} size={2.5} speed={0.4} color="#38BDF8" />
        
        <Float speed={3} rotationIntensity={0.4} floatIntensity={0.6}>
          <FloatingGlassBottle />
        </Float>
      </Canvas>
    </div>
  );
};
