import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import {
  PressureField,
  extractSlice,
  gatherHotspots,
} from "@/lib/roomModes";
import { interpolateViridis } from "@/lib/colorMap";

interface RoomVisualizerProps {
  field: PressureField | null;
  sliceHeight: number;
}

export function RoomVisualizer({
  field,
  sliceHeight,
}: RoomVisualizerProps) {
  const sliceTexture = useMemo(() => {
    if (!field) return null;

    const slice = extractSlice(field, sliceHeight);
    const total = slice.values.length;
    const data = new Uint8Array(total * 3);

    for (let i = 0; i < total; i += 1) {
      const v = (slice.values[i] + 1) * 0.5;
      const [r, g, b] = interpolateViridis(v);
      data[i * 3 + 0] = r;
      data[i * 3 + 1] = g;
      data[i * 3 + 2] = b;
    }

    const texture = new THREE.DataTexture(
      data,
      slice.width,
      slice.depth,
      THREE.RGBFormat
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    return { texture, slice };
  }, [field, sliceHeight]);

  const hotspots = useMemo(() => {
    if (!field) return null;
    return gatherHotspots(field, 0.8);
  }, [field]);

  const pointCloud = useMemo(() => {
    if (!field || !hotspots) return null;
    const count = hotspots.positions.length / 3;
    if (count === 0) return null;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const { x: Lx, y: Ly, z: Lz } = field.dims;

    for (let i = 0; i < count; i += 1) {
      const px = hotspots.positions[i * 3 + 0] - Lx / 2;
      const py = hotspots.positions[i * 3 + 1] - Ly / 2;
      const pz = hotspots.positions[i * 3 + 2] - Lz / 2;
      positions.set([px, py, pz], i * 3);

      const value = (hotspots.values[i] + 1) * 0.5;
      const [r, g, b] = interpolateViridis(value);
      colors.set([r / 255, g / 255, b / 255], i * 3);
    }

    return { positions, colors, count };
  }, [field, hotspots]);

  if (!field) {
    return (
      <div className="flex h-full min-h-[480px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-8 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Keine Moden aktiv – bitte wähle mindestens eine Mode zur Darstellung.
      </div>
    );
  }

  const { x: Lx, y: Ly, z: Lz } = field.dims;

  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera
          makeDefault
          position={[Lx * 1.4, Ly * 1.4, Lz * 1.4]}
          fov={45}
        />
        <color attach="background" args={["#09090b"]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          intensity={0.8}
          position={[Lx, Ly * 1.5, Lz]}
        />
        <OrbitControls enablePan target={[0, 0, 0]} />

        <group>
          <mesh>
            <boxGeometry args={[Lx, Ly, Lz]} />
            <meshStandardMaterial
              color="#1f2937"
              wireframe
              transparent
              opacity={0.75}
            />
          </mesh>

          {sliceTexture && (
            <mesh
              position={[0, sliceTexture.slice.height - Ly / 2, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[Lx, Lz]} />
              <meshBasicMaterial
                map={sliceTexture.texture}
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {pointCloud && (
            <points>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[pointCloud.positions, 3]}
                />
                <bufferAttribute
                  attach="attributes-color"
                  args={[pointCloud.colors, 3]}
                />
              </bufferGeometry>
              <pointsMaterial
                vertexColors
                size={0.06}
                sizeAttenuation
                transparent
                opacity={0.9}
              />
            </points>
          )}
        </group>
      </Canvas>

      <div className="pointer-events-none absolute right-4 top-4 flex flex-col gap-2 rounded-xl bg-black/70 p-3 text-xs text-zinc-100">
        <span>Raum: {Lx.toFixed(2)} × {Ly.toFixed(2)} × {Lz.toFixed(2)} m</span>
        <span>Slice Höhe: {sliceHeight.toFixed(2)} m</span>
        {hotspots && (
          <span>
            Hotspot Schwelle: {hotspots.threshold.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
