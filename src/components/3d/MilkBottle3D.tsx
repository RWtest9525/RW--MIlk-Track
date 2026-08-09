import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface BottleModelProps {
  fillPercentage: number; // 0 to 100
}

const BottleMesh: React.FC<BottleModelProps> = ({ fillPercentage }) => {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);

  // Smooth rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  // Calculate liquid height based on percentage (max height = 1.9)
  const liquidHeight = Math.max(0.08, (fillPercentage / 100) * 1.8);
  const liquidPosY = -0.9 + liquidHeight / 2;

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* Glass Bottle Body Outer Shell */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 2.0, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#0284C7"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.1}
          transmission={0.92}
          ior={1.5}
          thickness={0.25}
        />
      </mesh>

      {/* Bottle Neck */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.35, 0.52, 0.5, 32]} />
        <meshPhysicalMaterial
          color="#0284C7"
          transparent
          opacity={0.3}
          roughness={0.05}
          transmission={0.92}
        />
      </mesh>

      {/* Glossy Blue Cap (Matching RW-Milk Tracker Logo) */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.37, 0.37, 0.12, 32]} />
        <meshStandardMaterial
          color="#0284C7"
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Pure White Fresh Milk Liquid */}
      <mesh ref={liquidRef} position={[0, liquidPosY, 0]}>
        <cylinderGeometry args={[0.64, 0.64, liquidHeight, 32]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.1}
          metalness={0.02}
          emissive="#F8FAFC"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Base Glass Bottom */}
      <mesh position={[0, -1.02, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.08, 32]} />
        <meshPhysicalMaterial color="#38BDF8" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

export const MilkBottle3D: React.FC<{ fillPercentage: number; height?: number }> = ({ 
  fillPercentage,
  height = 200 
}) => {
  return (
    <div style={{ width: '100%', height: `${height}px`, position: 'relative' }}>
      <Canvas style={{ background: 'transparent' }}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 4.2]} fov={45} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} />
        <pointLight position={[-4, -2, -2]} intensity={0.8} color="#0284C7" />
        <pointLight position={[3, 3, 3]} intensity={1.0} color="#38BDF8" />
        
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <BottleMesh fillPercentage={fillPercentage} />
        </Float>
      </Canvas>
    </div>
  );
};
