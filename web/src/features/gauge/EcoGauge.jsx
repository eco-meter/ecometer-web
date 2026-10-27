import { useId, useRef } from "react";
import { useInView } from "../../hooks/useInView.js";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import { useCountUp } from "../../hooks/useCountUp.js";
import { MAX_TOTAL } from "../../lib/scores.js";
import "./EcoGauge.css";

// All numbers are in Figma units, measured from the "Gauge" frame
// on the Final Copies → Restaurant page. The SVG scales them down.
const SCALE_TOP = 38; // y of the 300 tick
const SCALE_BOTTOM = 832; // y of the 0 tick
const SCALE_HEIGHT = SCALE_BOTTOM - SCALE_TOP;

const BULB = { cx: 190, cy: 1005, r: 155 };
const CHANNEL = { x: 142, width: 94, radius: 47 };

const TICKS = [0, 50, 100, 150, 200, 250, 300];
const LABELS = [0, 100, 200, 300];

function scoreToY(score) {
  return SCALE_BOTTOM - (score / MAX_TOTAL) * SCALE_HEIGHT;
}

export default function EcoGauge({ total }) {
  const ref = useRef(null);
  const gradientId = useId();
  const clipId = useId();

  const reducedMotion = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, rootMargin: "-10% 0px" });
  const started = inView || reducedMotion;

  const hasScore = total != null;
  const displayed = useCountUp(total, {
    start: started,
    instant: reducedMotion,
  });

  // The fluid is one tall column that slides up from inside the bulb.
  const hiddenOffset = SCALE_HEIGHT + 60;
  const filledOffset = hasScore ? scoreToY(total) - SCALE_TOP : hiddenOffset;
  const offset = started ? filledOffset : hiddenOffset;

  const label = hasScore
    ? `Total score: ${total} out of ${MAX_TOTAL}`
    : "Total score: not yet scored";

  return (
    <div className='eco-gauge' ref={ref}>
      <svg viewBox='-4 -4 390 1204' role='img' aria-label={label}>
        <defs>
          <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' className='eco-gauge__stop--top' />
            <stop offset='100%' className='eco-gauge__stop--bottom' />
          </linearGradient>
          <clipPath id={clipId}>
            <rect
              x={CHANNEL.x}
              y={SCALE_TOP}
              width={CHANNEL.width}
              height={BULB.cy - SCALE_TOP}
              rx={CHANNEL.radius}
            />
          </clipPath>
        </defs>

        {/* Casing: an outlined copy underneath, a cream copy on top */}
        <g className='eco-gauge__casing-outline'>
          <rect x='109' y='0' width='163' height='967' rx='81.5' />
          <circle cx={BULB.cx} cy={BULB.cy} r='190' />
        </g>
        <g className='eco-gauge__casing'>
          <rect x='109' y='0' width='163' height='967' rx='81.5' />
          <circle cx={BULB.cx} cy={BULB.cy} r='190' />
        </g>

        {/* Empty channel */}
        <rect
          className='eco-gauge__track'
          x={CHANNEL.x}
          y={SCALE_TOP}
          width={CHANNEL.width}
          height='852'
          rx={CHANNEL.radius}
        />

        {/* Fluid */}
        <g clipPath={`url(#${clipId})`}>
          <rect
            className='eco-gauge__fluid'
            x={CHANNEL.x}
            y={SCALE_TOP}
            width={CHANNEL.width}
            height={BULB.cy - SCALE_TOP}
            rx={CHANNEL.radius}
            fill={`url(#${gradientId})`}
            style={{ transform: `translateY(${offset}px)` }}
          />
        </g>

        {/* Bulb */}
        <circle
          className='eco-gauge__bulb'
          cx={BULB.cx}
          cy={BULB.cy}
          r={BULB.r}
        />
        <ellipse
          className='eco-gauge__highlight'
          cx='282'
          cy='925'
          rx='30'
          ry='38'
          transform='rotate(-35 282 925)'
        />

        {/* Scale */}
        <g aria-hidden='true'>
          {TICKS.map((tick) => (
            <line
              key={tick}
              className='eco-gauge__tick'
              x1={LABELS.includes(tick) ? 221 : 236}
              x2='256'
              y1={scoreToY(tick)}
              y2={scoreToY(tick)}
            />
          ))}
          {LABELS.map((value) => (
            <text
              key={value}
              className='eco-gauge__scale-label'
              x='297'
              y={scoreToY(value) + 8}
            >
              {value}
            </text>
          ))}
        </g>

        {/* Score in the bulb */}
        <g aria-hidden='true' textAnchor='middle'>
          <text className='eco-gauge__bulb-label' x={BULB.cx} y='985'>
            TOTAL SCORE
          </text>
          <text
            className={`eco-gauge__value ${hasScore ? "" : "eco-gauge__value--empty"}`}
            x={BULB.cx}
            y='1065'
          >
            {hasScore ? displayed : "TBD"}
          </text>
          {hasScore && (
            <text className='eco-gauge__max' x={BULB.cx} y='1105'>
              /{MAX_TOTAL}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
