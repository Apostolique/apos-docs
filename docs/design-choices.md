# Design choices

High level overview for the apos-docs design decisions.

## Markdown

* The markdown should be readable by itself from GitHub. This means that links must work in the context of the repository and be rewritten for the static site.
* Avoid custom markdown syntax unless absolutely necessary.
* The page's first h1 tag will be used as the page title. The site name will be appended to it.
* The page's first p tag will be used as the page description.
* Pages that have multiple headings will have a table of content generated.
* Each page in the generated site will include an edit link that points to the same page in the GitHub repository.

## Images

* Support jpg, png, gif
* Links to images must work in the context of the repository and be rewritten for the static site.
* Two or more images on the same line are laid out as a row instead of stacking.

## Links

You write links the way that makes sense when reading the markdown on GitHub, and they get
rewritten to match the generated site:

* A link to another page drops the `.md` and gains a trailing slash, so `./button.md` becomes `/button/`. `README.md` resolves to the directory itself.
* Relative links resolve against the page they're written on. Absolute links starting with your docs directory work too, so `/docs/button.md` and `./button.md` reach the same page.
* A link pointing outside the docs directory can't exist on the site, so it's rewritten to the file on GitHub. `../src/styles/` becomes a link into the repository. Images work the same way, except they point at raw.githubusercontent.com so they still render.
* Anchors and `mailto:` links are left alone.
* The base url is added to internal links, so the site works from a subdirectory.

Links to other sites get `target="_blank"` and `rel="noopener noreferrer"`. Links to your own
site are excluded from that, which is what the url option is for. Links rewritten to GitHub
count as leaving the site and open in a new tab too.

## Routing

* `README.md` files become `index.html`.
* Other pages such as `page.md` become `page/index.html`.
* Pages that end in `.draft.md` are excluded from the site.
* A `CHANGELOG.md` in the repository root becomes `changelog/index.html`. Its table of content only lists the top level headings.
* A 404 page is generated for you.

## Navigation

Stored in `docs/_data/nav.yml` and contains:

* Nested list of links to navigate through the docs' pages. A link can hold its own `links` list to group pages under it, as deep as needed.
* List of social media links.
