"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Preload } from "@react-three/drei";
import Calendar3d from "./Calendar3d";

export default function Icon3d() {
  return (
    <Suspense fallback={null}>
      <Canvas shadows flat linear>
        <Float
          speed={1} // Animation speed, defaults to 1
          rotationIntensity={1.2} // XYZ rotation intensity, defaults to 1
          floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[-0.2, 0.2]}
        >
          <Calendar3d></Calendar3d>
        </Float>
        <Preload all></Preload>
        <OrbitControls
          autoRotate
          makeDefault
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </Suspense>
  );
}
