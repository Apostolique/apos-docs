// markdown-it plugin for:
// 1. adding target="_blank" to external links
// 2. normalize internal links
module.exports = (md, opts) => {
  let eleventyConfig = opts.eleventyConfig
  let config = opts.config
  let site = opts.site

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    if (hrefIndex >= 0) {
      const hrefAttr = token.attrs[hrefIndex]
      const url = hrefAttr[1]
      const isOutbound = /^(?:[a-z]+:)?\/\//.test(url)
      if (isOutbound) {
        token.attrSet('target', '_blank')
        token.attrSet('rel', 'noopener noreferrer')
      } else if (!url.startsWith('#') && !url.startsWith('mailto:')) {
        normalizeHref(hrefAttr, env)
      }
    }

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    return self.renderToken(tokens, idx, options)
  }

  function normalizeHref(hrefAttr, env) {
      // TODO: Check if the url points somewhere in the repo outside the docs. Rewrite links to GitHub.

    let url = hrefAttr[1]

    const parsed = new URL(url, 'http://a.com')
    let cleanUrl = url.replace(/\#.*$/, '').replace(/\?.*$/, '')

    // Remove markdown extension.
    let isMarkdown = new RegExp('(?:(readme|index))?.(md)$', 'i');
    if (isMarkdown.test(cleanUrl)) {
      cleanUrl = cleanUrl.replace(isMarkdown, "");
    }

    // Check if there's an extension.
    let hasExt = /\.([0-9a-z]+)(?:[\?#]|$)/i;
    if (!hasExt.test(cleanUrl)) {
      // Add trailing slash if missing.
      cleanUrl = cleanUrl.replace(/\/?(\?|#|$)/, '/$1');
    }

    // Fix absolute input links.
    let isAbsolute = new RegExp(`^\/${config.dir.input}`);
    if (isAbsolute.test(cleanUrl)) {
      cleanUrl = cleanUrl.replace(isAbsolute, "");
      cleanUrl = eleventyConfig.getFilter("url")(cleanUrl);
    } else {
      if (env.page.inputPath === './docs/README.md' && cleanUrl.startsWith(`./${site.docs}`)) {
        cleanUrl = cleanUrl.replace(`./${site.docs}`, '')
      }

      let isInsideReadmeOrIndex = /(?:(readme|index)).(md)$/i;
      if (isInsideReadmeOrIndex.test(env.page.inputPath)) {
        // Fix links inside README.md or index.md files.
        cleanUrl = eleventyConfig.getFilter("url")(cleanUrl);
      } else {
        // Fix relative links.
        cleanUrl = eleventyConfig.getFilter("url")(`../${cleanUrl}`);
      }
    }

    url = cleanUrl + parsed.search + parsed.hash
    url = decodeURI(url)

    hrefAttr[1] = url
  }
}
