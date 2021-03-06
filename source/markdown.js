import MagicString from 'magic-string';
import { createFilter } from 'rollup-pluginutils';

// export a function that can take configuration options
const markdown = (options = { validLangs: ['js', 'javascript'] }) => {

    // include or exclude files
    const filter = createFilter(options.include, options.exclude);

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

            const fences = lines.filter(item => item.slice(0, 3) === '```');
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
                .map(string => {
                    const start = position;
                    const end = position + string.length;
                    position = end + 1;
                    // every time a set of backticks is detected,
                    // toggle the code block
                    const backticks = string.slice(0, 3) === '```';
                    if (backticks) {
                        code_block = !code_block;
                    }
                    // Read the options for valid language extensions
                    // toggle code block if valid extension
                    const valid_backticks = options.validLangs.reduce(
                        (prev, lng) => prev || string.slice(0, lng.length + 3) === '```' + lng
                        , false);
                    if (valid_backticks) {
                        valid_code_block = !valid_code_block;
                    }
                    const line = {
                        line: string,
                        start: start,
                        end: end,
                        include: code_block && valid_code_block && !backticks && !valid_backticks
                    };
                    return line;
                });

            // remove excluded lines
            line_data.forEach(line => {
                if (line.include === false) {
                    magicstring.remove(line.start, line.end);
                }
            });

            conso

            return {
                code: magicstring.toString(),
                map: sourceMap ? magicstring.generateMap({ hires: true }) : null
            };

        }

    };

};

export default markdown;