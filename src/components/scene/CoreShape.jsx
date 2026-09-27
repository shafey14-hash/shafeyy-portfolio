import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "../../lib/scrollState";

const SHAPE_KEYS = [
  { p: 0.0, x: 2.4, y: 0, s: 1 },
  { p: 0.42, x: 2.4, y: 0, s: 1 },
  { p: 0.72, x: -2.6, y: -0.2, s: 1.12 },
  { p: 1.0, x: 0, y: 0, s: 0.85 },
];

function segment(p) {
  let a = SHAPE_KEYS[0];
  let b = SHAPE_KEYS[SHAPE_KEYS.length - 1];
  for (let i = 0; i < SHAPE_KEYS.length - 1; i++) {
    if (p >= SHAPE_KEYS[i].p && p <= SHAPE_KEYS[i + 1].p) {
      a = SHAPE_KEYS[i];
      b = SHAPE_KEYS[i + 1];
      break;
    }
  }
  let t = (p - a.p) / (b.p - a.p || 1);
  t = Math.max(0, Math.min(1, t));
  t = t * t * (3 - 2 * t);
  return { a, b, t };
}

export default function CoreShape() {
  const group = useRef();
  const knot = useRef();
  const core = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (knot.current) {
      knot.current.rotation.x = t * 0.16;
      knot.current.rotation.y = t * 0.22;
    }
    if (core.current) {
      core.current.rotation.y = t * 0.12;
      core.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    }
    if (group.current) {
      const { a, b, t: k } = segment(scrollState.progress);
      const tx = THREE.MathUtils.lerp(a.x, b.x, k);
      const ty = THREE.MathUtils.lerp(a.y, b.y, k);
      const ts = THREE.MathUtils.lerp(a.s, b.s, k);
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, tx, 2.2, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, ty, 2.2, delta);
      const s = THREE.MathUtils.damp(group.current.scale.x, ts, 2.2, delta);
      group.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group} position={[2.4, 0, 0]}>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1.15, 0.3, 200, 32]} />
        <meshBasicMaterial color="#6ef0d8" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.68, 6]} />
        <MeshDistortMaterial
          color="#0b2b25"
          emissive="#1a5c4d"
          emissiveIntensity={0.75}
          roughness={0.25}
          metalness={0.45}
          distort={0.42}
          speed={2.2}
        />
      </mesh>
      <Float speed={1.6} rotationIntensity={0.7} floatIntensity={1.4}>
        <mesh position={[2.4, 1.15, -0.7]}>
          <octahedronGeometry args={[0.26]} />
          <meshBasicMaterial color="#6ef0d8" wireframe transparent opacity={0.55} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={0.9} floatIntensity={1.1}>
        <mesh position={[-2.1, -1.25, -1.1]}>
          <tetrahedronGeometry args={[0.3]} />
          <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.45} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.8}>
        <mesh position={[1.4, -1.6, -0.4]}>
          <torusGeometry args={[0.22, 0.07, 12, 40]} />
          <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}
