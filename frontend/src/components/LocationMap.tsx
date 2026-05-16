import { useId } from 'react';
import { useLang } from '../i18n/LangContext';
import type { Violation } from '../data/violations';

const ROADS = [
  { x1: -20, y1: 346, x2: 980, y2: 300, w: 30 },
  { x1: 402, y1: -20, x2: 486, y2: 620, w: 22 },
  { x1: -20, y1: 70, x2: 720, y2: 620, w: 17 },
  { x1: 632, y1: -20, x2: 742, y2: 620, w: 11 },
  { x1: -20, y1: 150, x2: 980, y2: 120, w: 11 },
  { x1: -20, y1: 486, x2: 980, y2: 516, w: 13 },
];

const BLOCKS = [
  { x: 60, y: 58, w: 96, h: 60 },
  { x: 176, y: 62, w: 110, h: 70 },
  { x: 536, y: 66, w: 120, h: 64 },
  { x: 60, y: 214, w: 112, h: 74 },
  { x: 330, y: 168, w: 116, h: 80 },
  { x: 540, y: 376, w: 142, h: 92 },
  { x: 760, y: 372, w: 116, h: 74 },
  { x: 300, y: 430, w: 124, h: 82 },
];

export function LocationMap({ violation }: { violation: Violation }) {
  const { t, lang } = useLang();
  const uid = useId().replace(/:/g, '');
  const px = 447;
  const py = 322;

  return (
    <svg viewBox="0 0 960 600" style={{ width: '100%', height: 'auto', display: 'block' }} role="img">
      <defs>
        <filter id={`shadow-${uid}`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#0a1f3c" floodOpacity="0.28" />
        </filter>
      </defs>

      <rect x={0} y={0} width={960} height={600} fill="#e7ebf0" />

      <path
        d="M -30 452 C 180 412 340 506 540 470 C 700 442 860 492 990 460"
        fill="none"
        stroke="#bcdcec"
        strokeWidth={52}
        strokeLinecap="round"
      />

      <rect x={716} y={62} width={200} height={152} rx={14} fill="#cfe6cc" />
      <rect x={70} y={402} width={186} height={150} rx={14} fill="#cfe6cc" />

      {BLOCKS.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={6}
          fill="#dde4eb"
          stroke="#ccd4de"
          strokeWidth={1.5}
        />
      ))}

      {ROADS.map((r, i) => (
        <line
          key={`c${i}`}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke="#c4ccd6"
          strokeWidth={r.w + 7}
          strokeLinecap="round"
        />
      ))}
      {ROADS.map((r, i) => (
        <line
          key={`s${i}`}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke="#fbfcfd"
          strokeWidth={r.w}
          strokeLinecap="round"
        />
      ))}

      <text
        x={250}
        y={336}
        fill="#8c97a6"
        fontSize={15}
        fontWeight={700}
        letterSpacing={1}
        transform="rotate(-2.6 250 336)"
      >
        {violation.street[lang].toUpperCase()}
      </text>

      {/* Camera marker */}
      <g>
        <circle cx={px + 96} cy={py - 58} r={17} fill="#0a1f3c" filter={`url(#shadow-${uid})`} />
        <rect x={px + 88} y={py - 63} width={16} height={11} rx={2.5} fill="#ffffff" />
        <circle cx={px + 96} cy={py - 57.5} r={3} fill="#0a1f3c" />
        <rect x={px + 78} y={py - 44} width={92} height={20} rx={6} fill="#0a1f3c" />
        <text
          x={px + 124}
          y={py - 34}
          fill="#ffffff"
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {violation.cameraId}
        </text>
      </g>

      {/* Pulse + pin */}
      <circle cx={px} cy={py} fill="#e23b3b" opacity={0.18} r={14}>
        <animate attributeName="r" values="14;58;14" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0;0.45" dur="3s" repeatCount="indefinite" />
      </circle>
      <ellipse cx={px} cy={py + 2} rx={15} ry={5} fill="#0a1f3c" opacity={0.25} />
      <polygon points={`${px - 13},${py - 40} ${px + 13},${py - 40} ${px},${py}`} fill="#e23b3b" />
      <circle cx={px} cy={py - 47} r={21} fill="#e23b3b" filter={`url(#shadow-${uid})`} />
      <circle cx={px} cy={py - 47} r={8.5} fill="#ffffff" />

      {/* Info card */}
      <g filter={`url(#shadow-${uid})`}>
        <rect x={24} y={24} width={344} height={100} rx={12} fill="#ffffff" />
      </g>
      <polygon points="46,58 58,58 52,72" fill="#e23b3b" />
      <circle cx={52} cy={54} r={9} fill="#e23b3b" />
      <circle cx={52} cy={54} r={3.6} fill="#ffffff" />
      <text x={74} y={52} fill="#0a1f3c" fontSize={17} fontWeight={800} dominantBaseline="central">
        {violation.street[lang]}
      </text>
      <text x={74} y={74} fill="#64748b" fontSize={13} dominantBaseline="central">
        {violation.city[lang]}
      </text>
      <text
        x={42}
        y={102}
        fill="#475569"
        fontSize={12}
        dominantBaseline="central"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        {`${violation.coordinates.lat.toFixed(5)}, ${violation.coordinates.lng.toFixed(5)}`}
      </text>

      {/* Compass */}
      <g>
        <circle cx={904} cy={62} r={24} fill="#ffffff" filter={`url(#shadow-${uid})`} />
        <polygon points="904,46 911,66 904,60 897,66" fill="#e23b3b" />
        <text x={904} y={78} fill="#475569" fontSize={11} fontWeight={700} textAnchor="middle">
          N
        </text>
      </g>

      {/* Scale bar */}
      <g stroke="#475569" strokeWidth={2}>
        <line x1={30} y1={566} x2={120} y2={566} />
        <line x1={30} y1={561} x2={30} y2={571} />
        <line x1={120} y1={561} x2={120} y2={571} />
      </g>
      <text x={30} y={552} fill="#475569" fontSize={11} fontWeight={600}>
        200 m
      </text>
      <text x={936} y={578} fill="#94a3b8" fontSize={11} textAnchor="end">
        {`Safe City MK · ${t('evidence.tab.map')}`}
      </text>
    </svg>
  );
}
