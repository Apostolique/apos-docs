#!/usr/bin/env node

const { program } = require('commander');

program
   .name('apos-docs')
   .version('0.2.0')
   .option('-t, --title <title>', 'title for the project', 'Untitled')
   .option('-d, --documentation <path>', 'path to the markdown documentation files', 'docs')
   .option('-b, --base-url <url>', 'base url for the relative links. For example: "/apos-docs"', '')
   .option('-T, --theme <path>', 'path to a custom theme')
   .option('-D, --development', 'start a server to preview the documentation site locally')
   .parse(process.argv);

global.params = {
   title: program.title,
   base: program.baseUrl,
   docs: program.documentation,
   theme: program.theme,
};

if (!program.development) {
   process.env.NODE_ENV = 'production';
}
