import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function TestModel() {
  const { scene } = useGLTF('/81438f2b51ac4a78958169b7e419acbb.glb');
  return <primitive object={scene} />;
}

function TestCube() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4B5563" />
    </mesh>
  );
}

export default function Simple3DTest() {
  return (
    <div style={{ width: '100%', height: '400px', border: '2px solid red' }}>
      <h3>3D Test Area</h3>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={<TestCube />}>
          <TestModel />
        </Suspense>
        
        <OrbitControls />
      </Canvas>
    </div>
  );
}
