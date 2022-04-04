// markdown-it plugin for:
// 1. adding target="_blank" to external links
// 2. normalize internal links
const path = require('path')

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
        normalizeHref(hrefAttr, env, token, true)
      }
    }

    return self.renderToken(tokens, idx, options)
  }

  const defaultRender = md.renderer.rules.image
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('src')
    if (hrefIndex >= 0) {
      const hrefAttr = token.attrs[hrefIndex]
      const url = hrefAttr[1]
      const isOutbound = /^(?:[a-z]+:)?\/\//.test(url)
      if (!isOutbound) {
        normalizeHref(hrefAttr, env, token, false)
      }
    }

    return defaultRender(tokens, idx, options, env, self)
  }

  function normalizeHref(hrefAttr, env, token, addAttr) {
    let url = hrefAttr[1]

    const parsed = new URL(url, 'http://a.com')
    let cleanUrl = url.replace(/\#.*$/, '').replace(/\?.*$/, '')

    applyBase = true

    // Remove markdown extension.
    let isMarkdown = /(?:(readme))?.(md)$/i;
    if (isMarkdown.test(cleanUrl)) {
      cleanUrl = cleanUrl.replace(isMarkdown, "");
    }

    // Check if there's an extension.
    let hasExt = /\.([0-9a-z]+)(?:[\?#]|$)/i;
    if (!hasExt.test(cleanUrl)) {
      // Add trailing slash if missing.
      cleanUrl = cleanUrl.replace(/\/?(\?|#|$)/, '/$1');
    }

    // Fix absolute input links inside docs folder.
    let isPageAbsolute = new RegExp(`^\/${site.docs}`);
    if (isPageAbsolute.test(cleanUrl)) {
      cleanUrl = cleanUrl.replace(isPageAbsolute, "");
    } else {
      let isAbsolute = /^\//
      if (!isAbsolute.test(cleanUrl)) {
        if (env.page.inputPath === `./${config.dir.input}/README.md`) {
          cleanUrl = path.posix.join('/', path.posix.dirname(env.page.inputPath), '..', cleanUrl)
        } else {
          cleanUrl = path.posix.join('/', path.posix.dirname(env.page.inputPath), cleanUrl)
        }

        if (cleanUrl.startsWith(`/${config.dir.input}`)) {
          cleanUrl = cleanUrl.replace(`/${config.dir.input}`, '')
        } else if (cleanUrl === '/') {
        } else {
          // The url points somewhere in the repo outside the pages. Rewrite links to GitHub.
          cleanUrl = cleanUrl.replace(/^\//, site.repo)
          applyBase = false

          if (addAttr) {
            token.attrSet('target', '_blank')
            token.attrSet('rel', 'noopener noreferrer')
          }
        }
      } else if (!/^\/$/.test(cleanUrl)) { // Exclude '/'
        // The url points somewhere in the repo outside the pages. Rewrite links to GitHub.
        cleanUrl = cleanUrl.replace(/^\//, site.repo)
        applyBase = false

        if (addAttr) {
          token.attrSet('target', '_blank')
          token.attrSet('rel', 'noopener noreferrer')
        }
      }
    }

    url = cleanUrl + parsed.search + parsed.hash
    url = decodeURI(url)

    if (applyBase) {
      url = eleventyConfig.getFilter("url")(url);
    }

    hrefAttr[1] = url
  }
}
