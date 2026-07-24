#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const { spawn, spawnSync } = require('child_process');
const package = require('./package.json');

program
   .name('apos-docs')
   .version(package.version)
   .option('-t, --title <title>', 'title for the project', 'Untitled')
   .option('-d, --desc <description>', 'description for the project', 'No description.')
   .option('-p, --path <path>', 'path to the markdown documentation files', 'docs')
   .option('-a, --analytics <analytics>', 'code for your Google Analytics 4 property.')
   .option('-u, --url <url>', 'the GitHub pages url of the generated site. For example: "https://apostolique.github.io/apos-docs/"')
   .option('-s, --serve', 'serve the site locally and rebuild it when the sources change')
   .requiredOption('-b, --base <url>', 'base url for the relative links. For example: "apos-docs"')
   .requiredOption('-r, --repo <url>', 'repo url for edit links. For example: "https://github.com/Apostolique/apos-docs/tree/main/"')
   .parse();

const options = program.opts();

const src = path.join(__dirname, 'src');
const out = 'apos-docs';

const config = [
   { src: path.join(src, '_includes'), dest: `${out}/_includes` },
   { src: path.join(src, '_plugins'), dest: `${out}/_plugins` },
   { src: path.join(src, 'styles'), dest: `${out}/styles` },
   { src: path.join(src, '.eleventy.js'), dest: `${out}/.eleventy.js` },
   { src: path.join(src, '.eleventyignore'), dest: `${out}/.eleventyignore` },
   { src: path.join(src, 'package.json'), dest: `${out}/package.json` },
   { src: path.join(src, 'package-lock.json'), dest: `${out}/package-lock.json` },
   { src: options.path, dest: `${out}/docs` },
   { src: path.join(src, '404.md'), dest: `${out}/docs/404.md` },
   { src: path.join(src, '_data', 'layout.js'), dest: `${out}/docs/_data/layout.js` },
   { src: 'README.md', dest: `${out}/docs/README.md` },
];

if (fs.existsSync('CHANGELOG.md')) {
   config.push({src: 'CHANGELOG.md', dest: `${out}/docs/changelog.md`});
}

// Everything in the output directory is generated, except node_modules and _site
// which are expensive to recreate and safe to reuse between runs.
const keep = ['node_modules', '_site'];

fs.ensureDirSync(out);
for (const entry of fs.readdirSync(out)) {
   if (!keep.includes(entry)) {
      fs.removeSync(path.join(out, entry));
   }
}

copy(true);

if (options.serve) {
   serve();
}

function copy(log) {
   for (const c of config) {
      fs.copySync(c.src, c.dest);
      if (log) console.log(`${c.src} -- ${c.dest}`);
   }

   fs.writeJsonSync(`${out}/docs/_data/site.json`, {
      title: options.title,
      description: options.desc,
      pathPrefix: options.base,
      repo: options.repo,
      docs: options.path,
      analytics: options.analytics,
      url: options.url
   })
}

function serve() {
   if (!fs.existsSync(`${out}/node_modules`)) {
      console.log('Installing the site dependencies...');
      spawnSync('npm', ['ci'], { cwd: out, stdio: 'inherit', shell: true });
   }

   const eleventy = path.resolve(out, 'node_modules/@11ty/eleventy/cmd.js');
   const start = () => spawn(process.execPath, [eleventy, '--serve'], { cwd: out, stdio: 'inherit' });

   // Eleventy reads its config and the plugins it requires once on startup, so those
   // need a fresh process. It picks up everything else on its own.
   const reload = [
      path.join(src, '_plugins'),
      path.join(src, '.eleventy.js'),
      path.join(src, 'package.json'),
   ];

   let child = start();
   let stopping = false;
   let restart = false;
   let timer;

   const changed = file => {
      restart = restart || reload.some(r => file === r || file.startsWith(r + path.sep));

      clearTimeout(timer);
      timer = setTimeout(() => {
         copy(false);

         if (restart) {
            restart = false;
            child.once('exit', () => { if (!stopping) child = start(); });
            child.kill();
         }
      }, 100);
   };

   const watch = target => {
      if (!fs.existsSync(target)) return;

      const dir = fs.statSync(target).isDirectory();
      fs.watch(target, { recursive: dir }, (_, name) =>
         changed(dir && name ? path.join(target, name) : path.resolve(target)));
   };

   watch(src);
   watch(options.path);
   watch('README.md');
   watch('CHANGELOG.md');

   process.on('SIGINT', () => {
      stopping = true;
      child.kill();
      process.exit(0);
   });
}
