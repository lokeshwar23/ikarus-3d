import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeJSViewerProps {
  modelPath: string;
  color?: string;
  className?: string;
}

function Model({ modelPath, color }: { modelPath: string; color?: string }) {
  const { scene } = useGLTF(modelPath);
  
  // Apply color to the model if provided
  useEffect(() => {
    if (color && scene) {
      console.log('🎨 Applying color to model:', color);
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Preserve original material properties but change color
          const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.7,
            transparent: false,
          });
          child.material = material;
        }
      });
    }
  }, [color, scene]);

  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

function LoadingCube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
  );
}

export default function ThreeJSViewer({ modelPath, color, className }: ThreeJSViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log('Loading GLB model:', modelPath);
    
    // Test if the file exists
    fetch(modelPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        console.log('GLB file found and accessible');
        setHasError(false);
      })
      .catch(error => {
        console.error('Error loading GLB:', error);
        setHasError(true);
      });
  }, [modelPath]);

  useEffect(() => {
    if (color) {
      console.log('🎨 Color changed to:', color);
    }
  }, [color]);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-100">
        <div className="text-red-600 text-center">
          <div className="font-bold">Cannot load 3D model</div>
          <div className="text-sm">File: {modelPath}</div>
          <div className="text-xs">Check if file exists in public folder</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: '300px' }}>
      <Canvas
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        onCreated={() => {
          console.log('Canvas created successfully');
          setIsLoading(false);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        
        <Suspense fallback={<LoadingCube />}>
          <Model modelPath={modelPath} color={color} />
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
        />
      </Canvas>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-600">Loading 3D Model...</div>
        </div>
      )}
    </div>
  );
}
