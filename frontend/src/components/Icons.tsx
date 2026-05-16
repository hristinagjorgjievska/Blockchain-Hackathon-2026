import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function makeIcon(children: ReactNode) {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    );
  };
}

export const IconShield = makeIcon(
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m8.5 12 2.5 2.5L16 9" />
  </>,
);

export const IconLock = makeIcon(
  <>
    <rect x="3.5" y="11" width="17" height="10" rx="2.5" />
    <path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11" />
  </>,
);

export const IconAlert = makeIcon(
  <>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4.5" />
    <path d="M12 17.5h.01" />
  </>,
);

export const IconCamera = makeIcon(
  <>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
    <circle cx="12" cy="13" r="3.2" />
  </>,
);

export const IconPin = makeIcon(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </>,
);

export const IconGlobe = makeIcon(
  <>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.5 12h19" />
    <path d="M12 2.5a14 14 0 0 1 0 19 14 14 0 0 1 0-19z" />
  </>,
);

export const IconWallet = makeIcon(
  <>
    <path d="M19 7V5.5a2 2 0 0 0-2-2H5.5a2.5 2.5 0 0 0 0 5H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5.5a2.5 2.5 0 0 1-2.5-2.5V6" />
    <circle cx="16.5" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
  </>,
);

export const IconCard = makeIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3 10h18" />
    <path d="M7 15h4" />
  </>,
);

export const IconCheck = makeIcon(
  <>
    <circle cx="12" cy="12" r="9.5" />
    <path d="m8 12 3 3 5-6" />
  </>,
);

export const IconChevronRight = makeIcon(<path d="m9 6 6 6-6 6" />);
export const IconChevronLeft = makeIcon(<path d="m15 6-6 6 6 6" />);
export const IconArrowLeft = makeIcon(
  <>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </>,
);

export const IconCopy = makeIcon(
  <>
    <rect x="9" y="9" width="12.5" height="12.5" rx="2.5" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>,
);

export const IconExternal = makeIcon(
  <>
    <path d="M14 3h7v7" />
    <path d="M10 14 21 3" />
    <path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
  </>,
);

export const IconSpinner = makeIcon(<path d="M21 12a9 9 0 1 1-6.2-8.6" />);

export const IconClose = makeIcon(
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>,
);

export const IconSearch = makeIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </>,
);

export const IconPhone = makeIcon(
  <path d="M5 3.5h3.6l1.8 4.5-2.3 1.6a13 13 0 0 0 6 6l1.6-2.3 4.5 1.8V20a1.5 1.5 0 0 1-1.6 1.5A17.5 17.5 0 0 1 3.5 5 1.5 1.5 0 0 1 5 3.5z" />,
);

export const IconCar = makeIcon(
  <>
    <path d="M5 17V13l2.2-5.3A2 2 0 0 1 9 6.5h6a2 2 0 0 1 1.8 1.2L19 13v4" />
    <path d="M3 13h18" />
    <circle cx="7.5" cy="17" r="2" />
    <circle cx="16.5" cy="17" r="2" />
  </>,
);

export const IconCalendar = makeIcon(
  <>
    <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
    <path d="M3.5 9.5h17" />
    <path d="M8 2.5v4" />
    <path d="M16 2.5v4" />
  </>,
);

export const IconGauge = makeIcon(
  <>
    <path d="M3.5 17a9 9 0 1 1 17 0" />
    <path d="m12 14 4.5-4.5" />
    <circle cx="12" cy="14" r="1.6" fill="currentColor" stroke="none" />
  </>,
);

export const IconHash = makeIcon(
  <>
    <path d="M4.5 9h15" />
    <path d="M4.5 15h15" />
    <path d="M10.5 3 8.5 21" />
    <path d="M15.5 3 13.5 21" />
  </>,
);

export const IconClock = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.3l3.4 2" />
  </>,
);

export const IconFingerprint = makeIcon(
  <>
    <path d="M5 9a8 8 0 0 1 13.5-1.5" />
    <path d="M7 13a5 5 0 0 1 10 0c0 1.3.1 2.4.4 3.6" />
    <path d="M12 13c0 3 .6 5.6 1.8 8" />
    <path d="M9.4 19.5A11 11 0 0 1 9 13a3 3 0 0 1 6 0c0 1.5.2 2.7.5 3.8" />
  </>,
);

export const IconChain = makeIcon(
  <>
    <path d="M9.5 14.5 14.5 9.5" />
    <path d="M8 12 6 14a3.5 3.5 0 0 0 5 5l2-2" />
    <path d="M16 12l2-2a3.5 3.5 0 0 0-5-5l-2 2" />
  </>,
);

export const IconLinkOff = makeIcon(
  <>
    <path d="M9.5 7.5 11 6a3.5 3.5 0 0 1 5 5l-1.5 1.5" />
    <path d="M14.5 16.5 13 18a3.5 3.5 0 0 1-5-5l1.5-1.5" />
    <path d="m4 4 16 16" />
  </>,
);

export const IconBolt = makeIcon(<path d="M13 2 4 14h6l-1 8 9-12h-6z" />);

export const IconScale = makeIcon(
  <>
    <path d="M12 3.5v17" />
    <path d="M6 20.5h12" />
    <path d="m5 7 14-2.5" />
    <path d="M5 7 2.5 13a3 3 0 0 0 5 0z" />
    <path d="m19 4.5-2.5 7a3 3 0 0 0 5 0z" />
  </>,
);

export const IconArrowRight = makeIcon(
  <>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </>,
);

export const IconChevronDown = makeIcon(<path d="m6 9 6 6 6-6" />);

export const IconMessage = makeIcon(
  <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />,
);

export const IconSignal = makeIcon(
  <>
    <path d="M4 20v-2.5" />
    <path d="M9.3 20v-6.5" />
    <path d="M14.7 20v-10.5" />
    <path d="M20 20V6" />
  </>,
);

export const IconActivity = makeIcon(<path d="M3 12h4l2.5 7 5-14L17 12h4" />);

export const IconKey = makeIcon(
  <>
    <circle cx="7.5" cy="15.5" r="4.2" />
    <path d="M10.6 12.4 20 3" />
    <path d="m15.5 7.5 3 3" />
    <path d="m12.8 10.2 2.6 2.6" />
  </>,
);

export const IconBuilding = makeIcon(
  <>
    <path d="M3 21h18" />
    <path d="M3.5 10 12 4l8.5 6" />
    <path d="M5.5 21V10.5" />
    <path d="M10 21V10.5" />
    <path d="M14 21V10.5" />
    <path d="M18.5 21V10.5" />
  </>,
);

export const IconEye = makeIcon(
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3.2" />
  </>,
);
