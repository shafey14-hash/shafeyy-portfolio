import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import CoreShape from "./CoreShape";
import Particles from "./Particles";

export default function SceneCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 42, position: [0, 0.1, 8.5], near: 0.1, far: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#050505", 7, 19]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 3, 5]} intensity={1.4} color="#cff7ee" />
        <pointLight position={[-4, -2, 3]} intensity={22} color="#6ef0d8" />
        <pointLight position={[3, 2, -4]} intensity={14} color="#3b82f6" />
        <Particles count={1600} />
        <CoreShape />
        <CameraRig />
      </Canvas>
    </div>
  );
}
