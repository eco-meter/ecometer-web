import * as THREE from "three";
import { getCuisineColor } from "./cuisineColors";

// White line icons drawn in the middle of each sticker, one per cuisine.
// From the Phosphor (Light Weight) and Tabler icon sets via Iconify.
const CUISINE_ICONS = {
  // Phosphor Light "coffee"
  Cafe: {
    viewBox: "0 0 256 256",
    body: '<path fill="#ffffff" d="M82 56V24a6 6 0 0 1 12 0v32a6 6 0 0 1-12 0m38 6a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m32 0a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m94 58v8a38 38 0 0 1-36.94 38a94.55 94.55 0 0 1-31.13 44H208a6 6 0 0 1 0 12H32a6 6 0 0 1 0-12h30.07A94.34 94.34 0 0 1 26 136V88a6 6 0 0 1 6-6h176a38 38 0 0 1 38 38m-44 16V94H38v42a82.27 82.27 0 0 0 46.67 74h70.66A82.27 82.27 0 0 0 202 136m32-16a26 26 0 0 0-20-25.29V136a93 93 0 0 1-1.69 17.64A26 26 0 0 0 234 128Z"/>',
  },
  // Phosphor Light "pizza"
  Pizza: {
    viewBox: "0 0 256 256",
    body: '<path fill="#ffffff" d="M237.6 63.47a13.9 13.9 0 0 0-6.35-8.67a199.48 199.48 0 0 0-206.5 0a14 14 0 0 0-4.7 19.2l96 157.27a14 14 0 0 0 24 0L236 74a13.8 13.8 0 0 0 1.6-10.53M61.07 118.2a26 26 0 1 1 26.1 42.8Zm91 70.32a26 26 0 0 1 26.91-44.1Zm33.2-54.4A37.65 37.65 0 0 0 168 130a38 38 0 0 0-22.250 68.8l-16 26.24a2 2 0 0 1-3.46 0l-32.7-53.55a38 38 0 1 0-38.93-63.79l-8.61-14.11a154.14 154.14 0 0 1 163.9 0Zm40.49-66.35l-9.56 15.58a166.11 166.11 0 0 0-176.4 0l-9.51-15.58a1.88 1.88 0 0 1-.23-1.47a2 2 0 0 1 .94-1.24a187.46 187.46 0 0 1 194 0a2 2 0 0 1 .92 1.24a1.88 1.88 0 0 1-.21 1.47Z"/>',
  },
  // Phosphor Light "fish"
  Seafood: {
    viewBox: "0 0 256 256",
    body: '<path fill="#ffffff" d="M166 76a10 10 0 1 1-10-10a10 10 0 0 1 10 10m49 66.67c-19.17 34.54-55.11 53.08-106.85 55.14l-22.53 52.55A6 6 0 0 1 80.1 254h-.38a6 6 0 0 1-5.39-4.340l-15.11-52.89l-52.87-15.14a6 6 0 0 1-.71-11.290l52.56-22.49C60.28 96.13 78.81 60.2 113.33 41C159.56 15.34 219 30 222.09 31.78a6 6 0 0 1 2.12 2.11c1.79 3.05 16.46 62.49-9.21 108.76Zm-48 29.64A50.06 50.06 0 0 1 130 126a50.09 50.09 0 0 1-46.29-37c-8.46 16.93-13 38-13.63 63a6 6 0 0 1-3.64 5.380l-40.56 17.36l39.85 11.41a6 6 0 0 1 4.12 4.12l11.38 39.85l17.39-40.56a6 6 0 0 1 5.37-3.64c25.01-.59 46.06-5.16 63.01-13.63Zm51-94.53a171 171 0 0 0-3.86-35.92A170.8 170.8 0 0 0 178.25 38H178c-18.52 0-45 3.22-66.67 18.47a83.5 83.5 0 0 0-17.16 16.09a38 38 0 0 0 41.47 41.25a6 6 0 0 1 6.54 6.55a38 38 0 0 0 41.28 41.46a83.1 83.1 0 0 0 16.07-17.07C214.87 123 218.05 96.31 218 77.76Z"/>',
  },
  // Tabler "salad" (stroke thinned to match)
  Lebanese: {
    viewBox: "0 0 24 24",
    body: '<g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"><path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5-2.517 5.573-4 6.5v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-1c-1.687-1.054-4-5-4-6.5V12a1 1 0 0 1 1-1m14.5 0c.351-1.017.426-2.236.5-3.714V6h-2.256c-2.83 0-4.616.804-5.64 2.076"/><path d="M5.255 11.008A12 12 0 0 1 5 9V8h1.755c.98 0 1.801.124 2.479.35M8 8l1-4l4 2.5"/><path d="M13 11v-.5a2.5 2.5 0 1 0-5 0v.5"/></g>',
  },
  // Phosphor Light "plant"
  Vegan: {
    viewBox: "0 0 256 256",
    body: '<path fill="#ffffff" d="M245.63 48a6 6 0 0 0-5.63-5.630c-51-3-91.88 12.42-109.35 41.26c-11.63 19.21-11.38 42.68.53 65a69.4 69.4 0 0 0-15.48 30.59l-19.8-19.81c8.15-16.1 8.1-32.95-.32-46.850C82.77 91.41 53 80.070 15.9 82.27a6 6 0 0 0-5.63 5.64c-2.18 37.09 9.14 66.86 30.29 79.67A43.75 43.75 0 0 0 63.44 174a53.2 53.2 0 0 0 24-6L114 194.48V224a6 6 0 0 0 12 0v-29.49A57.55 57.55 0 0 1 139.76 157c11.21 5.93 22.72 8.91 33.82 8.91a58.9 58.9 0 0 0 30.79-8.570C233.21 139.89 248.63 99 245.63 48M46.78 157.31C30.47 147.44 21.39 124 22 94c30-.65 53.41 8.44 63.28 24.75c5.68 9.37 6.16 20.38 1.54 31.59l-26.58-26.59a6 6 0 0 0-8.49 8.49l26.62 26.61c-11.21 4.62-22.22 4.15-31.59-1.54m151.38-10.22c-14.74 8.92-32.14 9.18-49.67.9l55.76-55.750a6 6 0 0 0-8.49-8.490L140 139.51c-8.28-17.53-8-34.93.9-49.660c14.52-24 49.06-37.18 93-35.75c1.43 43.9-11.76 78.46-35.74 92.99"/>',
  },
  // Phosphor Light "avocado"
  Healthy: {
    viewBox: "0 0 256 256",
    body: '<path fill="#ffffff" d="M128 114a46 46 0 1 0 46 46a46.06 46.06 0 0 0-46-46m0 80a34 34 0 1 1 34-34a34 34 0 0 1-34 34m81.1-62.68l-29.8-84.21A54 54 0 0 0 77.08 46l-29.52 83.52a86 86 0 1 0 161.54 1.8M128 234a74.050 74.050 0 0 1-69.2-100.28c0-.05 0-.09.05-.13L88.39 50a42 42 0 0 1 79.53.92s0 .08.05.13l29.82 84.28A74.06 74.06 0 0 1 128 234"/>',
  },
  // Phosphor Light "pepper"
  Mexican: {
    viewBox: "0 0 256 256",
    body: '<path fill="#ffffff" d="M165.57 42.26A38.07 38.07 0 0 0 128 10a6 6 0 0 0 0 12a26 26 0 0 1 25.38 20.35A62.08 62.08 0 0 0 98 104c0 47.75-26.23 79.68-78 94.93a14 14 0 0 0 1.56 27.24A262.5 262.5 0 0 0 66.81 230c40.36 0 85.23-9 116.19-35c25.88-21.71 39-52.33 39-91a62.06 62.06 0 0 0-56.43-61.74M160 54a50.09 50.09 0 0 1 47.82 35.38L192 97.28l-29.32-14.66a6 6 0 0 0-5.36 0L128 97.28l-15.81-7.91A50.07 50.07 0 0 1 160 54m15.28 131.82C150.15 206.89 95.36 227 23.67 214.33a1.88 1.88 0 0 1-1.67-1.89a1.81 1.81 0 0 1 1.43-2C80.06 193.73 110 156.92 110 104c0-.76 0-1.51.06-2.26l15.26 7.63a6 6 0 0 0 5.36 0L160 94.69l29.32 14.66a6 6 0 0 0 5.36 0l15.26-7.63c0 .75.06 1.5.06 2.26c0 35.02-11.68 62.51-34.72 81.83Z"/>',
  },
};

