import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function useSpin({ maxPitch = 0.6, initialPitch = 0.25 } = {}) {
  const { gl, invalidate } = useThree();
  const pitchRef = useRef(null);
  const yawRef = useRef(null);

  const spin = useRef({
    yaw: 0,
    pitch: initialPitch,
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
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
      canvas.setPointerCapture(event.pointerId);
    };

    const onMove = (event) => {
      if (!s.dragging || event.pointerId !== s.pointerId) return;

      const width = canvas.clientWidth || 1;
      const dx = event.clientX - s.lastX;
      const dy = event.clientY - s.lastY;

      s.yaw += (dx / width) * Math.PI;
      s.pitch = clamp(s.pitch + (dy / width) * Math.PI, -maxPitch, maxPitch);

      s.lastX = event.clientX;
      s.lastY = event.clientY;
      invalidate();
    };

    const onUp = (event) => {
      if (event.pointerId !== s.pointerId) return;
      s.dragging = false;
      s.pointerId = null;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
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

  useFrame(() => {
    const s = spin.current;
    if (yawRef.current) yawRef.current.rotation.y = s.yaw;
    if (pitchRef.current) pitchRef.current.rotation.x = s.pitch;
  });

  return { pitchRef, yawRef };
}
