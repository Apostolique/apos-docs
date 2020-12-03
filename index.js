#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs-extra');

program
   .name('apos-docs')
   .version('0.2.0')
   .option('-t, --title <title>', 'title for the project', 'Untitled')
   .option('-d, --desc <description>', 'description for the project', 'No description.')
   .option('-p, --path <path>', 'path to the markdown documentation files', 'docs')
   .option('-b, --base <url>', 'base url for the relative links. For example: "apos-docs"', '')
   .parse(process.argv);

const config = [
   { src: path.join(__dirname, 'src/_includes'), dest: 'apos-docs/_includes' },
   { src: path.join(__dirname, 'src/_plugins'), dest: 'apos-docs/_plugins' },
   { src: path.join(__dirname, 'src/styles'), dest: 'apos-docs/styles' },
   { src: path.join(__dirname, 'src/.eleventy.js'), dest: 'apos-docs/.eleventy.js' },
   { src: path.join(__dirname, 'src/.eleventyignore'), dest: 'apos-docs/.eleventyignore' },
   { src: path.join(__dirname, 'src/postcss.config.js'), dest: 'apos-docs/postcss.config.js' },
   { src: path.join(__dirname, 'src/package.json'), dest: 'apos-docs/package.json' },
   { src: path.join(__dirname, 'src/package-lock.json'), dest: 'apos-docs/package-lock.json' },
   { src: program.path, dest: 'apos-docs/docs' },
   { src: path.join(__dirname, 'src/_data/layout.js'), dest: 'apos-docs/docs/_data/layout.js' },
   { src: 'README.md', dest: 'apos-docs/docs/README.md' },
];

fs.emptyDirSync('apos-docs');

for (const c of config) {
   fs.copySync(c.src, c.dest);
   console.log(`${c.src} -- ${c.dest}`);
}

fs.writeJsonSync('apos-docs/docs/_data/site.json', { title: program.title, description: program.desc, pathPrefix: program.base })
