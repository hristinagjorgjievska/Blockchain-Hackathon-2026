import { useId } from 'react';
import { useLang } from '../i18n/LangContext';
import { formatDateTime } from '../lib/format';
import { type Violation } from '../data/violations';

const VIEWBOX = '0 0 960 600';
const CYAN = '#4fd6e8';

/** Renders an EU-style Macedonian licence plate. */
function plateGroup(x: number, y: number, w: number, plate: string) {
  const h = w / 4.6;
  const r = h * 0.16;
  const stripW = w * 0.16;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill="#f4f5f3"
        stroke="#0d0f15"
        strokeWidth={Math.max(1, h * 0.045)}
      />
      <path
        d={`M ${x + r} ${y} L ${x + stripW} ${y} L ${x + stripW} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`}
        fill="#0a39c4"
      />
      <text
        x={x + stripW / 2}
        y={y + h * 0.68}
        fill="#ffffff"
        fontSize={h * 0.26}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="system-ui, sans-serif"
      >
        MK
      </text>
      <text
        x={x + stripW + (w - stripW) / 2}
        y={y + h / 2}
        fill="#16181d"
        fontSize={h * 0.46}
        fontWeight={800}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
      >
        {plate}
      </text>
    </g>
  );
}

function cornerBrackets(x: number, y: number, w: number, h: number, len: number, color: string) {
  return (
    <g stroke={color} strokeWidth={3} fill="none" strokeLinecap="round">
      <path d={`M${x} ${y + len} L${x} ${y} L${x + len} ${y}`} />
      <path d={`M${x + w - len} ${y} L${x + w} ${y} L${x + w} ${y + len}`} />
      <path d={`M${x} ${y + h - len} L${x} ${y + h} L${x + len} ${y + h}`} />
      <path d={`M${x + w - len} ${y + h} L${x + w} ${y + h} L${x + w} ${y + h - len}`} />
    </g>
  );
}

interface FrameProps {
  violation: Violation;
}

