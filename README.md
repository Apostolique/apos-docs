# apos-docs

Documentation static site generator built with Eleventy.

It should work out of the box with minimal configuration. This is meant to be used in combination with GitHub Pages. The final output should work with JavaScript disabled. The site should look good in terminal browsers like Lynx.

[![npm](https://img.shields.io/npm/v/apos-docs.svg)](https://www.npmjs.com/package/apos-docs) [![NuGet](https://img.shields.io/npm/dt/apos-docs.svg)](https://www.npmjs.com/package/apos-docs)

## Description

Takes in a `docs` directory along with your main `README.md`. Compiles the output into an `apos-docs/_site` directory. Adds the content of the `apos-docs/_site` directory to a `gh-pages` branch. The documentation for your repository will be available at `[username].github.io/[repository name]`.

## Documentation

* [Getting started](./docs/getting-started.md)
* [Design choices](./docs/design-choices.md)
* [Markdown showcase](./docs/markdown.md)

## Tech Stack

* [node](https://nodejs.org)
* [eleventy](https://www.11ty.dev/)
* [markdown-it](https://github.com/markdown-it/markdown-it)
* [prism](https://github.com/PrismJS/prism)
* [tailwindcss](https://tailwindcss.com/)

## Used by

* <https://learn-monogame.github.io/>
* <https://apostolique.github.io/Apos.Input/>
* <https://apostolique.github.io/Apos.Gui/>
* <https://apostolique.github.io/Apos.Camera/>
