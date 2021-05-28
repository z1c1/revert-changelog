import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';

export default [{
  input: 'src/index.js',
  output: [{
    file: 'dist/index.js',
    format: 'cjs',
  }],
  plugins: [
    preserveShebangs(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser({
      keep_fnames: true,
    }),
  ],
}];
