(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('magic-string'), require('rollup-pluginutils')) :
    typeof define === 'function' && define.amd ? define(['magic-string', 'rollup-pluginutils'], factory) :
      (global = global || self, global['rollup-plugin-markdown'] = factory(global.MagicString, global.rollupPluginutils));
}(this, (function (MagicString, rollupPluginutils) {
  'use strict';

  MagicString = MagicString && Object.prototype.hasOwnProperty.call(MagicString, 'default') ? MagicString['default'] : MagicString;

  // export a function that can take configuration options
  const markdown = (options = { validLangs: ['js', 'javascript'] }) => {

    // include or exclude files
    const filter = rollupPluginutils.createFilter(options.include, options.exclude);

    // disable sourcemaps if you want for some reason
    const sourcemap = options.sourceMap !== false && options.sourcemap !== false;

    return {

      name: 'markdown',

      // transform source code
      transform: (code, id) => {

        // exit without transforming if the filter prohibits this id
        if (!filter(id)) return;

        // load source code string into MagicString for transformation
        const magicstring = new MagicString(code);

        // spit input code string along newlines
        const lines = code.split('\n');

        // if it doesn't look like a valid Markdown document containing
        // a reasonable number of code blocks, exit immediately and
        // return the input

        const fences = lines.filter(item => item.startsWith('```'));
        const even_fences = fences.length % 2 === 0;
        const has_fences = fences.length > 0;

        if (!even_fences || !has_fences) {
          const self = { code: code };
          if (sourcemap) {
            self.map = magicstring.generateMap({ hires: true });
          }
          return self;
        }

        // track whether we're inside a code block
        let code_block = false;
        let valid_code_block = false;
        let position = 0;
        // determine which lines to include in the output
        const line_data = lines
          .map((string, idx, a) => {
            const start = position;
            const end = position + string.length;
            position = end + 1;
            // every time a set of backticks is detected,
            // toggle the code block

            const line = {
              line: string,
              start: start,
              end: end,
              include: code_block
            };

            const valid_backticks = options.validLangs.reduce((prev, lng) => prev || string.startsWith('```' + lng), false);

            if (valid_backticks) {
              code_block = true;
            } else if (string.startsWith('```')) {
              code_block = false;
              line.include = false;
            }

            return line;
          });


        // remove excluded lines
        line_data.forEach(line => {
          if (line.include === false)
            magicstring.remove(line.start, line.end);
        });

        return {
          code: magicstring.toString(),
          map: sourcemap ? magicstring.generateMap({ hires: true }) : null
        };

      }

    };

  };

  return markdown;

})));
