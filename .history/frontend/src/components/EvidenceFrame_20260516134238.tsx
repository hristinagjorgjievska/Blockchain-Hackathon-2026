import { useId } from 'react';
import { useLang } from '../i18n/LangContext';
import { formatDateTime } from '../lib/format';
import { CAR_PALETTE, type CarColor, type Violation } from '../data/violations';

const VIEWBOX = '0 0 960 600';
const CYAN = '#4fd6e8';

/** Renders an EU-style Macedonian licence plate. */
function plateGroup(x: number, y: number, w: number, plate: string) {
  const h = w / 4.6;
  const r = h * 0.16;
  const stripW = w * 0.16;
  const stars: JSX.Element[] = [];
  if (w > 130) {
    const cx = x + stripW / 2;
    const cy = y + h * 0.34;
    const sr = h * 0.16;
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
      stars.push(
        <circle
          key={i}
          cx={cx + Math.cos(a) * sr}
          cy={cy + Math.sin(a) * sr}
          r={h * 0.045}
          fill="#ffd21e"
        />,
      );
    }
  }
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
      {stars}
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

/** Rear view of a car in local coordinates (0..360 x, 0..300 y). */
function carGroup(color: CarColor, plate: string, uid: string) {
  const p = CAR_PALETTE[color];
  return (
    <g>
      <ellipse cx={180} cy={286} rx={178} ry={24} fill="#000000" opacity={0.34} />
      <rect x={46} y={232} width={58} height={58} rx={15} fill="#101218" />
      <rect x={256} y={232} width={58} height={58} rx={15} fill="#101218" />
      <rect x={57} y={242} width={36} height={34} rx={11} fill="#2b303a" />
      <rect x={267} y={242} width={36} height={34} rx={11} fill="#2b303a" />
      <rect x={68} y={64} width={224} height={112} rx={30} fill={`url(#carGrad-${uid})`} />
      <rect x={96} y={70} width={168} height={8} rx={4} fill="#ffffff" opacity={0.12} />
      <rect x={90} y={84} width={180} height={74} rx={18} fill={p.glass} />
      <path d="M98 88 L150 88 L112 152 L98 152 Z" fill="#ffffff" opacity={0.07} />
      <rect x={22} y={150} width={316} height={112} rx={32} fill={`url(#carGrad-${uid})`} />
      <rect x={22} y={150} width={316} height={4} rx={2} fill="#ffffff" opacity={0.1} />
      <rect x={28} y={176} width={304} height={32} rx={14} fill="#17191e" />
      <rect x={34} y={180} width={100} height={24} rx={10} fill={`url(#tailGrad-${uid})`} />
      <rect x={226} y={180} width={100} height={24} rx={10} fill={`url(#tailGrad-${uid})`} />
      <rect x={46} y={186} width={68} height={12} rx={6} fill="#ff8e6b" opacity={0.9} />
      <rect x={246} y={186} width={68} height={12} rx={6} fill="#ff8e6b" opacity={0.9} />
      <ellipse cx={180} cy={192} rx={17} ry={12} fill={p.shade} />
      <ellipse cx={180} cy={192} rx={8} ry={6} fill={p.body} />
      {plateGroup(106, 214, 148, plate)}
      <rect x={32} y={248} width={296} height={30} rx={14} fill={p.shade} />
      <rect x={66} y={259} width={16} height={9} rx={3} fill="#d23b2e" opacity={0.75} />
      <rect x={278} y={259} width={16} height={9} rx={3} fill="#d23b2e" opacity={0.75} />
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
  const p = CAR_PALETTE[violation.carColor];

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
        <linearGradient id={`carGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.body} />
          <stop offset="100%" stopColor={p.shade} />
        </linearGradient>
        <linearGradient id={`tailGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e64b3c" />
          <stop offset="100%" stopColor="#991f18" />
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
          <path d="M136 378h56M136 396h38" stroke="#334155" strokeWidth={5} strokeLinecap="round" />
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

      <g transform="translate(289,173) scale(1.06)">
        {carGroup(violation.carColor, violation.plate, uid)}
      </g>

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
        SAFE CITY MK
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
  const p = CAR_PALETTE[violation.carColor];

  return (
    <svg viewBox={VIEWBOX} style={{ width: '100%', height: 'auto', display: 'block' }} role="img">
      <defs>
        <linearGradient id={`carGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.body} />
          <stop offset="100%" stopColor={p.shade} />
        </linearGradient>
        <linearGradient id={`tailGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e64b3c" />
          <stop offset="100%" stopColor="#7c1a14" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <rect x={0} y={0} width={960} height={600} fill="#0e1219" />
      <rect x={-40} y={126} width={1040} height={258} rx={46} fill={`url(#carGrad-${uid})`} />
      <rect x={-40} y={126} width={1040} height={7} fill="#ffffff" opacity={0.08} />
      <circle cx={70} cy={255} r={72} fill="#e64b3c" opacity={0.4} filter={`url(#glow-${uid})`} />
      <circle cx={890} cy={255} r={72} fill="#e64b3c" opacity={0.4} filter={`url(#glow-${uid})`} />
      <rect x={-80} y={212} width={250} height={86} rx={22} fill={`url(#tailGrad-${uid})`} opacity={0.92} />
      <rect x={790} y={212} width={250} height={86} rx={22} fill={`url(#tailGrad-${uid})`} opacity={0.92} />

      {plateGroup(220, 200, 520, violation.plate)}

      {cornerBrackets(196, 186, 568, 142, 46, CYAN)}
      <line x1={210} y1={256} x2={750} y2={256} stroke={CYAN} strokeWidth={2.5} opacity={0.85}>
        <animate attributeName="y1" values="196;318;196" dur="3.4s" repeatCount="indefinite" />
        <animate attributeName="y2" values="196;318;196" dur="3.4s" repeatCount="indefinite" />
      </line>

      <rect x={0} y={0} width={960} height={52} fill="#000000" opacity={0.62} />
      <circle cx={26} cy={26} r={7} fill="#ff3b30" />
      <text x={42} y={26} fill="#ffffff" fontSize={16} fontWeight={800} dominantBaseline="central">
        SAFE CITY MK
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
        y={462}
        width={880}
        height={104}
        rx={16}
        fill="#0b0f16"
        opacity={0.92}
        stroke={CYAN}
        strokeOpacity={0.3}
        strokeWidth={1.5}
      />
      <text x={66} y={492} fill={CYAN} fontSize={12} fontWeight={700} letterSpacing={1.6} dominantBaseline="central">
        {t('evidence.plateReading')}
      </text>
      <text
        x={66}
        y={528}
        fill="#eaf6f8"
        fontSize={30}
        fontWeight={800}
        dominantBaseline="central"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        letterSpacing={2}
      >
        {violation.plate}
      </text>
      <text x={66} y={552} fill="#6f8597" fontSize={11} dominantBaseline="central">
        {`${violation.coordinates.lat.toFixed(5)}, ${violation.coordinates.lng.toFixed(5)}`}
      </text>
      <text x={894} y={492} fill="#9fb3c8" fontSize={12} textAnchor="end" dominantBaseline="central">
        {`${t('evidence.confidence')} 99.4%`}
      </text>
      <rect x={694} y={510} width={200} height={10} rx={5} fill="#1f2630" />
      <rect x={694} y={510} width={199} height={10} rx={5} fill={CYAN} />
      <text x={894} y={540} fill="#6f8597" fontSize={11} textAnchor="end" dominantBaseline="central">
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
