import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const config = {
  body: [
    "emily_body",
    "emily_hands",
    "emily_legs",
    "emily_shoes",
    "emily_face",
    "emily_dress",
  ],
  body_bone: "mixamorigHips",
  weapon: ["arm", "gun"],
  weabon_bone: "weapon_root",
};

export default function Emily() {
  const { nodes, animations } = useGLTF(`/images/character/body/Emily.glb`);
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actions.Emily_idle) actions.Emily_idle.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group
      ref={group}
      dispose={null}
      scale={1.75}
      position={[0, -2.2, 0]}
      castShadow
    >
      <object3D
        rotation={[1.6, -0.05, 0]}
        scale={[0.01, 0.01, 0.01]}
        position={[-0.1, 0, 0]}
      >
        <group>
          {config.body.map((item, index) => (
            <skinnedMesh
              geometry={nodes[item].geometry}
              material={nodes[item].material}
              skeleton={nodes[item].skeleton}
              key={`${index}${item}`}
              receiveShadow
            />
          ))}
          <primitive object={nodes[config.body_bone]} />
        </group>
      </object3D>
      <object3D rotation={[1.49, 0, 0]}>
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
useGLTF.preload("/images/character/body/Emily.glb");
