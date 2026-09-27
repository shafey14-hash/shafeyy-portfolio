import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "../../lib/scrollState";

const KEYS = [
  { p: 0.0, pos: [0, 0.1, 8.5] },
  { p: 0.42, pos: [1.9, 0.35, 6.4] },
  { p: 0.72, pos: [-2.3, -0.25, 5.6] },
  { p: 1.0, pos: [0, 0.25, 3.7] },
];

function segment(p) {
  let a = KEYS[0];
  let b = KEYS[KEYS.length - 1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (p >= KEYS[i].p && p <= KEYS[i + 1].p) {
      a = KEYS[i];
      b = KEYS[i + 1];
      break;
    }
  }
  let t = (p - a.p) / (b.p - a.p || 1);
  t = Math.max(0, Math.min(1, t));
  t = t * t * (3 - 2 * t);
  return { a, b, t };
}

export default function CameraRig() {
  const look = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const p = scrollState.progress;
    const { a, b, t } = segment(p);
    const cam = state.camera;
    const tx =
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], t) + state.pointer.x * 0.28;
    const ty =
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], t) - state.pointer.y * 0.22;
    const tz = THREE.MathUtils.lerp(a.pos[2], b.pos[2], t);

    cam.position.x = THREE.MathUtils.damp(cam.position.x, tx, 2.4, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, ty, 2.4, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tz, 2.4, delta);

    look.current.x = THREE.MathUtils.damp(look.current.x, tx * 0.35, 2.4, delta);
    look.current.y = THREE.MathUtils.damp(look.current.y, ty * 0.35, 2.4, delta);

    cam.lookAt(look.current);
  });

  return null;
}
