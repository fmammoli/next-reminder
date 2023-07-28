"use client";
import { Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Preload } from "@react-three/drei";
import CalendarIcon3d from "./CalendarIcon3d";

export function Icon3d() {
  return (
    <Suspense fallback={null}>
      <Canvas flat linear>
        <ambientLight></ambientLight>
        <Float speed={1.4} rotationIntensity={1.5} floatIntensity={2.3}>
          <CalendarIcon3d></CalendarIcon3d>
        </Float>
        <Preload all></Preload>
        <OrbitControls makeDefault enableZoom={false} enablePan={false} />
      </Canvas>
    </Suspense>
  );
}

const MemoIcon3d = memo(Icon3d);
export default MemoIcon3d;
