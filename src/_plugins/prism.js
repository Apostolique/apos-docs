const prism = require('prismjs');
const PrismLoader = require('./PrismLoader');

prism.hooks.add('wrap', function (env) {
    if (env.type !== 'keyword') {
        return
    }
    env.classes.push('keyword-' + env.content)
})

var generateLineNumbers = (code, lineStart) =>
    `<span aria-hidden="true" class="line-numbers" style="counter-reset: linenumber ${lineStart}">` +
    code
        .trim()
        .split('\n')
        .map(() => `<span></span>`)
        .join('') +
    '</span>'

module.exports = md => {
    md.renderer.rules.code_block = (tokens, i) => {
        const token = tokens[i];
        const code = token.content;
        const lines = generateLineNumbers(code, 0);
        return `<div class="code"><pre class="syntax"><code>${lines}${code}</code></pre></div>`
    };
    md.renderer.rules.fence = (tokens, i) => {
        const token = tokens[i];
        const lang = token.info;
        const content = token.content;

        let code;
        try {
            if (lang === "" || lang === "text") {
                throw "text";
            }
            code = prism.highlight(content, PrismLoader(lang), lang);
        } catch (error) {
            code = prism.highlight(content, {});
        }

        const firstLine = 1;
        const lines = generateLineNumbers(code, firstLine - 1);
        return `<div class="code-highlight" lang="${lang}"><pre class="syntax"><code>${lines}${code}</code></pre></div>`;
    };
};