function SceneFrame({ violation }: FrameProps) {
  const { t, lang } = useLang();
  const uid = useId().replace(/:/g, '');

  const buildings = [
    { x: 18, y: 214, w: 74, h: 128 },
    { x: 98, y: 250, w: 56, h: 92 },
    { x: 158, y: 226, w: 66, h: 116 },
    { x: 700, y: 258, w: 56, h: 84 },
    { x: 760, y: 232, w: 66, h: 110 },
    { x: 832, y: 200, w: 78, h: 142 },
  ];

  const dashes = [
    { x: 469, y: 558, w: 22, h: 30 },
    { x: 472, y: 498, w: 16, h: 22 },
    { x: 474.5, y: 452, w: 11, h: 16 },
    { x: 476.5, y: 418, w: 7, h: 11 },
    { x: 478, y: 392, w: 4, h: 8 },
  ];

  const isSpeeding = violation.kind === 'speeding';
  const targetLabel = t('evidence.targetLocked');

  return (
    <svg viewBox={VIEWBOX} style={{ width: '100%', height: 'auto', display: 'block' }} role="img">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141f37" />
          <stop offset="100%" stopColor="#37496c" />
        </linearGradient>
        <linearGradient id={`ground-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c313d" />
          <stop offset="100%" stopColor="#3c4351" />
        </linearGradient>
        <linearGradient id={`road-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f232c" />
          <stop offset="100%" stopColor="#2d323d" />
        </linearGradient>
        <radialGradient id={`vig-${uid}`} cx="50%" cy="44%" r="72%">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
        <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <rect x={0} y={0} width={960} height={344} fill={`url(#sky-${uid})`} />
      <rect x={0} y={338} width={960} height={262} fill={`url(#ground-${uid})`} />

      {buildings.map((b, i) => {
        const windows: JSX.Element[] = [];
        const cols = Math.floor((b.w - 12) / 18);
        const rows = Math.floor((b.h - 14) / 22);
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            windows.push(
              <rect
                key={`${c}-${r}`}
                x={b.x + 9 + c * 18}
                y={b.y + 11 + r * 22}
                width={9}
                height={11}
                fill="#f6d287"
                opacity={((c * 7 + r * 3) % 5) / 9 + 0.12}
              />,
            );
          }
        }
        return (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#1b2334" />
            {windows}
          </g>
        );
      })}

      <polygon points="120,600 840,600 562,340 398,340" fill={`url(#road-${uid})`} />
      <polygon points="120,600 138,600 402,341 396,341" fill="#ffffff" opacity={0.5} />
      <polygon points="840,600 822,600 558,341 564,341" fill="#ffffff" opacity={0.5} />
      {dashes.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width={d.w} height={d.h} fill="#ffffff" opacity={0.82} />
      ))}

      {violation.kind === 'red_light' && (
        <g>
          <rect x={791} y={150} width={8} height={406} fill="#23272f" />
          <rect x={770} y={150} width={50} height={120} rx={12} fill="#191c22" />
          <circle cx={795} cy={182} r={26} fill="#ff3b30" opacity={0.32} filter={`url(#glow-${uid})`} />
          <circle cx={795} cy={182} r={15} fill="#ff453a" />
          <circle cx={795} cy={210} r={15} fill="#5a4a1c" />
          <circle cx={795} cy={238} r={15} fill="#1f4a2a" />
        </g>
      )}

      {violation.kind === 'expired_registration' && (
        <g>
          <rect x={118} y={356} width={92} height={64} rx={10} fill="#f8fafc" stroke="#1e293b" strokeWidth={3} />
          <path d="M136 378h56M136 396h38" stroke="#334125" strokeWidth={5} strokeLinecap="round" />
          <circle cx={190} cy={397} r={9} fill="#ef4444" />
        </g>
      )}

      {violation.kind === 'no_parking' && (
        <g>
          <rect x={161} y={372} width={8} height={188} fill="#23272f" />
          <circle cx={165} cy={356} r={34} fill="#1b54b8" stroke="#e23b3b" strokeWidth={7} />
          <line x1={145} y1={336} x2={185} y2={376} stroke="#e23b3b" strokeWidth={7} strokeLinecap="round" />
        </g>
      )}

      {isSpeeding && (
        <g opacity={0.5}>
          <rect x={170} y={332} width={150} height={9} rx={4} fill="#9fe0ff" />
          <rect x={150} y={372} width={170} height={11} rx={5} fill="#9fe0ff" />
          <rect x={188} y={412} width={130} height={9} rx={4} fill="#9fe0ff" />
          <rect x={642} y={332} width={150} height={9} rx={4} fill="#9fe0ff" />
          <rect x={642} y={372} width={170} height={11} rx={5} fill="#9fe0ff" />
          <rect x={642} y={412} width={130} height={9} rx={4} fill="#9fe0ff" />
        </g>
      )}

      <image
        href="/seatcordoba.png"
        x={0}
        y={0}
        width={960}
        height={600}
        preserveAspectRatio="xMidYMid slice"
      />

      {cornerBrackets(300, 244, 360, 232, 34, CYAN)}
      <rect
        x={300}
        y={244}
        width={360}
        height={232}
        fill="none"
        stroke={CYAN}
        strokeWidth={1.5}
        strokeDasharray="4 6"
        opacity={0.4}
      />
      <g>
        <rect x={300} y={221} width={11 * targetLabel.length + 24} height={20} rx={3} fill={CYAN} />
        <circle cx={311} cy={231} r={4} fill="#06222a" />
        <text x={322} y={231} fill="#06222a" fontSize={12} fontWeight={700} dominantBaseline="central">
          {targetLabel}
        </text>
      </g>

      <rect x={0} y={0} width={960} height={600} fill={`url(#vig-${uid})`} />

      <rect x={0} y={0} width={960} height={54} fill="#000000" opacity={0.55} />
      <circle cx={26} cy={27} r={7} fill="#ff3b30" />
      <text x={42} y={27} fill="#ffffff" fontSize={13} fontWeight={700} dominantBaseline="central">
        {t('evidence.recording')}
      </text>
      <text x={118} y={27} fill="#ffffff" fontSize={16} fontWeight={800} dominantBaseline="central">
        SafeChain MK
      </text>
      <text x={272} y={27} fill="#9fb3c8" fontSize={13} dominantBaseline="central">
        {`${t('evidence.camera')} ${violation.cameraId}`}
      </text>
      <text
        x={936}
        y={27}
        fill="#ffffff"
        fontSize={14}
        textAnchor="end"
        dominantBaseline="central"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
      >
        {formatDateTime(violation.dateTime, lang)}
      </text>

      <rect x={0} y={546} width={960} height={54} fill="#000000" opacity={0.55} />
      <text x={24} y={566} fill="#ffffff" fontSize={14} fontWeight={600} dominantBaseline="central">
        {`${violation.street[lang]}, ${violation.city[lang]}`}
      </text>
      <text x={24} y={586} fill="#9fb3c8" fontSize={11} dominantBaseline="central">
        {`${violation.coordinates.lat.toFixed(5)}, ${violation.coordinates.lng.toFixed(5)}`}
      </text>
      {isSpeeding && violation.speedRecorded && violation.speedLimit ? (
        <>
          <text
            x={936}
            y={566}
            fill="#ff5a4d"
            fontSize={22}
            fontWeight={800}
            textAnchor="end"
            dominantBaseline="central"
          >
            {`${violation.speedRecorded} km/h`}
          </text>
          <text x={936} y={587} fill="#9fb3c8" fontSize={11} textAnchor="end" dominantBaseline="central">
            {`${t('evidence.limit')} ${violation.speedLimit} km/h`}
          </text>
        </>
      ) : (
        <text
          x={936}
          y={573}
          fill="#ffffff"
          fontSize={14}
          fontWeight={600}
          textAnchor="end"
          dominantBaseline="central"
        >
          {t(`kind.${violation.kind}`)}
        </text>
      )}

      <rect
        x={6}
        y={6}
        width={948}
        height={588}
        rx={4}
        fill="none"
        stroke={CYAN}
        strokeWidth={2}
        opacity={0.22}
      />
    </svg>
  );
}

