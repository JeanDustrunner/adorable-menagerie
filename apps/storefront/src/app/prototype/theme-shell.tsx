'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

// Throwaway prototype control: proves the whole palette can be swapped by
// changing one attribute. Not part of the product.

const THEMES = [
  { id: 'pracownia', label: 'Pracownia' },
  { id: 'jagoda', label: 'Jagoda' },
  { id: 'mech', label: 'Mech' },
] as const;

type ThemeId = (typeof THEMES)[number]['id'];

interface ThemeShellProps {
  readonly children: ReactNode;
  readonly className: string;
}

export function ThemeShell({ children, className }: ThemeShellProps) {
  const [theme, setTheme] = useState<ThemeId>('pracownia');

  return (
    <div className={className} data-theme={theme}>
      {children}
      <div
        className="theme-switch"
        role="group"
        aria-label="Paleta kolorów (prototyp)"
      >
        <span className="theme-switch__title">Paleta</span>
        {THEMES.map((option) => (
          <button
            key={option.id}
            type="button"
            className="theme-switch__button"
            aria-pressed={theme === option.id}
            onClick={() => setTheme(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
