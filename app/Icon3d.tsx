"use client";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Preload } from "@react-three/drei";
import Calendar from "./Calendar";
import { Mesh } from "three";

function Box() {
  const boxRef = useRef<Mesh>(null);

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.005;
      boxRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry args={[1, 1, 1]}></boxGeometry>
      <meshStandardMaterial color="orange"></meshStandardMaterial>
    </mesh>
  );
}

export default function Icon3d() {
  return (
    <Suspense fallback={"null"}>
      <Canvas flat linear>
        <ambientLight></ambientLight>
        <Float speed={1.4} rotationIntensity={1.5} floatIntensity={2.3}>
          <Calendar></Calendar>
        </Float>
        <Preload all></Preload>
        <OrbitControls makeDefault enableZoom={false} enablePan={false} />
      </Canvas>
    </Suspense>
  );
}
