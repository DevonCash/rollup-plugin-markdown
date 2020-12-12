export default {
  name: 'rollup-plugin-markdown',
  exports: 'default',
  input: './index.js',
  output: {
    file: 'build/markdown.js',
    format: 'umd',
    globals: {
      'magic-string': 'MagicString',
      'rollup-pluginutils': 'rollupPluginutils'
    }
  },
  external: ['magic-string', 'rollup-pluginutils'],
};