const SIZE = 256; // texture size in pixels
const ICON_SIZE = SIZE * 0.4;

const cache = new Map();

function drawBase(ctx, cuisine) {
  const center = SIZE / 2;

  // Shadow, nudged down and right so the sticker looks slightly lifted
  ctx.fillStyle = "rgba(20, 40, 20, 0.25)";
  ctx.beginPath();
  ctx.arc(center + 6, center + 8, SIZE * 0.44, 0, Math.PI * 2);
  ctx.fill();

  // White border
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(center, center, SIZE * 0.44, 0, Math.PI * 2);
  ctx.fill();

  // Cuisine colour
  ctx.fillStyle = getCuisineColor(cuisine);
  ctx.beginPath();
  ctx.arc(center, center, SIZE * 0.36, 0, Math.PI * 2);
  ctx.fill();
}

// Turns an icon into an <img> the canvas can draw. Resolves when loaded.
function loadIcon(icon) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${ICON_SIZE}" height="${ICON_SIZE}">${icon.body}</svg>`;
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return image.decode().then(() => image);
}

// Draws a round sticker: soft shadow, white border, cuisine color, icon.
// Each cuisine is drawn once and reused by every restaurant that shares it.`
// The icon loads a moment later; `texture.userData.ready` resolves when it's in.
export function getStickerTexture(cuisine) {
  if (cache.has(cuisine)) return cache.get(cuisine);

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  drawBase(ctx, cuisine);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const icon = CUISINE_ICONS[cuisine];
  texture.userData.ready = icon
    ? loadIcon(icon)
        .then((image) => {
          const offset = (SIZE - ICON_SIZE) / 2;
          ctx.drawImage(image, offset, offset, ICON_SIZE, ICON_SIZE);
          texture.needsUpdate = true;
        })
        .catch(() => {}) // if an icon fails, the plain sticker still shows
    : Promise.resolve();

  cache.set(cuisine, texture);
  return texture;
}
