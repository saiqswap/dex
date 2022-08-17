import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Alice from "../marketplace/nft-viewer/Alice";
import Bestie from "../marketplace/nft-viewer/Bestie";
import Ceci from "../marketplace/nft-viewer/Ceci";
import Dasha from "../marketplace/nft-viewer/Dasha";
import Emily from "../marketplace/nft-viewer/Emily";

const maper = {
  Alice: <Alice />,
  Bestie: <Bestie />,
  Dasha: <Dasha />,
  Ceci: <Ceci />,
  Emily: <Emily />,
};

export default function Model3d({ name, height, width }) {
  return (
    <Canvas
      style={{
        width: width ? width : "100%",
        height: height ? height : "auto",
        overflow: "",
      }}
      camera={{ fov: 40, position: [0, 0, 8] }}
      shadows
    >
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <PerspectiveCamera makeDefault fov={65} position={[0, 0, 4]}>
        <spotLight
          position={[2, 0, 10]}
          angle={0.5}
          penumbra={1}
          intensity={4}
          shadow-mapSize={[2048, 2048]}
        />
      </PerspectiveCamera>
      <OrbitControls
        makeDefault
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 2.3}
        enableZoom={false}
      />
      <Suspense fallback={false}>{maper[name]}</Suspense>
    </Canvas>
  );
}
