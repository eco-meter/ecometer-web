import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

//  If the pointer sat still this long before release, it's a "place", not a "flick".
const FLICK_WINDOW_MS = 80;

export function useSpin({
  maxPitch = 0.6,
  initialPitch = 0.25,
  damping = 3.5,
} = {}) {
  const { gl, invalidate } = useThree();
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
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const s = spin.current;

    const onDown = (event) => {
      if (event.button !== 0) return;
      s.dragging = true;
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
      const deltaYaw = ((event.clientX - s.lastX) / width) * Math.PI;
      const deltaPitch = ((event.clientY - s.lastY) / width) * Math.PI;

      s.yaw += deltaYaw;
      s.pitch = clamp(s.pitch + deltaPitch, -maxPitch, maxPitch);

      // Speed in radians per second, smoothed so one jittery event can't define the flick.
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
  }, [gl, invalidate, maxPitch]);

  useFrame((_, delta) => {
    const s = spin.current;
    // Cap the frame time so returning to background tab doesn't fling globe
    const dt = Math.min(delta, 0.05);

    if (!s.dragging) {
      s.yaw += s.velYaw * dt;
      s.pitch = clamp(s.pitch + s.velPitch * dt, -maxPitch, maxPitch);

      const decay = Math.exp(-damping * dt);
      s.velYaw *= decay;
      s.velPitch *= decay;

      if (Math.abs(s.pitch) >= maxPitch) s.velPitch = 0;
      if (Math.abs(s.velYaw) < 0.001) s.velYaw = 0;
      if (Math.abs(s.velPitch) < 0.001) s.velPitch = 0;
    }

    if (yawRef.current) yawRef.current.rotation.y = s.yaw;
    if (pitchRef.current) pitchRef.current.rotation.x = s.pitch;

    if (s.dragging || s.velYaw !== 0 || s.velPitch !== 0) invalidate();
  });

  return { pitchRef, yawRef };
}
