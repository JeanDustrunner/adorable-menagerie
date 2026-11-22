import type { ReactElement } from 'react';
import type { AnimalName } from './fixtures';

// Illustrations are flat layers. Every colour comes from a theme role
// (see prototype.css), so a palette swap restyles them without touching this file.

const LABELS: Readonly<Record<AnimalName, string>> = {
  bear: 'miś',
  fox: 'lisek',
  rabbit: 'królik',
  owl: 'sowa',
  cat: 'kot',
  elephant: 'słonik',
  frog: 'żabka',
  hedgehog: 'jeżyk',
  penguin: 'pingwin',
  octopus: 'ośmiorniczka',
};

function shapes(name: AnimalName): ReactElement {
  switch (name) {
    case 'bear':
      return (
        <>
          <circle className="ill-deep" cx="50" cy="50" r="30" />
          <circle className="ill-deep" cx="150" cy="50" r="30" />
          <circle className="ill-shade" cx="100" cy="112" r="76" />
          <ellipse className="ill-light" cx="100" cy="138" rx="36" ry="26" />
          <ellipse className="ill-ink" cx="100" cy="124" rx="10" ry="7" />
          <circle className="ill-ink" cx="74" cy="96" r="7" />
          <circle className="ill-ink" cx="126" cy="96" r="7" />
        </>
      );
    case 'fox':
      return (
        <>
          <polygon className="ill-shade" points="38,92 54,22 90,62" />
          <polygon className="ill-shade" points="162,92 146,22 110,62" />
          <circle className="ill-base" cx="100" cy="118" r="70" />
          <ellipse className="ill-light" cx="100" cy="144" rx="30" ry="22" />
          <ellipse className="ill-ink" cx="100" cy="130" rx="8" ry="6" />
          <circle className="ill-ink" cx="76" cy="106" r="7" />
          <circle className="ill-ink" cx="124" cy="106" r="7" />
        </>
      );
    case 'rabbit':
      return (
        <>
          <ellipse className="ill-light" cx="68" cy="46" rx="17" ry="46" />
          <ellipse className="ill-light" cx="132" cy="46" rx="17" ry="46" />
          <circle className="ill-light" cx="100" cy="128" r="64" />
          <ellipse className="ill-accent" cx="68" cy="50" rx="7" ry="32" />
          <ellipse className="ill-accent" cx="132" cy="50" rx="7" ry="32" />
          <ellipse className="ill-deep" cx="100" cy="142" rx="9" ry="6" />
          <circle className="ill-ink" cx="76" cy="116" r="7" />
          <circle className="ill-ink" cx="124" cy="116" r="7" />
        </>
      );
    case 'owl':
      return (
        <>
          <polygon className="ill-deep" points="38,70 52,18 84,52" />
          <polygon className="ill-deep" points="162,70 148,18 116,52" />
          <circle className="ill-deep" cx="100" cy="115" r="76" />
          <ellipse className="ill-light" cx="100" cy="150" rx="44" ry="36" />
          <circle className="ill-light" cx="72" cy="98" r="24" />
          <circle className="ill-light" cx="128" cy="98" r="24" />
          <circle className="ill-ink" cx="72" cy="98" r="10" />
          <circle className="ill-ink" cx="128" cy="98" r="10" />
          <polygon className="ill-base" points="90,116 110,116 100,134" />
        </>
      );
    case 'cat':
      return (
        <>
          <polygon points="40,90 55,25 95,65" />
          <polygon points="160,90 145,25 105,65" />
          <circle cx="100" cy="118" r="68" />
        </>
      );
    case 'elephant':
      return (
        <>
          <ellipse cx="45" cy="95" rx="38" ry="48" />
          <ellipse cx="155" cy="95" rx="38" ry="48" />
          <circle cx="100" cy="95" r="58" />
          <rect x="88" y="120" width="24" height="64" rx="12" />
        </>
      );
    case 'frog':
      return (
        <>
          <circle cx="62" cy="70" r="30" />
          <circle cx="138" cy="70" r="30" />
          <ellipse cx="100" cy="125" rx="88" ry="60" />
        </>
      );
    case 'hedgehog':
      return (
        <>
          <polygon points="20,150 35,80 55,110 70,55 90,95 110,45 125,95 145,60 155,105 180,90 185,150" />
          <ellipse cx="105" cy="140" rx="85" ry="40" />
        </>
      );
    case 'penguin':
      return (
        <>
          <ellipse cx="100" cy="115" rx="58" ry="78" />
          <ellipse cx="42" cy="125" rx="16" ry="44" />
          <ellipse cx="158" cy="125" rx="16" ry="44" />
        </>
      );
    case 'octopus':
      return (
        <>
          <circle cx="100" cy="85" r="62" />
          <rect x="40" y="110" width="20" height="70" rx="10" />
          <rect x="72" y="115" width="20" height="75" rx="10" />
          <rect x="108" y="115" width="20" height="75" rx="10" />
          <rect x="140" y="110" width="20" height="70" rx="10" />
        </>
      );
  }
}

interface AnimalProps {
  readonly name: AnimalName;
  /** Silhouettes (sold work) take one colour from the surrounding tint. */
  readonly silhouette?: boolean;
  readonly className?: string;
}

export function Animal({ name, silhouette = false, className }: AnimalProps) {
  const classes = [
    'animal',
    silhouette ? 'animal--silhouette' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <svg
      className={classes}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Ilustracja: ${LABELS[name]}`}
    >
      {shapes(name)}
    </svg>
  );
}

export function Squiggle() {
  return (
    <svg
      className="squiggle"
      viewBox="0 0 240 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12 C 30 0, 50 24, 80 12 S 130 0, 160 12 S 210 24, 236 8" />
    </svg>
  );
}
