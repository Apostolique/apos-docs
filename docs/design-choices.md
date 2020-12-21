# Design choices

## Markdown

* The markdown should be readable by itself from GitHub. This means that links should work in the context of the repository and be rewritten for the static site.
* Custom markdown syntax should be minimized.
* Pages that have multiple headings should have a table of content.
* Each page in the generated site should include an edit link that points to the same page in the GitHub repository.

## Routing

* `README.md` files become `index.html`.
* Other pages such as `page.md` become `page/index.html`.

## Navigation

Stored in `docs/_data/nav.yml` and contains:

* List of links to navigate through the docs' pages.
* List of social media links.
