import { terser } from 'rollup-plugin-terser'

export default {
  input: './source/markdown.js',
  output: [{
    name: 'rollup-plugin-markdown',
    file: 'dist/markdown.js',
    format: 'umd',
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
