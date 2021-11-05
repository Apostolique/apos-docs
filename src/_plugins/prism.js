const prism = require('prismjs');
const PrismLoader = require('./PrismLoader');

prism.hooks.add('wrap', env => {
  if (env.type !== 'keyword') {
    return
  }
  env.classes.push(`keyword-${env.content}`)
})

const CODE_OPTIONS_RE = /\s*{([^}]+)}/

const parseOptions = str => {
  if (!CODE_OPTIONS_RE.test(str)) {
    return {}
  }

  const [, options] = CODE_OPTIONS_RE.exec(str)
  const fn = new Function(`return {${options}}`)
  return fn()
}

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
    return `<div class="code-select"><div class="code-highlight"><pre class="syntax"><code>${lines}${code}</code></pre></div></div>`
  };
  md.renderer.rules.fence = (tokens, i) => {
    const token = tokens[i];

    const fenceOptions = parseOptions(token.info)
    const lang = token.info.replace(CODE_OPTIONS_RE, '').trim();
    const content = token.content;

    const lineStart =
      // It might be 0 so check for undefined
      fenceOptions.lineStart === undefined
        ? // Default line should be 1
          1
        : fenceOptions.lineStart

    let code;
    try {
      if (lang === "" || lang === "text") {
          throw "text";
      }
      code = prism.highlight(content, PrismLoader(lang), lang);
    } catch (error) {
      code = prism.highlight(content, {}, '');
    }

    const lines = generateLineNumbers(code, lineStart - 1);
    return `<div class="code-select"><div class="code-highlight" lang="${lang}"><pre class="syntax"><code>${lines}${code}</code></pre></div></div>`;
  };
};
