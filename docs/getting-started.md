# Getting started

## Setup

In your GitHub repository's root, you will need the following:

```
README.md
docs/getting-started.md
docs/img/Icon.png
docs/_data/nav.yml
```

`README.md` and `getting-started.md` are just regular markdown files. You can fill them both with the following content for now:

```md
# Title

Hello World!
```

### Navigation

You can add links to the sidebar by creating the file `docs/_data/nav.yml`. You can replace the GitHub `url` for you own in `social`.

```yml
links:
  - title: Getting Started
    url: /getting-started/
    svg: <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>

social:
  - title: GitHub
    url: https://github.com/Apostolique/apos-docs
    svg: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
```

`links` are shown at the top. The svg is optional.

`social` links are shown at the bottom, the svg is required and the title is used for screen readers or terminal browsers.

Find svg icons from <https://heroicons.com/>. Pick the *medium* version of your chosen icon. Only include the path part of the svg.

## Pipeline

You can automated the site's build process with a GitHub Actions workflow.

Create a `.github/workflows/documentation.yml` file with the following content:
```yml
name: Build documentation

on:
  push:
    paths:
    - 'docs/**'
    - 'README.md'

env:
  TITLE: Apos.Input
  DESCRIPTION: Input library for MonoGame.
  BASE: Apos.Input

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v1
      with:
        node-version: '14.x'
    - name: Install apos-docs
      run: npm install apos-docs -g
    - name: Use apos-docs
      run: |
        apos-docs -t ${{ env.TITLE }} -d '${{ env.DESCRIPTION }}' -b ${{ env.BASE }}
        cd apos-docs
        npm i
        npm run build
        cd -
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./apos-docs/_site
```

Edit the environment variables for your project:

```yml
env:
  TITLE: Apos.Input
  DESCRIPTION: Input library for MonoGame.
  BASE: Apos.Input
```

The `TITLE` variable lets you define the project name to show on the sidebar.

THE `DESCRIPTION` variable is used as metadata in the site.

The `BASE` variable lets you define the subdirectory that the site will end up in. For a repository-level gh-pages deployment `[username].github.io/[repository name]`, you should set the value to `[repository name]`.
