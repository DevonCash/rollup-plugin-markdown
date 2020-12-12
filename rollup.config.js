import { terser } from 'rollup-plugin-terser'

export default {
  input: './index.js',
  output: [{
    name: 'rollup-plugin-markdown',
    file: 'dist/markdown.js',
    format: 'umd',
    plugins: [terser()],
    globals: {
      'magic-string': 'MagicString',
      'rollup-pluginutils': 'rollupPluginutils'
    }
  }, {
    file: 'dist/markdown.es.js',
    format: 'es'
  }],
  external: ['magic-string', 'rollup-pluginutils'],
};
