import { useLayoutEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { globeToVector } from "./globeMath";
import { surfaceRadius } from "./terrain";
import { MOUNTAINS, isClearOfMountains } from "./landmarks";
import { makeOutlineGeometry, outlineMaterial, toonGradient } from "./toon";

const UP = new THREE.Vector3(0, 1, 0);

const ROCK_COLOR = "#c3cbc1";
const SNOW_COLOR = "#ffffff";
const MOUNTAIN_HEIGHT = 1.9; // height as a multiple of base width
const SNOW_SHARE = 0.38; // top share of the mountain that's snowy
const MOUNTAIN_OUTLINE = 0.012;

const FLOWER_COUNT = 220;
const FLOWER_SIZE = 0.013;
const FLOWER_COLORS = ["#ffffff", "#f7d154", "#f2a7c3", "#c9a7ef"];

// Seeded random numbers: the same "random" layout on every page load.
function createRandom(seed) {
  let state = seed;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function standUpOn(direction) {
  return new THREE.Quaternion().setFromUnitVectors(UP, direction);
}

// Low-poly mountains with snowy peaks. Base width 1, scaled per mountain.
export function Mountains() {
  const geometries = useMemo(() => {
    const rock = new THREE.ConeGeometry(1, MOUNTAIN_HEIGHT, 5);
    rock.translate(0, MOUNTAIN_HEIGHT / 2, 0);

    const snowHeight = MOUNTAIN_HEIGHT * SNOW_SHARE;
    const snow = new THREE.ConeGeometry(SNOW_SHARE * 1.03, snowHeight, 5);
    snow.translate(0, MOUNTAIN_HEIGHT - snowHeight / 2 + 0.002, 0);

    return {
      rock,
      snow,
      outline: makeOutlineGeometry(rock, MOUNTAIN_OUTLINE / 0.15),
    };
  }, []);

  return (
    <>
      {MOUNTAINS.map((mountain, i) => (
        <group
          key={i}
          position={mountain.direction
            .clone()
            .multiplyScalar(surfaceRadius(mountain.direction) - 0.004)}
          quaternion={standUpOn(mountain.direction)}
          scale={mountain.size}
        >
          <mesh geometry={geometries.rock}>
            <meshToonMaterial color={ROCK_COLOR} gradientMap={toonGradient} />
          </mesh>
          <mesh geometry={geometries.snow}>
            <meshToonMaterial color={SNOW_COLOR} gradientMap={toonGradient} />
          </mesh>
          <mesh
            geometry={geometries.outline}
            material={outlineMaterial}
            raycast={() => null}
          />
        </group>
      ))}
    </>
  );
}

// Tiny coloured dots scattered over the meadows.
export function Flowers() {
  const meshRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(FLOWER_SIZE, 0),
    [],
  );

  const flowers = useMemo(() => {
    const random = createRandom(5);
    const list = [];
    let attempts = 0;

    while (list.length < FLOWER_COUNT && attempts < FLOWER_COUNT * 10) {
      attempts++;
      const direction = globeToVector(
        (random() * 2 - 1) * 70,
        random() * 360 - 180,
        1,
      );
      // Ponds sit above the ground and cover any flowers under them,
      // so only mountains need avoiding.
      if (!isClearOfMountains(direction)) continue;

      const position = direction
        .clone()
        .multiplyScalar(surfaceRadius(direction) + FLOWER_SIZE * 0.6);
      list.push({
        matrix: new THREE.Matrix4().makeTranslation(position),
        color: new THREE.Color(
          FLOWER_COLORS[Math.floor(random() * FLOWER_COLORS.length)],
        ),
      });
    }

    return list;
  }, []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    flowers.forEach((flower, i) => {
      mesh.setMatrixAt(i, flower.matrix);
      mesh.setColorAt(i, flower.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
    invalidate();
  }, [flowers, invalidate]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, flowers.length]}
      frustumCulled={false}
      raycast={() => null}
    >
      <meshBasicMaterial />
    </instancedMesh>
  );
}
