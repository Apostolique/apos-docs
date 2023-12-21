const fs = require("fs");
const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const yaml = require('js-yaml');
const { parseDocument } = require('htmlparser2');
const domutils = require('domutils');

const site = require('./docs/_data/site.json')

let config = {
  ...(process.env.ELEVENTY_PRODUCTION && site.pathPrefix && { pathPrefix: site.pathPrefix }),
  dir: {
    input: 'docs',
    includes: '../_includes',
  },
  markdownTemplateEngine: false,
}

let version = String(Date.now());

module.exports = eleventyConfig => {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPassthroughCopy("./docs/**/*.{jpg,png,gif}");

  eleventyConfig.addFilter('version', value => `${value}?v=${version}`);

  eleventyConfig.addFilter('pageurlrewrite', value => {
    let isREADME = new RegExp('readme/$', 'i');
    if (isREADME.test(value)) {
      return value.replace(isREADME, "");
    }

    return value;
  });

  eleventyConfig.addFilter('pagetitle', content => {
    let root = parseDocument(content);
    let h1 = domutils.findOne(e => e.tagName === 'h1', root.children);

    let pageTitle = site.title;

    if (h1) {
      let currentTitle = domutils.textContent(h1);
      // Useful on the home page. Don't want "apos-docs - apos-docs"
      if (currentTitle !== site.title) {
        pageTitle = `${currentTitle} - ${site.title}`;
      }
    }

    return pageTitle;
  });

  eleventyConfig.addFilter('pagedescription', content => {
    let root = parseDocument(content);
    let p = domutils.findOne(e => e.tagName === 'p', root.children);

    let pageDescription = site.description;

    if (p) {
      pageDescription = domutils.textContent(p);
    }

    return pageDescription;
  });

  eleventyConfig.addFilter('toc', function(content) {
    let root = parseDocument(content);
    var tags = ['h2', 'h3', 'h4'];

    let isCHANGELOG = new RegExp('changelog/$', 'i');
    if (isCHANGELOG.test(this.page.url)) {
      tags = ['h2'];
    }
    let h = domutils.findAll(e => tags.some(t => e.tagName == t), root.children);

    let prev = [{
      tagName: 'h1',
      href: '',
      title: '',
      children: []
    }];

    for (let e of h) {
      while (e.tagName <= prev[prev.length - 1].tagName) {
        prev.pop();
      }

      let newChild = {
        tagName: e.tagName,
        href: `#${e.attribs.id}`,
        title: domutils.textContent(e),
        children: []
      };

      prev[prev.length - 1].children.push(newChild)
      prev.push(newChild);
    }

    return prev[0].children;
  });

  eleventyConfig.addFilter('edit', value => {
    let isMainReadme = new RegExp(`^\./${config.dir.input}/README.md$`);
    let isChangelog = new RegExp(`^\./${config.dir.input}/changelog.md$`);
    if (isMainReadme.test(value)) {
      value = 'README.md'
    } else if (isChangelog.test(value)) {
      value = 'CHANGELOG.md'
    }

    return new URL(value, site.repo);
  });

  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  eleventyConfig.addCollection('readme', collection =>
    collection.getAllSorted().map(page => {
      if (page.fileSlug === 'README') {
        page.url = page.url.replace('/README', '');
        page.outputPath = page.outputPath.replace('/README', '');
      }
    })
  );

  eleventyConfig.addGlobalData("eleventyComputed.permalink", () => {
    return data => {
      if (data.page.fileSlug.endsWith('.draft')) {
        return false;
      }
      return data.permalink;
    }
  });
  eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", () => {
    return data => {
      if (data.page.fileSlug.endsWith('.draft')) {
        return true;
      }
      return data.eleventyExcludeFromCollections;
    }
  });

  let options = {
    html: true,
    breaks: true,
    linkify: false,
    typographer: true,
  };
  let md = markdownIt(options);
  md.use(require('markdown-it-anchor'), { tabIndex: false });
  md.use(require('markdown-it-emoji'));
  md.use(require('markdown-it-footnote'));
  md.use(require('markdown-it-sub'));
  md.use(require('markdown-it-sup'));
  md.use(require('./_plugins/prism'))
  md.use(require('./_plugins/link'), { eleventyConfig, config, site })
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addTransform('cssinject', async (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      const postcss = require('postcss')
      let css = fs.readFileSync('styles/index.css')

      await postcss([
        require('postcss-import'),
        require('tailwindcss/nesting'),
        require('tailwindcss')(require('./styles/tailwind.config.js').dynamicContent([{ raw: content, extension: 'html' }])),
        require('autoprefixer'),
      ])
        .process(css, { from: 'styles/index.css', to: '_site/index.css' })
        .then(result => {
          const reCSS = new RegExp('<link rel="stylesheet" href="/index.css">')
          const code = `<style type="text/css">\n${result.css}\n</style>`
          content = content.replace(reCSS, (_) => code)
        })
    }

    return content
  })

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        minifyCSS: true,
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
