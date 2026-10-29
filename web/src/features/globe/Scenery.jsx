import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { globeToVector } from "./globeMath";
import { PLANET_RADIUS, surfaceRadius } from "./terrain";
import { isClearOfRegions } from "./regionZones";

const UP = new THREE.Vector3(0, 1, 0);
const DEG_TO_RAD = Math.PI / 180;

const TREE_COUNT = 70;
const LEAFY_SHARE = 0.4; // share of trees that are round and leafy
const TRUNK_HEIGHT = 0.04;
const CROWN_HEIGHT = 0.09;
const TRUNK_COLOR = "#7a5a3a";
const PINE_COLOR = "#43924f";
const LEAFY_COLOR = "#8fd27a";

const POND_COUNT = 3;
const POND_SPACING = 25 * DEG_TO_RAD;
const POND_TREE_GAP = 2 * DEG_TO_RAD;
const WATER_COLOR = "#7cc6c9";
const SHORE_COLOR = "#e6dcae";

const CLOUD_COUNT = 7;
const CLOUD_MIN_ALTITUDE = 1.3; // multiples of the planet radius
const CLOUD_MAX_ALTITUDE = 1.5;
const CLOUD_MIN_LAT = 28; // degrees: keeps clouds above and below the regions
const CLOUD_MAX_LAT = 58;
const DRIFT_SPEED = 0.04; // radians per second: one lap takes about 2.5 minutes

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

function randomDirection(random, maxLatitude) {
  const lat = (random() * 2 - 1) * maxLatitude;
  const lng = random() * 360 - 180;
  return globeToVector(lat, lng, 1);
}

// Ponds are placed once, before trees, so trees can avoid them.
// Kept to the front half so some are visible when the page loads.
const PONDS = (() => {
  const random = createRandom(3);
  const list = [];
  let attempts = 0;

  while (list.length < POND_COUNT && attempts < 300) {
    attempts++;
    const direction = globeToVector(
      (random() * 2 - 1) * 40,
      random() * 140 - 70,
      1,
    );
    if (!isClearOfRegions(direction)) continue;
    if (list.some((pond) => pond.direction.angleTo(direction) < POND_SPACING)) {
      continue;
    }

    const size = 0.15 + random() * 0.05;
    list.push({ direction, size, angle: size / PLANET_RADIUS });
  }

  return list;
})();

function isClearOfPonds(direction) {
  return PONDS.every(
    (pond) => direction.angleTo(pond.direction) > pond.angle + POND_TREE_GAP,
  );
}

