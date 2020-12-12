import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-cpy';

export default {
  input: './index.js',
  output: [{
    name: 'rollup-plugin-markdown',
    file: 'bundle/dist/markdown.js',
    format: 'umd',
    plugins: [terser()],
    globals: {
      'magic-string': 'MagicString',
      'rollup-pluginutils': 'rollupPluginutils'
    }
  }, {
    file: 'bundle/dist/markdown.es.js',
    format: 'es'
  }],
  plugins: [
    copy({
      files: ["package.json", "README.md"],
      dest: 'bundle'
    })
  ],
  external: ['magic-string', 'rollup-pluginutils'],
};
