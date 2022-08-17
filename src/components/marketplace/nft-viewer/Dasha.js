import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const config = {
  body: [
    "dasha_body",
    "dasha_eargears",
    "dasha_face",
    "dasha_hair",
    "dasha_hands",
    "dasha_dress",
    "dasha_legs",
    "dasha_shoes",
  ],
  body_bone: "mixamorigHips",
  weapon: ["Arm", "Puppet"],
  weabon_bone: "weapon_root",
  animation: "",
};

export default function Dasha() {
  const { nodes, animations } = useGLTF(`/images/character/body/Dasha.glb`);
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actions.Dasha_idle) actions.Dasha_idle.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group ref={group} dispose={null} scale={1.6} position={[0, -1.56, 0]}>
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
      <object3D rotation={[1.2, 0, 0]} position={[0, 0, 1]}>
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
      {/* <object3D rotation={[1.49, 0, 0]}>
                <group>
                    {
                        config.puppet.map((item, index) => <skinnedMesh
                            geometry={nodes[item].geometry}
                            material={nodes[item].material}
                            skeleton={nodes[item].skeleton}
                            key={`${index}${item}`}
                        />)
                    }
                    {
                        config.puppet_bone.map((item, index) => <primitive object={nodes[item]} key={`${index}${item}`} />)
                    }
                </group>
            </object3D> */}
    </group>
  );
}
useGLTF.preload("/images/character/body/Dasha.glb");
