/*
  Auto-generated by Spline
*/

import useSpline from "@splinetool/r3f-spline";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import THREE from "three";

export default function Scene({ ...props }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/0tqlJ4P2F0ASj1XY/scene.splinecode"
  );

  useFrame((state) => {
    // const target = new THREE.Vector3(state.mouse.x, state.mouse.y, 1);
    // console.log(`x: ${state.mouse.x} y: ${state.mouse.y}`);
  });

  return (
    <>
      <color attach="background" args={[230, 230, 254]} />
      <group {...props} dispose={null}>
        <directionalLight
          name="Directional Light"
          castShadow
          intensity={0.7}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={-10000}
          shadow-camera-far={100000}
          shadow-camera-left={-1250}
          shadow-camera-right={1250}
          shadow-camera-top={1250}
          shadow-camera-bottom={-1250}
          position={[200, 300, 300]}
        />
        <group name="calendar" position={[0, -1, 0]} scale={0.2}>
          <mesh
            name="2"
            geometry={nodes["2"].geometry}
            material={materials["Mat 4"]}
            castShadow
            receiveShadow
            position={[-49.83, -55.47, 13.05]}
            rotation={[-0.09, 0, 0]}
            scale={1}
          />
          <mesh
            name="5"
            geometry={nodes["5"].geometry}
            material={materials["Mat 4"]}
            castShadow
            receiveShadow
            position={[0.38, -55.47, 13.05]}
            rotation={[-0.09, 0, 0]}
            scale={1}
          />
          <mesh
            name="O"
            geometry={nodes.O.geometry}
            material={materials["Mat 3"]}
            castShadow
            receiveShadow
            position={[-20.95, 20.36, 6.41]}
            rotation={[-0.09, 0, 0]}
            scale={1}
          />
          <mesh
            name="C"
            geometry={nodes.C.geometry}
            material={materials["Mat 3"]}
            castShadow
            receiveShadow
            position={[-3.86, 20.36, 6.41]}
            rotation={[-0.09, 0, 0]}
            scale={1}
          />
          <mesh
            name="T"
            geometry={nodes.T.geometry}
            material={materials["Mat 3"]}
            castShadow
            receiveShadow
            position={[12.12, 20.36, 6.41]}
            rotation={[-0.09, 0, 0]}
            scale={1}
          />
          <mesh
            name="Torus 3"
            geometry={nodes["Torus 3"].geometry}
            material={materials["Mat 1"]}
            castShadow
            receiveShadow
            position={[37.1, 68.76, -3.03]}
            rotation={[-0.09, Math.PI / 2, 0]}
            scale={1}
          />
          <mesh
            name="Torus 2"
            geometry={nodes["Torus 2"].geometry}
            material={materials["Mat 1"]}
            castShadow
            receiveShadow
            position={[-36.48, 68.76, -3.03]}
            rotation={[-0.09, Math.PI / 2, 0]}
            scale={1}
          />
          <mesh
            name="Torus 31"
            geometry={nodes["Torus 31"].geometry}
            material={materials["Mat 1"]}
            castShadow
            receiveShadow
            position={[32.83, 68.76, -3.03]}
            rotation={[-0.09, Math.PI / 2, 0]}
            scale={1}
          />
          <mesh
            name="Torus"
            geometry={nodes.Torus.geometry}
            material={materials["Mat 1"]}
            castShadow
            receiveShadow
            position={[-40.76, 68.76, -3.03]}
            rotation={[-0.09, Math.PI / 2, 0]}
            scale={1}
          />
          <mesh
            name="Rectangle 4"
            geometry={nodes["Rectangle 4"].geometry}
            material={materials["Mat 2"]}
            castShadow
            receiveShadow
            position={[0, -6.63, -9.36]}
          />
          <mesh
            name="Rectangle 3"
            geometry={nodes["Rectangle 3"].geometry}
            material={materials["Mat 2"]}
            castShadow
            receiveShadow
            position={[0, -6.87, -3.27]}
            rotation={[-0.03, 0, 0]}
            scale={1}
          />
          <mesh
            name="Rectangle 2"
            geometry={nodes["Rectangle 2"].geometry}
            material={materials["Mat 2"]}
            castShadow
            receiveShadow
            position={[0, -6.44, 4.6]}
            rotation={[-0.09, 0, 0]}
            scale={1}
          />
        </group>
        {/* <group name="Palette" position={[363.87, 123.64, -21.72]}>
          <mesh
            name="Cube 2"
            geometry={nodes["Cube 2"].geometry}
            material={nodes["Cube 2"].material}
            castShadow
            receiveShadow
            position={[42.04, -8.22, 27.05]}
            rotation={[0, 0, -0.61]}
            scale={1}
          />
          <mesh
            name="Cylinder"
            geometry={nodes.Cylinder.geometry}
            material={materials["Mat 1"]}
            castShadow
            receiveShadow
            position={[39.72, -11.93, 27.03]}
            rotation={[0, 0, -0.61]}
            scale={1}
          />
          <mesh
            name="Cube"
            geometry={nodes.Cube.geometry}
            material={nodes.Cube.material}
            castShadow
            receiveShadow
            position={[25.86, -31.72, 27.02]}
            rotation={[0, 0, -0.61]}
            scale={1}
          />
          <mesh
            name="Sphere 4"
            geometry={nodes["Sphere 4"].geometry}
            material={materials["Mat 1"]}
            castShadow
            receiveShadow
            position={[-43.64, 5.36, 20.03]}
            rotation={[0, 0, 1.05]}
            scale={[1, 1, 0.38]}
          />
          <mesh
            name="Sphere 3"
            geometry={nodes["Sphere 3"].geometry}
            material={materials["Mat 2"]}
            castShadow
            receiveShadow
            position={[-25.02, 32.85, 20.03]}
            rotation={[0, 0, 0.25]}
            scale={[1, 1, 0.38]}
          />
          <mesh
            name="Sphere 2"
            geometry={nodes["Sphere 2"].geometry}
            material={materials["Mat 4"]}
            castShadow
            receiveShadow
            position={[44.23, 20.2, 20.03]}
            rotation={[0, 0, -0.26]}
            scale={[1, 1, 0.38]}
          />
          <mesh
            name="Sphere"
            geometry={nodes.Sphere.geometry}
            material={materials["Mat 5"]}
            castShadow
            receiveShadow
            position={[13.85, 36.57, 20.03]}
            scale={[1, 1, 0.38]}
          />
          <mesh
            name="Shape 2"
            geometry={nodes["Shape 2"].geometry}
            material={materials["Mat 3"]}
            castShadow
            receiveShadow
            position={[-36.11, 38.66, 7.68]}
          />
        </group> */}
        {/* <group name="funnel" position={[140.06, 121.67, -2.88]} scale={1.12}>
          <mesh
            name="Sphere 31"
            geometry={nodes["Sphere 31"].geometry}
            material={materials["Sphere 31 Material"]}
            castShadow
            receiveShadow
            position={[-1.11, 44.02, -0.51]}
            rotation={[-Math.PI, 0, 0]}
            scale={[3, 4, 3]}
          />
          <mesh
            name="Cylinder 3"
            geometry={nodes["Cylinder 3"].geometry}
            material={materials["Mat 2"]}
            castShadow
            receiveShadow
            position={[0, 52.19, 0]}
            rotation={[Math.PI, 0, 0]}
            scale={[0.92, 1.22, 0.92]}
          />
          <mesh
            name="Sphere 21"
            geometry={nodes["Sphere 21"].geometry}
            material={materials["Mat 5"]}
            castShadow
            receiveShadow
            position={[-1.11, -44.73, 0.51]}
            rotation={[0, 0, 0]}
            scale={[2.57, 3.43, 2.57]}
          />
          <mesh
            name="Sphere1"
            geometry={nodes.Sphere1.geometry}
            material={materials["Sphere1 Material"]}
            castShadow
            receiveShadow
            position={[-1.11, -44.02, 0.51]}
            rotation={[0, 0, 0]}
            scale={[3, 4, 3]}
          />
          <mesh
            name="Cylinder 2"
            geometry={nodes["Cylinder 2"].geometry}
            material={materials["Mat 3"]}
            castShadow
            receiveShadow
            position={[-0.28, 0.33, 0]}
            scale={[0.92, 1.22, 0.92]}
          />
          <mesh
            name="Cylinder1"
            geometry={nodes.Cylinder1.geometry}
            material={materials["Mat 2"]}
            castShadow
            receiveShadow
            position={[0, -52.19, 0]}
            scale={[0.92, 1.22, 0.92]}
          />
        </group> */}
        <OrthographicCamera
          name="1"
          makeDefault={true}
          zoom={0.9}
          far={100000}
          near={-100000}
          position={[0, 2, 5]}
        />
        <hemisphereLight
          name="Default Ambient Light"
          intensity={0.75}
          color="#eaeaea"
        />
      </group>
    </>
  );
}