export function Ponds() {
  return (
    <>
      {PONDS.map((pond, i) => (
        <group
          key={i}
          position={pond.direction
            .clone()
            .multiplyScalar(surfaceRadius(pond.direction) + 0.012)}
          quaternion={new THREE.Quaternion().setFromUnitVectors(
            UP,
            pond.direction,
          )}
        >
          <mesh rotation-x={-Math.PI / 2} position-y={-0.001}>
            <circleGeometry args={[pond.size * 1.18, 9]} />
            <meshStandardMaterial
              color={SHORE_COLOR}
              flatShading
              roughness={1}
            />
          </mesh>
          <mesh rotation-x={-Math.PI / 2}>
            <circleGeometry args={[pond.size, 9]} />
            <meshStandardMaterial
              color={WATER_COLOR}
              flatShading
              roughness={1}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

export function Trees() {
  const trunkRef = useRef(null);
  const pineRef = useRef(null);
  const leafyRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  const geometries = useMemo(() => {
    const trunk = new THREE.CylinderGeometry(0.01, 0.013, TRUNK_HEIGHT, 5);
    trunk.translate(0, TRUNK_HEIGHT / 2, 0);

    const pine = new THREE.ConeGeometry(0.04, CROWN_HEIGHT, 6);
    pine.translate(0, TRUNK_HEIGHT + CROWN_HEIGHT / 2 - 0.01, 0);

    const leafy = new THREE.IcosahedronGeometry(0.045, 0);
    leafy.translate(0, TRUNK_HEIGHT + 0.03, 0);

    return { trunk, pine, leafy };
  }, []);

  const trees = useMemo(() => {
    const random = createRandom(7);
    const list = [];
    let attempts = 0;

    while (list.length < TREE_COUNT && attempts < TREE_COUNT * 20) {
      attempts++;
      const direction = randomDirection(random, 75);
      if (!isClearOfRegions(direction) || !isClearOfPonds(direction)) continue;

      const position = direction
        .clone()
        .multiplyScalar(surfaceRadius(direction) - 0.004);
      const standUp = new THREE.Quaternion().setFromUnitVectors(UP, direction);
      const turn = new THREE.Quaternion().setFromAxisAngle(
        UP,
        random() * Math.PI * 2,
      );
      const size = 0.7 + random() * 0.7;

      list.push({
        matrix: new THREE.Matrix4().compose(
          position,
          standUp.multiply(turn),
          new THREE.Vector3(size, size, size),
        ),
        leafy: random() < LEAFY_SHARE,
      });
    }

    return {
      all: list,
      pines: list.filter((tree) => !tree.leafy),
      leafy: list.filter((tree) => tree.leafy),
    };
  }, []);

  useLayoutEffect(() => {
    const fill = (mesh, list) => {
      list.forEach((tree, i) => mesh.setMatrixAt(i, tree.matrix));
      mesh.instanceMatrix.needsUpdate = true;
    };

    fill(trunkRef.current, trees.all);
    fill(pineRef.current, trees.pines);
    fill(leafyRef.current, trees.leafy);
    invalidate();
  }, [trees, invalidate]);

  return (
    <>
      <instancedMesh
        ref={trunkRef}
        args={[geometries.trunk, undefined, trees.all.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial color={TRUNK_COLOR} flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={pineRef}
        args={[geometries.pine, undefined, trees.pines.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial color={PINE_COLOR} flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={leafyRef}
        args={[geometries.leafy, undefined, trees.leafy.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial color={LEAFY_COLOR} flatShading roughness={1} />
      </instancedMesh>
    </>
  );
}

export function Clouds({ animate = false }) {
  const groupRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  const puffGeometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const puffMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        flatShading: true,
        roughness: 1,
      }),
    [],
  );

  const clouds = useMemo(() => {
    const random = createRandom(21);

    return Array.from({ length: CLOUD_COUNT }, (_, i) => {
      const hemisphere = i % 2 === 0 ? 1 : -1;
      const lat =
        hemisphere *
        (CLOUD_MIN_LAT + random() * (CLOUD_MAX_LAT - CLOUD_MIN_LAT));
      const lng = (i / CLOUD_COUNT) * 360 + random() * 30;
      const altitude =
        PLANET_RADIUS *
        (CLOUD_MIN_ALTITUDE +
          random() * (CLOUD_MAX_ALTITUDE - CLOUD_MIN_ALTITUDE));

      const puffCount = 2 + Math.floor(random() * 3);
      const puffs = Array.from({ length: puffCount }, (_, j) => ({
        position: [
          (j - (puffCount - 1) / 2) * 0.13,
          random() * 0.04,
          random() * 0.06,
        ],
        size: 0.08 + random() * 0.07,
      }));

      return { position: globeToVector(lat, lng, altitude), puffs };
    });
  }, []);

  // The canvas is idle until asked, so give it a nudge when drifting starts.
  useEffect(() => {
    if (animate) invalidate();
  }, [animate, invalidate]);

  useFrame((_, delta) => {
    if (!animate || !groupRef.current) return;
    groupRef.current.rotation.y += DRIFT_SPEED * Math.min(delta, 0.05);
    invalidate();
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          {cloud.puffs.map((puff, j) => (
            <mesh
              key={j}
              geometry={puffGeometry}
              material={puffMaterial}
              position={puff.position}
              scale={[puff.size, puff.size * 0.6, puff.size]}
            />
          ))}
        </group>
      ))}
    </group>
  );
}
