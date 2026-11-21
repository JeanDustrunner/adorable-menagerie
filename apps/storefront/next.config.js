//@ts-check

const isDev = process.env.NODE_ENV === 'development';

// Static CSP without nonces, so pages can stay statically rendered.
// Nonces would force dynamic rendering for every page.
// Source: node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
