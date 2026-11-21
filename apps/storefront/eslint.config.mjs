import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

const config = [
  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  // Next.js rules plus react, react-hooks, import, jsx-a11y and @next/next.
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**/*'],
  },
];

export default config;
