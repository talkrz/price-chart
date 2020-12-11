import babel from '@rollup/plugin-babel';
import packageConfig from './package.json';

const plugins = [
  babel({
    exclude: 'node_modules/**'
  })
];

module.exports = [
  {
    input: 'src/chart.js',
    plugins: plugins,
    output: {
      file: packageConfig.main,
      format: 'cjs'
    }
  },
  {
    input: 'src/chart.js',
    plugins: plugins,
    output: {
      file: packageConfig.module,
      format: 'esm'
    }
  }
];
