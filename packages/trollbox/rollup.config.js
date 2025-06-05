
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { copyFileSync } from 'fs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: ['node_modules/**'],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
    {
      name: 'copy-css',
      generateBundle() {
        try {
          copyFileSync('dist/styles.css', 'dist/trollbox.css');
        } catch (err) {
          console.warn('Could not copy CSS file:', err.message);
        }
      }
    }
  ],
  external: [
    'react', 
    'react-dom',
    '@waku/interfaces',
    '@waku/sdk',
    'waku-dispatcher',
    'ethers',
    'crypto-js'
  ],
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    warn(warning);
  },
};
