#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const package = require('./package.json');

program
   .name('apos-docs')
   .version(package.version)
   .option('-t, --title <title>', 'title for the project', 'Untitled')
   .option('-d, --desc <description>', 'description for the project', 'No description.')
   .option('-p, --path <path>', 'path to the markdown documentation files', 'docs')
   .requiredOption('-b, --base <url>', 'base url for the relative links. For example: "apos-docs"')
   .requiredOption('-r, --repo <url>', 'repo url for edit links. For example: "https://github.com/Apostolique/apos-docs/tree/master/"')
   .parse();

const options = program.opts();

const config = [
   { src: path.join(__dirname, 'src/_includes'), dest: 'apos-docs/_includes' },
   { src: path.join(__dirname, 'src/_plugins'), dest: 'apos-docs/_plugins' },
   { src: path.join(__dirname, 'src/styles'), dest: 'apos-docs/styles' },
   { src: path.join(__dirname, 'src/.eleventy.js'), dest: 'apos-docs/.eleventy.js' },
   { src: path.join(__dirname, 'src/.eleventyignore'), dest: 'apos-docs/.eleventyignore' },
   { src: path.join(__dirname, 'src/postcss.config.js'), dest: 'apos-docs/postcss.config.js' },
   { src: path.join(__dirname, 'src/package.json'), dest: 'apos-docs/package.json' },
   { src: path.join(__dirname, 'src/package-lock.json'), dest: 'apos-docs/package-lock.json' },
   { src: options.path, dest: 'apos-docs/docs' },
   { src: path.join(__dirname, 'src/404.md'), dest: 'apos-docs/docs/404.md' },
   { src: path.join(__dirname, 'src/_data/layout.js'), dest: 'apos-docs/docs/_data/layout.js' },
   { src: 'README.md', dest: 'apos-docs/docs/README.md' },
];

fs.emptyDirSync('apos-docs');

for (const c of config) {
   fs.copySync(c.src, c.dest);
   console.log(`${c.src} -- ${c.dest}`);
}

fs.writeJsonSync('apos-docs/docs/_data/site.json', {
   title: options.title,
   description: options.desc,
   pathPrefix: options.base,
   repo: options.repo
})
