import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const config = {
  body: [
    "Ceci_body",
    "Ceci_eargears",
    "Ceci_face",
    "Ceci_hands",
    "Ceci_legs",
    "Ceci_dress",
    "Ceci_shoes",
  ],
  body_bone: "mixamorigHips",
  weapon: ["Arm", "bow"],
  weabon_bone: "weapon_root",
};

export default function Ceci() {
  const { nodes, animations } = useGLTF(`/images/character/body/Ceci.glb`);
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actions.Ceci_idle) actions.Ceci_idle.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group ref={group} dispose={null} scale={1.9} position={[0, -2.2, 0]}>
      <object3D rotation={[1.49, 0, 0]} scale={[0.01, 0.01, 0.01]}>
        <group>
          {config.body.map((item, index) => (
            <skinnedMesh
              geometry={nodes[item].geometry}
              material={nodes[item].material}
              skeleton={nodes[item].skeleton}
              key={`${index}${item}`}
            />
          ))}
          <primitive object={nodes[config.body_bone]} />
        </group>
      </object3D>
      <object3D position={[0, 0.5, 0]}>
        <group>
          {config.weapon.map((item, index) => (
            <skinnedMesh
              geometry={nodes[item].geometry}
              material={nodes[item].material}
              skeleton={nodes[item].skeleton}
              key={`${index}${item}`}
            />
          ))}
          <primitive object={nodes[config.weabon_bone]} />
        </group>
      </object3D>
    </group>
  );
}
useGLTF.preload("/images/character/body/Ceci.glb");
