import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Reads the default theme from tokens.css and checks WCAG contrast for every role
// pair the components use, so a palette swap cannot silently break readability.
const css = readFileSync(
  resolve(import.meta.dirname, '../../src/app/tokens.css'),
  'utf8',
);

function declarations(source: string): Map<string, string> {
  const vars = new Map<string, string>();
  const uncommented = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const rootBlock = uncommented.match(/html\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  for (const [, name, value] of rootBlock.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    vars.set(name, value.trim());
  }
  return vars;
}

const vars = declarations(css);

function resolveColour(name: string, depth = 0): string {
  const value = vars.get(name);
  if (value === undefined || depth > 5) throw new Error(`Unknown ${name}`);
  const ref = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  return ref ? resolveColour(ref, depth + 1) : value;
}

function luminance(hex: string): number {
  const channels = hex
    .replace('#', '')
    .match(/../g)
    ?.map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  if (!channels || channels.length !== 3)
    throw new Error(`Not #rrggbb: ${hex}`);
  const [r, g, b] = channels;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground role, background role, minimum ratio]
const pairs: ReadonlyArray<readonly [string, string, number]> = [
  ['--color-text', '--color-background', 7],
  ['--color-text', '--color-card', 7],
  ['--color-text-muted', '--color-background', 4.5],
  ['--color-text-muted', '--color-card', 4.5],
  ['--color-primary', '--color-background', 4.5],
  ['--color-primary', '--color-card', 4.5],
  ['--color-on-primary', '--color-primary', 4.5],
  ['--color-on-primary', '--color-primary-hover', 4.5],
  // Photo frames and placeholders use tint-1 behind text and links.
  ['--color-text', '--color-tint-1', 4.5],
  ['--color-primary', '--color-tint-1', 4.5],
  ['--color-on-inverse', '--color-surface-inverse', 4.5],
  ['--color-accent-on-inverse', '--color-surface-inverse', 4.5],
  // Focus rings are non-text (WCAG 1.4.11): 3:1.
  ['--color-focus', '--color-background', 3],
  ['--color-focus', '--color-card', 3],
  ['--color-focus', '--color-tint-1', 3],
  ['--color-focus-on-inverse', '--color-surface-inverse', 3],
];

describe('default theme contrast', () => {
  it.each(pairs)('%s on %s is at least %s:1', (fg, bg, min) => {
    expect(
      contrast(resolveColour(fg), resolveColour(bg)),
    ).toBeGreaterThanOrEqual(min);
  });

  it('roles reference only palette variables', () => {
    for (const [name, value] of vars) {
      if (name.startsWith('--color-')) {
        expect(value).toMatch(/^var\(--(brand|accent)-[\w-]+\)$/);
      }
    }
  });

  it('components never use palette names or raw colours, only roles', () => {
    const srcDir = resolve(import.meta.dirname, '../../src');
    const sources = readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.(css|tsx)$/.test(f) && !f.endsWith('tokens.css'))
      .map((f) => ({ file: f, text: readFileSync(join(srcDir, f), 'utf8') }));
    expect(sources.length).toBeGreaterThan(10);
    // Shadows may use a neutral black; any other raw colour must be a role.
    const forbidden =
      /var\(--(brand|accent)-|#[0-9a-f]{3,8}\b|rgb\((?!0 0 0 \/)/i;
    const offenders = sources
      .filter(({ text }) => forbidden.test(text))
      .map(({ file }) => file);
    expect(offenders).toEqual([]);
  });
});
