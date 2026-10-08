// Smooth "value noise": nearby points get similar values,so colours form soft patches instead of random speckle. Returns roughly 0 to 1.

function hash(x, y, z) {
  const value = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return value - Math.floor(value);
}

const smooth = (t) => t * t * (3 - 2 * t);
const mix = (a, b, t) => a + (b - a) * t;

export function smoothNoise(direction, scale = 1) {
  const x = direction.x * scale + 3;
  const y = direction.y * scale + 7;
  const z = direction.z * scale + 11;

  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = smooth(x - xi);
  const v = smooth(y - yi);
  const w = smooth(z - zi);

  const corner = (i, j, k) => hash(xi + i, yi + j, zi + k);

  return mix(
    mix(
      mix(corner(0, 0, 0), corner(1, 0, 0), u),
      mix(corner(0, 1, 0), corner(1, 1, 0), u),
      v,
    ),
    mix(
      mix(corner(0, 0, 1), corner(1, 0, 1), u),
      mix(corner(0, 1, 1), corner(1, 1, 1), u),
      v,
    ),
    w,
  );
}
