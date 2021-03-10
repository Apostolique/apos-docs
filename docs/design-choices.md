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

## Routing

* `README.md` files become `index.html`.
* Other pages such as `page.md` become `page/index.html`.

## Navigation

Stored in `docs/_data/nav.yml` and contains:

* Nested list of links to navigate through the docs' pages.
* List of social media links.
