/*
  Auto-generated by Spline
*/

import useSpline from "@splinetool/r3f-spline";
import { OrthographicCamera } from "@react-three/drei";

export default function Scene({ ...props }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/xb14wWMkDfjvmID8/scene.splinecode"
  );
  return (
    <>
      <color attach="background" args={[230, 230, 254]} />
      <group {...props} dispose={null}>
        <directionalLight
          name="Directional Light"
          castShadow
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={-10000}
          shadow-camera-far={100000}
          shadow-camera-left={-1000}
          shadow-camera-right={1000}
          shadow-camera-top={1000}
          shadow-camera-bottom={-1000}
          position={[137.79, 214.28, 125.21]}
        />
        <group name="clock_03">
          <mesh
            name="numbers 2"
            geometry={nodes["numbers 2"].geometry}
            material={materials.black}
            castShadow
            receiveShadow
            position={[7.48, 95.69, 75.09]}
            scale={[5.62, 6.47, 5.62]}
          />
          <mesh
            name="buttons"
            geometry={nodes.buttons.geometry}
            material={materials.orange}
            castShadow
            receiveShadow
            position={[0, 164.1, 62.14]}
          />
          <mesh
            name="legs"
            geometry={nodes.legs.geometry}
            material={materials.orange}
            castShadow
            receiveShadow
            position={[-3.44, 21.87, -2.23]}
          />
          <mesh
            name="whitescreen"
            geometry={nodes.whitescreen.geometry}
            material={materials.white}
            castShadow
            receiveShadow
            position={[-4.45, 97.58, 16.21]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={1.69}
          />
          <mesh
            name="body"
            geometry={nodes.body.geometry}
            material={materials.black}
            castShadow
            receiveShadow
            position={[-4.45, 97.18, -0.82]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={1.69}
          />
        </group>
        <OrthographicCamera
          name="1"
          makeDefault={true}
          far={100000}
          near={-100000}
          position={[514.49, 472.36, 766.84]}
          rotation={[-0.51, 0.56, 0.29]}
          scale={1}
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
