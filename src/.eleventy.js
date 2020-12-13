const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const prism = require('./_plugins/prism');
const yaml = require('js-yaml');
const path = require('path');

const pluginTOC = require('eleventy-plugin-toc');

const site = require('./docs/_data/site.json')

let config = {
  ...(process.env.ELEVENTY_PRODUCTION && site.pathPrefix && { pathPrefix: site.pathPrefix }),
  dir: {
    input: 'docs',
    includes: '../_includes',
  },
}

module.exports = eleventyConfig => {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPassthroughCopy("./docs/**/*.{jpg,png,gif}");

  eleventyConfig.addWatchTarget('./_tmp/style.css');

  eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' });

  eleventyConfig.addFilter('version', value => `${value}?v=${String(Date.now())}`);

  eleventyConfig.addFilter('edit', value => {
    let isMainReadme = new RegExp(`^\./${config.dir.input}/README.md$`);
    if (isMainReadme.test(value)) {
      return path.posix.join(site.repo, 'README.md');
    }

    return path.posix.join(site.repo, value);
  });

  eleventyConfig.addDataExtension("yml", contents => yaml.safeLoad(contents));

  eleventyConfig.addCollection('readme', collection =>
    collection.getAllSorted().map(item => {
      if (item.fileSlug === 'README') {
        item.outputPath = item.outputPath.replace('/README', '');
      }
    })
  );

  let options = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    replaceLink(link, env) {
      // Skip outbound link.
      let isOutbound = new RegExp('^(?:[a-z]+:)?//', 'i');
      if (isOutbound.test(link)) { return link }

      // Remove markdown extension.
      let isMarkdown = new RegExp('(?:(readme|index))?.(md|mkd|mkdn|mdwn|mdown|markdown)$', 'i');
      if (isMarkdown.test(link)) {
        link = link.replace(isMarkdown, "");
      }

      // Check if there's an extension.
      let hasExt = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      if (!hasExt.test(link)) {
        // Add trailing slash if missing.
        link = link.replace(/\/?(\?|#|$)/, '/$1');
      }

      // Fix absolute input links.
      let isAbsolute = new RegExp(`^\/${config.dir.input}`);
      if (isAbsolute.test(link)) {
        link = link.replace(isAbsolute, "");
        return eleventyConfig.getFilter("url")(link);
      }

      // TODO: Check if the link points somewhere in the repo outside the docs. Rewrite links to GitHub.

      let isInsideReadmeOrIndex = new RegExp('(?:(readme|index)).(md|mkd|mkdn|mdwn|mdown|markdown)$', 'i');
      if (isInsideReadmeOrIndex.test(env.page.inputPath)) {
        // Fix links inside README.md or index.md files.
        return eleventyConfig.getFilter("url")(link);
      } else {
        // Fix relative links.
        return eleventyConfig.getFilter("url")(`../${link}`);
      }
    }
  };
  let md = markdownIt(options);
  md.use(require('markdown-it-anchor'));
  md.use(require('markdown-it-emoji'));
  md.use(require('markdown-it-footnote'));
  md.use(require('markdown-it-replace-link'));
  md.use(require('markdown-it-sub'));
  md.use(require('markdown-it-sup'));
  prism(md);
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPlugin(pluginTOC)

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: false,
        collapseWhitespace: true,
        decodeEntities: true,
        removeComments: true,
        removeEmptyAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      });
    }

    return content;
  });

  return config;
};
