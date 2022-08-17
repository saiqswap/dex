import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const config = {
  body: [
    "bestie_body",
    "bestie_face",
    "bestie_eargears",
    "bestie_legs",
    "bestie_shoes",
    "bestie_hands",
    "bestie_hair",
    "bestie_dress",
  ],
  body_bone: "mixamorigHips",
  weapon: ["Arm", "Fist"],
  weabon_bone: "weapon_root",
  animation: "",
};

export default function Bestie() {
  const { nodes, animations } = useGLTF(`/images/character/body/Bestie.glb`);
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actions.Bestie_idle) actions.Bestie_idle.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group ref={group} dispose={null} scale={1.7} position={[0, -2, 0]}>
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
      <object3D>
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
useGLTF.preload("/images/character/body/Bestie.glb");
