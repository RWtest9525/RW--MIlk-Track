import React, { useRef, useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { VectorMilkBottle } from './VectorMilkBottle';

interface BottleModelProps {
  fillPercentage: number; // 0 to 100
}

// 1. 3D Bottle Mesh
const BottleMesh: React.FC<BottleModelProps> = ({ fillPercentage }) => {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);

  // Smooth floating rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // Calculate liquid fill level (max bottle height = 2.2)
  const clampedPct = Math.min(100, Math.max(5, fillPercentage));
  const liquidHeight = (clampedPct / 100) * 1.7;
  const liquidPosY = -0.9 + liquidHeight / 2;

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Lower Cylindrical Body */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 1.4, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          transmission={0.94}
          ior={1.5}
          thickness={0.3}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Tapered Glass Shoulder */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.38, 0.72, 0.5, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.94}
          ior={1.5}
          clearcoat={1.0}
        />
      </mesh>

      {/* Narrow Glass Neck */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.36, 0.38, 0.4, 32]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.94}
        />
      </mesh>

      {/* Glass Mouth Collar Rim */}
      <mesh position={[0, 1.32, 0]}>
        <torusGeometry args={[0.36, 0.04, 16, 32]} />
        <meshPhysicalMaterial color="#BAE6FD" transparent opacity={0.5} roughness={0.1} />
      </mesh>

      {/* Glossy Deep Blue Cap */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.16, 32]} />
        <meshStandardMaterial
          color="#0284C7"
          metalness={0.4}
          roughness={0.15}
          emissive="#0369A1"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Dynamic Pure White Fresh Milk Liquid */}
      <mesh ref={liquidRef} position={[0, liquidPosY, 0]}>
        <cylinderGeometry args={[0.68, 0.68, liquidHeight, 32]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.08}
          metalness={0.01}
          emissive="#F8FAFC"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Glass Base Bottom */}
      <mesh position={[0, -1.02, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.08, 32]} />
        <meshPhysicalMaterial color="#38BDF8" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// 2. Canvas Safety Error Boundary
class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('3D Canvas error caught, falling back to 2D bottle:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 3. Exported Safe Component with WebGL Capability Check & Graceful Fallback
export const MilkBottle3D: React.FC<{ fillPercentage: number; height?: number }> = ({
  fillPercentage,
  height = 140,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <VectorMilkBottle fillPercentage={fillPercentage} height={height} />;
  }

  return (
    <CanvasErrorBoundary fallback={<VectorMilkBottle fillPercentage={fillPercentage} height={height} />}>
      <div style={{ width: '100%', height: `${height}px`, position: 'relative' }}>
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0.4, 4.3]} fov={45} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 8, 5]} intensity={2.0} color="#FFFFFF" />
          <pointLight position={[-4, 2, -2]} intensity={1.2} color="#38BDF8" />
          <pointLight position={[4, -2, 3]} intensity={1.0} color="#0284C7" />

          <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
            <BottleMesh fillPercentage={fillPercentage} />
          </Float>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
};
