import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

// Shortest signed angle, between -π and π.
const wrapAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

const DEG_TO_RAD = Math.PI / 180;
const FLICK_WINDOW_MS = 80;
const FLY_SPEED = 4; // higher arrives faster

export function useSpin({
  maxPitch = 0.6,
  initialPitch = 0.25,
  damping = 3.5,
  focus = null,
  baseDistance = 7,
  focusDistance = 4.2,
  planetRadius = 1.6,
  instant = false,
} = {}) {
  const { gl, invalidate, get } = useThree();
  const pitchRef = useRef(null);
  const yawRef = useRef(null);

  const spin = useRef({
    yaw: 0,
    pitch: initialPitch,
    velYaw: 0,
    velPitch: 0,
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    flying: false,
    targetYaw: 0,
    targetPitch: 0,
  });

  const focusLat = focus?.lat ?? null;
  const focusLng = focus?.lng ?? null;

  // Fly to the focused region whenever it changes.
  useEffect(() => {
    const s = spin.current;

    if (focusLat === null) {
      s.flying = false;
      invalidate();
      return;
    }

    const yawTarget = -focusLng * DEG_TO_RAD;
    s.targetYaw = s.yaw + wrapAngle(yawTarget - s.yaw);
    s.targetPitch = clamp(focusLat * DEG_TO_RAD, -maxPitch, maxPitch);
    s.velYaw = 0;
    s.velPitch = 0;
    s.flying = true;
    invalidate();
  }, [focusLat, focusLng, maxPitch, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const s = spin.current;

    const onDown = (event) => {
      if (event.button !== 0) return;
      s.dragging = true;
      s.flying = false;
      s.pointerId = event.pointerId;
      s.lastX = event.clientX;
      s.lastY = event.clientY;
      s.lastTime = performance.now();
      s.velYaw = 0;
      s.velPitch = 0;
      canvas.setPointerCapture(event.pointerId);
    };

    const onMove = (event) => {
      if (!s.dragging || event.pointerId !== s.pointerId) return;

      const now = performance.now();
      const seconds = Math.max((now - s.lastTime) / 1000, 1 / 240);
      const width = canvas.clientWidth || 1;

      // Closer camera = slower spin, so dragging feels the same zoomed in.
      const distance = get().camera.position.z;
      const zoomScale =
        (distance - planetRadius) / (baseDistance - planetRadius);

      const deltaYaw =
        ((event.clientX - s.lastX) / width) * Math.PI * zoomScale;
      const deltaPitch =
        ((event.clientY - s.lastY) / width) * Math.PI * zoomScale;

      s.yaw += deltaYaw;
      s.pitch = clamp(s.pitch + deltaPitch, -maxPitch, maxPitch);

      s.velYaw = lerp(s.velYaw, deltaYaw / seconds, 0.5);
      s.velPitch = lerp(s.velPitch, deltaPitch / seconds, 0.5);

      s.lastX = event.clientX;
      s.lastY = event.clientY;
      s.lastTime = now;
      invalidate();
    };

    const onUp = (event) => {
      if (event.pointerId !== s.pointerId) return;
      s.dragging = false;
      s.pointerId = null;

      const heldStill = performance.now() - s.lastTime > FLICK_WINDOW_MS;
      if (heldStill || event.type === "pointercancel") {
        s.velYaw = 0;
        s.velPitch = 0;
      }

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      invalidate();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [gl, invalidate, get, maxPitch, baseDistance, planetRadius]);

  useFrame((state, delta) => {
    const s = spin.current;
    const dt = Math.min(delta, 0.05);
    const ease = instant ? 1 : 1 - Math.exp(-FLY_SPEED * dt);

    if (s.flying && !s.dragging) {
      s.yaw += (s.targetYaw - s.yaw) * ease;
      s.pitch += (s.targetPitch - s.pitch) * ease;

      const arrived =
        Math.abs(s.targetYaw - s.yaw) < 0.0005 &&
        Math.abs(s.targetPitch - s.pitch) < 0.0005;
      if (arrived) {
        s.yaw = s.targetYaw;
        s.pitch = s.targetPitch;
        s.flying = false;
      }
    } else if (!s.dragging) {
      s.yaw += s.velYaw * dt;
      s.pitch = clamp(s.pitch + s.velPitch * dt, -maxPitch, maxPitch);

      const decay = Math.exp(-damping * dt);
      s.velYaw *= decay;
      s.velPitch *= decay;

      if (Math.abs(s.pitch) >= maxPitch) s.velPitch = 0;
      if (Math.abs(s.velYaw) < 0.001) s.velYaw = 0;
      if (Math.abs(s.velPitch) < 0.001) s.velPitch = 0;
    }

    // Ease the camera towards the zoom level for the current view.
    const camera = state.camera;
    const targetDistance = focusLat === null ? baseDistance : focusDistance;
    const gap = targetDistance - camera.position.z;
    const zooming = Math.abs(gap) > 0.001;
    camera.position.z = zooming
      ? camera.position.z + gap * ease
      : targetDistance;

    if (yawRef.current) yawRef.current.rotation.y = s.yaw;
    if (pitchRef.current) pitchRef.current.rotation.x = s.pitch;

    if (
      s.dragging ||
      s.flying ||
      zooming ||
      s.velYaw !== 0 ||
      s.velPitch !== 0
    ) {
      invalidate();
    }
  });

  return { pitchRef, yawRef };
}
