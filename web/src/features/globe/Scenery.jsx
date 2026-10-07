import { useLayoutEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { REGION_PLACEMENTS } from "./regionPlacements";
import { globeToVector } from "./globeMath";
import { PLANET_RADIUS, surfaceRadius } from "./terrain";

const UP = new THREE.Vector3(0, 1, 0);
const DEG_TO_RAD = Math.PI / 180;

const TREE_COUNT = 70;
const TRUNK_HEIGHT = 0.04;
const CROWN_HEIGHT = 0.09;
const TRUNK_COLOR = "#7a5a3a";
const TREE_COLOR = "#43924f";

const CLOUD_COUNT = 7;
const CLOUD_ALTITUDE = 1.28; // multiple of the planet radius
const CLOUD_SPACING = 30 * DEG_TO_RAD;

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

// Each region's centre on the globe, plus how far scenery must stay away from it.
const REGION_ZONES = Object.values(REGION_PLACEMENTS).map((placement) => ({
  direction: globeToVector(placement.lat, placement.lng, 1),
  clearance: (placement.spread / 2 + 4) * DEG_TO_RAD,
}));

function isClearOfRegions(direction) {
  return REGION_ZONES.every(
    (zone) => direction.angleTo(zone.direction) > zone.clearance,
  );
}

function randomDirection(random, maxLatitude) {
  const lat = (random() * 2 - 1) * maxLatitude;
  const lng = random() * 360 - 180;
  return globeToVector(lat, lng, 1);
}

export function Trees() {
  const trunkRef = useRef(null);
  const crownRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  const { trunkGeometry, crownGeometry } = useMemo(() => {
    const trunk = new THREE.CylinderGeometry(0.01, 0.013, TRUNK_HEIGHT, 5);
    trunk.translate(0, TRUNK_HEIGHT / 2, 0);

    const crown = new THREE.ConeGeometry(0.04, CROWN_HEIGHT, 6);
    crown.translate(0, TRUNK_HEIGHT + CROWN_HEIGHT / 2 - 0.01, 0);

    return { trunkGeometry: trunk, crownGeometry: crown };
  }, []);

  const matrices = useMemo(() => {
    const random = createRandom(7);
    const list = [];
    let attempts = 0;

    while (list.length < TREE_COUNT && attempts < TREE_COUNT * 20) {
      attempts++;
      const direction = randomDirection(random, 75);
      if (!isClearOfRegions(direction)) continue;

      const position = direction
        .clone()
        .multiplyScalar(surfaceRadius(direction) - 0.004);
      const standUp = new THREE.Quaternion().setFromUnitVectors(UP, direction);
      const turn = new THREE.Quaternion().setFromAxisAngle(
        UP,
        random() * Math.PI * 2,
      );
      const size = 0.7 + random() * 0.7;

      list.push(
        new THREE.Matrix4().compose(
          position,
          standUp.multiply(turn),
          new THREE.Vector3(size, size, size),
        ),
      );
    }

    return list;
  }, []);

  useLayoutEffect(() => {
    const trunks = trunkRef.current;
    const crowns = crownRef.current;

    matrices.forEach((matrix, i) => {
      trunks.setMatrixAt(i, matrix);
      crowns.setMatrixAt(i, matrix);
    });
    trunks.instanceMatrix.needsUpdate = true;
    crowns.instanceMatrix.needsUpdate = true;

    invalidate();
  }, [matrices, invalidate]);

  return (
    <>
      <instancedMesh
        ref={trunkRef}
        args={[trunkGeometry, undefined, matrices.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial color={TRUNK_COLOR} flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={crownRef}
        args={[crownGeometry, undefined, matrices.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial color={TREE_COLOR} flatShading roughness={1} />
      </instancedMesh>
    </>
  );
}

export function Clouds() {
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
    const list = [];
    let attempts = 0;

    while (list.length < CLOUD_COUNT && attempts < 300) {
      attempts++;
      const direction = randomDirection(random, 55);
      if (!isClearOfRegions(direction)) continue;
      if (
        list.some((cloud) => cloud.direction.angleTo(direction) < CLOUD_SPACING)
      ) {
        continue;
      }

      const puffCount = 2 + Math.floor(random() * 3);
      const puffs = Array.from({ length: puffCount }, (_, j) => ({
        position: [
          (j - (puffCount - 1) / 2) * 0.13,
          random() * 0.04,
          random() * 0.06,
        ],
        size: 0.08 + random() * 0.07,
      }));

      list.push({
        direction,
        position: direction
          .clone()
          .multiplyScalar(PLANET_RADIUS * CLOUD_ALTITUDE),
        quaternion: new THREE.Quaternion().setFromUnitVectors(UP, direction),
        puffs,
      });
    }

    return list;
  }, []);

  return (
    <>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position} quaternion={cloud.quaternion}>
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
    </>
  );
}