function PlateFrame({ violation }: FrameProps) {
  const { t, lang } = useLang();
  const uid = useId().replace(/:/g, '');

  return (
    <svg viewBox={VIEWBOX} style={{ width: '100%', height: 'auto', display: 'block' }} role="img">
      <defs>
        <clipPath id={`plateclip-${uid}`}>
          <rect x={170} y={412} width={620} height={120} />
        </clipPath>
        <filter id={`scanglow-${uid}`} x="-10%" y="-300%" width="120%" height="700%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <rect x={0} y={0} width={960} height={600} fill="#0e1219" />
      <image
        href="/zoomedseat.png"
        x={0}
        y={0}
        width={960}
        height={600}
        preserveAspectRatio="xMidYMid slice"
      />
      <rect x={0} y={0} width={960} height={600} fill="#000000" opacity={0.20} />

      {cornerBrackets(170, 412, 620, 120, 46, CYAN)}
      <rect
        x={170} y={412} width={620} height={120}
        fill="none" stroke={CYAN} strokeWidth={1} strokeDasharray="4 6" opacity={0.3}
      />
      <g clipPath={`url(#plateclip-${uid})`}>
        <line x1={170} y1={480} x2={790} y2={480} stroke={CYAN} strokeWidth={3} opacity={0.9}>
          <animate attributeName="y1" values="412;532;412" dur="3.4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="412;532;412" dur="3.4s" repeatCount="indefinite" />
        </line>
        <line x1={170} y1={480} x2={790} y2={480} stroke={CYAN} strokeWidth={10} opacity={0.25} filter={`url(#scanglow-${uid})`}>
          <animate attributeName="y1" values="412;532;412" dur="3.4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="412;532;412" dur="3.4s" repeatCount="indefinite" />
        </line>
      </g>

      <rect x={0} y={0} width={960} height={52} fill="#000000" opacity={0.62} />
      <circle cx={26} cy={26} r={7} fill="#ff3b30" />
      <text x={42} y={26} fill="#ffffff" fontSize={16} fontWeight={800} dominantBaseline="central">
        SafeChain MK
      </text>
      <text x={188} y={26} fill={CYAN} fontSize={13} fontWeight={700} dominantBaseline="central">
        ANPR
      </text>
      <text x={250} y={26} fill="#9fb3c8" fontSize={13} dominantBaseline="central">
        {`${t('evidence.camera')} ${violation.cameraId}`}
      </text>
      <text x={936} y={26} fill="#ffffff" fontSize={14} textAnchor="end" dominantBaseline="central">
        {formatDateTime(violation.dateTime, lang)}
      </text>

      <rect
        x={40}
        y={58}
        width={880}
        height={96}
        rx={16}
        fill="#0b0f16"
        opacity={0.92}
        stroke={CYAN}
        strokeOpacity={0.3}
        strokeWidth={1.5}
      />
      <text x={66} y={80} fill={CYAN} fontSize={12} fontWeight={700} letterSpacing={1.6} dominantBaseline="central">
        {t('evidence.plateReading')}
      </text>
      <text
        x={66}
        y={114}
        fill="#eaf6f8"
        fontSize={30}
        fontWeight={800}
        dominantBaseline="central"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        letterSpacing={2}
      >
        {violation.plate}
      </text>
      <text x={66} y={140} fill="#6f8597" fontSize={11} dominantBaseline="central">
        {`${violation.coordinates.lat.toFixed(5)}, ${violation.coordinates.lng.toFixed(5)}`}
      </text>
      <text x={894} y={80} fill="#9fb3c8" fontSize={12} textAnchor="end" dominantBaseline="central">
        {`${t('evidence.confidence')} 99.4%`}
      </text>
      <rect x={694} y={96} width={200} height={10} rx={5} fill="#1f2630" />
      <rect x={694} y={96} width={199} height={10} rx={5} fill={CYAN} />
      <text x={894} y={126} fill="#6f8597" fontSize={11} textAnchor="end" dominantBaseline="central">
        {t('evidence.captured')}
      </text>

      <rect
        x={6}
        y={6}
        width={948}
        height={588}
        rx={4}
        fill="none"
        stroke={CYAN}
        strokeWidth={2}
        opacity={0.22}
      />
    </svg>
  );
}

export function EvidenceFrame({
  violation,
  variant,
}: {
  violation: Violation;
  variant: 'scene' | 'plate';
}) {
  return variant === 'scene' ? (
    <SceneFrame violation={violation} />
  ) : (
    <PlateFrame violation={violation} />
  );
}
